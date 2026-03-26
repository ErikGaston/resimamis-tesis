import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { HomePage, ListVolunteerPage, LoginPage, MotherPage, ProfileVolunteerPage } from '../pages'

import ListBabysPage from '../pages/list/ListBabysPage'
import ListMotherPage from '../pages/list/ListMotherPage'
import { ProfileMotherPage } from '../pages/profile/ProfileMotherPage'
import { StatisticsPage } from '../pages/statistics/StatisticsPage'
import { TasksPage } from '../pages/tasks/TasksPage'
import { VolunteerPage } from '../pages/volunteer/VolunteerPage'
import { SupplyPage } from '../pages/supply/SupplyPage'

export const RouterApp = () => {

  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />,
      children: [
        { element: <Navigate to="/overview" />, index: true },
        { path: 'overview', element: <HomePage /> },
        { path: '/*', element: <Navigate to="/overview" /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'madres',
      element: <ListMotherPage />
    },
    {
      path: 'madre',
      element: <MotherPage />
    },
    {
      path: '/madre/perfil/:id',
      element: <ProfileMotherPage />
    },
    {
      path: 'voluntaria',
      element: <VolunteerPage />
    },
    {
      path: '/voluntaria/perfil/:id',
      element: <ProfileVolunteerPage />
    },
    {
      path: 'tareas',
      element: <TasksPage />
    },
    {
      path: 'estadisticas',
      element: <StatisticsPage />
    },
    {
      path: 'voluntarias',
      element: <ListVolunteerPage />
    },
    {
      path: 'bebes',
      element: <ListBabysPage />
    },
    {
      path: 'insumos',
      element: <SupplyPage />
    },
  ]);

  return routes;

}
