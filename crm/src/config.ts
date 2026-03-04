
const baseUrl = import.meta.env.VITE_CRM_BASE_URL || window.location.origin;
// const webSocketSecure = `${origin.replace("https", "wss").replace("http", "ws").replace("/api","")}`;

const config = {
  baseUrl,
  apiUrl: baseUrl + '/api',
  storageUrl: baseUrl + '/api/storage/',
  // webSocketSecure
};

export const LOCAL_STORAGE_THEME = 'svcard-crm-theme';
export const LOCAL_STORAGE_LANGUAGE = 'svcard-crm-lang';

export default config;
