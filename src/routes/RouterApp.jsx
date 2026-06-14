import React, { lazy, Suspense } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import { HomePage, ListVolunteerPage, LoginPage, MotherPage, ProfileVolunteerPage } from '../pages'
import ListBabysPage from '../pages/list/ListBabysPage'
import ListMotherPage from '../pages/list/ListMotherPage'
import { ProfileMotherPage } from '../pages/profile/ProfileMotherPage'
import { TasksPage } from '../pages/tasks/TasksPage'
import { VolunteerPage } from '../pages/volunteer/VolunteerPage'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { RootRedirect } from './RootRedirect'
import { ErrorBoundary } from '../components/common/ErrorBoundary'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const StatisticsPage = lazy(() =>
  import('../pages/statistics/StatisticsPage').then(m => ({ default: m.StatisticsPage }))
)
const CoordinacionPage = lazy(() => import('../pages/coordinacion/CoordinacionPage'))
const SupplyPage = lazy(() =>
  import('../pages/supply/SupplyPage').then(m => ({ default: m.SupplyPage }))
)
const ProfileBabyPage = lazy(() =>
  import('../pages/profile/ProfileBabyPage').then(m => ({ default: m.ProfileBabyPage }))
)

const withAuth = (element) => <PrivateRoute>{element}</PrivateRoute>

const SuspenseFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
    <CircularProgress style={{ color: '#152C70' }} />
  </Box>
)

export const RouterApp = () => {
  const location = useLocation()

  const routes = useRoutes([
    {
      path: '/',
      element: <RootRedirect />,
    },
    {
      path: 'login',
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: 'home',
      element: <Navigate to="/overview" replace />,
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
      path: 'bebe/perfil/:id',
      element: withAuth(<ProfileBabyPage />),
    },
    {
      path: 'insumos',
      element: withAuth(<SupplyPage />),
    },
    {
      path: 'coordinacion',
      element: withAuth(<CoordinacionPage />),
    },
  ])

  return (
    <ErrorBoundary locationKey={location.key}>
      <Suspense fallback={<SuspenseFallback />}>
        {routes}
      </Suspense>
    </ErrorBoundary>
  )

}
