"""
Internationalization (i18n) Module for SeoLinkX Backend
Provides multi-language support with locale detection from headers
"""
import json
import structlog
from pathlib import Path
from typing import Annotated, Dict, Optional, Any
from functools import lru_cache
from fastapi import Header, Request



logger = structlog.get_logger()

class I18n:
    """Internationalization handler"""

    def __init__(self, locales_dir: str = "locales", default_locale: str = "en"):
        self.locales_dir = Path(__file__).parent.parent / locales_dir        
        self.default_locale = default_locale
        self.translations: Dict[str, Dict[str, Any]] = {}
        self._load_translations()

        print("Locales dir:", self.locales_dir)
        print("Exists:", self.locales_dir.exists())
        print("Loaded locales:", self.translations.keys())

    def _load_translations(self) -> None:
        """Load all translation files from the locales directory"""
        if not self.locales_dir.exists():
            logger.warning(f"Locales directory not found: {self.locales_dir}")
            self.locales_dir.mkdir(parents=True, exist_ok=True)
            return

        for locale_file in self.locales_dir.glob("*.json"):
            locale_code = locale_file.stem
            try:
                with open(locale_file, "r", encoding="utf-8") as f:
                    self.translations[locale_code] = json.load(f)
                logger.info(f"Loaded translations for locale: {locale_code}")
            except Exception as e:
                logger.error(f"Failed to load translations for {locale_code}: {e}")

    def reload_translations(self) -> None:
        """Reload all translations (useful for hot-reloading in development)"""
        self.translations.clear()
        self._load_translations()

    def get_translation(
        self,
        key: str,
        locale: str,
        **kwargs
    ) -> str:
        """
        Get translation for a given key and locale

        Args:
            key: Translation key (supports nested keys with dot notation, e.g., 'errors.not_found')
            locale: Locale code (e.g., 'en', 'ru', 'es')
            **kwargs: Variables to interpolate into the translation

        Returns:
            Translated string with interpolated variables
        """
        # Fallback to default locale if requested locale not available
        if locale not in self.translations:
            logger.debug(f"Locale '{locale}' not found, falling back to '{self.default_locale}'")
            locale = self.default_locale

        # Get translation from nested keys
        translation = self.translations.get(locale, {})
        for part in key.split("."):
            if isinstance(translation, dict):
                translation = translation.get(part)
            else:
                translation = None
                break

        # Fallback to key if translation not found
        if translation is None:
            logger.warning(f"Translation not found: {key} for locale: {locale}")
            translation = key

        # Interpolate variables
        if isinstance(translation, str) and kwargs:
            try:
                translation = translation.format(**kwargs)
            except KeyError as e:
                logger.error(f"Missing variable in translation: {e}")

        return translation if isinstance(translation, str) else key

    def t(self, key: str, locale: str, **kwargs) -> str:
        """Shorthand for get_translation"""
        return self.get_translation(key, locale, **kwargs)

    def get_available_locales(self) -> list[str]:
        """Get list of available locale codes"""
        return list(self.translations.keys())


# Global i18n instance
i18n = I18n()


@lru_cache(maxsize=128)
def get_locale_from_header(accept_language: Optional[str]) -> str:
    """
    Parse Accept-Language header and return best matching locale

    Args:
        accept_language: Accept-Language header value (e.g., 'en-US,en;q=0.9,ru;q=0.8')

    Returns:
        Best matching locale code or default locale
    """
    if not accept_language:
        return i18n.default_locale

    # Parse Accept-Language header
    languages = []
    for lang in accept_language.split(","):
        parts = lang.strip().split(";")
        locale = parts[0].strip()

        # Extract quality factor
        quality = 1.0
        if len(parts) > 1 and parts[1].startswith("q="):
            try:
                quality = float(parts[1].split("=")[1])
            except (ValueError, IndexError):
                quality = 1.0

        # Normalize locale code (en-US -> en, ru-RU -> ru)
        locale_code = locale.split("-")[0].lower()
        languages.append((locale_code, quality))

    # Sort by quality factor (highest first)
    languages.sort(key=lambda x: x[1], reverse=True)

    # Find first available locale
    available_locales = i18n.get_available_locales()
    for locale_code, _ in languages:
        if locale_code in available_locales:
            return locale_code

    return i18n.default_locale


def translate(key: str, locale: Optional[str] = None, **kwargs) -> str:
    """
    Translate a key to the specified locale

    Args:
        key: Translation key
        locale: Locale code (defaults to default locale)
        **kwargs: Variables to interpolate

    Returns:
        Translated string
    """
    if locale is None:
        locale = i18n.default_locale
    return i18n.t(key, locale, **kwargs)

async def get_locale(
    x_locale: Annotated[Optional[str], Header(alias="X-Locale")] = None,
    accept_language: Annotated[Optional[str], Header(alias="Accept-Language")] = None
) -> str:
    """
    FastAPI dependency to extract locale with priority:
    1. X-Locale header (user's explicit choice from frontend)
    2. Accept-Language header (browser default)
    3. Default locale (en)

    Usage:
        @app.get("/endpoint")
        async def endpoint(locale: str = Depends(get_locale)):
            return {"message": t("welcome", locale)}
    
    Frontend should send:
        headers: { "X-Locale": "ru" }  // User's choice from language switcher
    """
    # Priority 1: Explicit locale from frontend (language switcher)
    if x_locale and x_locale.lower() in i18n.get_available_locales():
        return x_locale.lower()
    
    # Priority 2: Accept-Language header
    return get_locale_from_header(accept_language)


async def get_request_locale(request: Request) -> str:
    """
    Alternative dependency that extracts locale from Request object

    Usage:
        @app.get("/endpoint")
        async def endpoint(locale: str = Depends(get_request_locale)):
            return {"message": t("welcome", locale)}
    """
    # Priority 1: X-Locale header
    x_locale = request.headers.get("X-Locale")
    if x_locale and x_locale.lower() in i18n.get_available_locales():
        return x_locale.lower()
    
    # Priority 2: Accept-Language header
    accept_language = request.headers.get("Accept-Language")
    return get_locale_from_header(accept_language)

# Alias for convenience
t = translate
