import React from 'react'

const Home = React.lazy(() => import('./pages/Home/Home'));
const Users = React.lazy(() => import('./pages/Users'));
const Applications = React.lazy(() => import('./pages/Applications'));

const routes = [
  { path: '/', exact: true, name: 'Home', element: Home },
  { path: '/users', exact: true, name: 'Users', element: Users },
  { path: '/applications', exact: true, name: 'Applications', element: Applications },
];

export default routes;
