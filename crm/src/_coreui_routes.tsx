import React, {LazyExoticComponent} from 'react'

const Dashboard = React.lazy(() => import('./views/_coreUI/dashboard/Dashboard.jsx'))
const Colors = React.lazy(() => import('./views/_coreUI/theme/colors/Colors.jsx'))
const Typography = React.lazy(() => import('./views/_coreUI/theme/typography/Typography.jsx'))

// Base
const Accordion = React.lazy(() => import('./views/_coreUI/base/accordion/Accordion.jsx'))
const Breadcrumbs = React.lazy(() => import('./views/_coreUI/base/breadcrumbs/Breadcrumbs.jsx'))
const Cards = React.lazy(() => import('./views/_coreUI/base/cards/Cards.jsx'))
const Carousels = React.lazy(() => import('./views/_coreUI/base/carousels/Carousels.jsx'))
const Collapses = React.lazy(() => import('./views/_coreUI/base/collapses/Collapses.jsx'))
const ListGroups = React.lazy(() => import('./views/_coreUI/base/list-groups/ListGroups.jsx'))
const Navs = React.lazy(() => import('./views/_coreUI/base/navs/Navs.jsx'))
const Paginations = React.lazy(() => import('./views/_coreUI/base/paginations/Paginations.jsx'))
const Placeholders = React.lazy(() => import('./views/_coreUI/base/placeholders/Placeholders.jsx'))
const Popovers = React.lazy(() => import('./views/_coreUI/base/popovers/Popovers.jsx'))
const Progress = React.lazy(() => import('./views/_coreUI/base/progress/Progress.jsx'))
const Spinners = React.lazy(() => import('./views/_coreUI/base/spinners/Spinners.jsx'))
const Tabs = React.lazy(() => import('./views/_coreUI/base/tabs/Tabs.jsx'))
const Tables = React.lazy(() => import('./views/_coreUI/base/tables/Tables.jsx'))
const Tooltips = React.lazy(() => import('./views/_coreUI/base/tooltips/Tooltips.jsx'))

// Buttons
const Buttons = React.lazy(() => import('./views/_coreUI/buttons/buttons/Buttons.jsx'))
const ButtonGroups = React.lazy(() => import('./views/_coreUI/buttons/button-groups/ButtonGroups.jsx'))
const Dropdowns = React.lazy(() => import('./views/_coreUI/buttons/dropdowns/Dropdowns.jsx'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/_coreUI/forms/checks-radios/ChecksRadios.jsx'))
const FloatingLabels = React.lazy(() => import('./views/_coreUI/forms/floating-labels/FloatingLabels.jsx'))
const FormControl = React.lazy(() => import('./views/_coreUI/forms/form-control/FormControl.jsx'))
const InputGroup = React.lazy(() => import('./views/_coreUI/forms/input-group/InputGroup.jsx'))
const Layout = React.lazy(() => import('./views/_coreUI/forms/layout/Layout.jsx'))
const Range = React.lazy(() => import('./views/_coreUI/forms/range/Range.jsx'))
const Select = React.lazy(() => import('./views/_coreUI/forms/select/Select.jsx'))
const Validation = React.lazy(() => import('./views/_coreUI/forms/validation/Validation.jsx'))

const Charts = React.lazy(() => import('./views/_coreUI/charts/Charts.jsx'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/_coreUI/icons/coreui-icons/CoreUIIcons.jsx'))
const Flags = React.lazy(() => import('./views/_coreUI/icons/flags/Flags.jsx'))
const Brands = React.lazy(() => import('./views/_coreUI/icons/brands/Brands.jsx'))

// Notifications
const Alerts = React.lazy(() => import('./views/_coreUI/notifications/alerts/Alerts.jsx'))
const Badges = React.lazy(() => import('./views/_coreUI/notifications/badges/Badges.jsx'))
const Modals = React.lazy(() => import('./views/_coreUI/notifications/modals/Modals.jsx'))
const Toasts = React.lazy(() => import('./views/_coreUI/notifications/toasts/Toasts.jsx'))

const Widgets = React.lazy(() => import('./views/_coreUI/widgets/Widgets.jsx'))

interface IRoutes {
  path: string,
  exact?: boolean,
  name?: string,
  element?: LazyExoticComponent<any>
}

const routes: IRoutes[] = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
