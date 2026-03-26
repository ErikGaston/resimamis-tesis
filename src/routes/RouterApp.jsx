import React from 'react'
import { useRoutes } from 'react-router-dom'
import { HomePage, ListVolunteerPage, LoginPage, MotherPage, ProfileVolunteerPage } from '../pages'

import ListBabysPage from '../pages/list/ListBabysPage'
import ListMotherPage from '../pages/list/ListMotherPage'
import { ProfileMotherPage } from '../pages/profile/ProfileMotherPage'
import { StatisticsPage } from '../pages/statistics/StatisticsPage'
import { TasksPage } from '../pages/tasks/TasksPage'
import { VolunteerPage } from '../pages/volunteer/VolunteerPage'
import { SupplyPage } from '../pages/supply/SupplyPage'
import { PrivateRoute } from './PrivateRoute'
import { RootRedirect } from './RootRedirect'

const withAuth = (element) => <PrivateRoute>{element}</PrivateRoute>

export const RouterApp = () => {

  const routes = useRoutes([
    {
      path: '/',
      element:             <RootRedirect />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'home',
      element: withAuth(<HomePage />),
    },
    {
      path: 'overview',
      element: withAuth(<HomePage />),
    },
    {
      path: 'madres',
      element: withAuth(<ListMotherPage />),
    },
    {
      path: 'madre',
      element: withAuth(<MotherPage />),
    },
    {
      path: '/madre/perfil/:id',
      element: withAuth(<ProfileMotherPage />),
    },
    {
      path: 'voluntaria',
      element: withAuth(<VolunteerPage />),
    },
    {
      path: '/voluntaria/perfil/:id',
      element: withAuth(<ProfileVolunteerPage />),
    },
    {
      path: 'tareas',
      element: withAuth(<TasksPage />),
    },
    {
      path: 'estadisticas',
      element: withAuth(<StatisticsPage />),
    },
    {
      path: 'voluntarias',
      element: withAuth(<ListVolunteerPage />),
    },
    {
      path: 'bebes',
      element: withAuth(<ListBabysPage />),
    },
    {
      path: 'insumos',
      element: withAuth(<SupplyPage />),
    },
  ]);

  return routes;

}
