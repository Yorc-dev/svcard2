import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import routes from '../../_routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const { t } = useTranslation()

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getTranslatedName = (routeName: string) => {
    const navKey = `nav.${routeName.toLowerCase().replace(/\s+/g, '')}`
    const translated = t(navKey)
    return translated === navKey ? routeName : translated
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    
    // Don't show breadcrumbs for home page
    if (location === '/') {
      return breadcrumbs
    }
    
    location.split('/').reduce((prev, curr, index, array) => {
      if (!curr) return prev // Skip empty strings
      
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index === array.length - 1,
        })
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">{t('nav.home')}</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {getTranslatedName(breadcrumb.name)}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
