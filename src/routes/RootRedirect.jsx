import { Navigate } from 'react-router-dom';

/** Entrada de la app: sin token → login; con token → home. */
export const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/home' : '/login'} replace />;
};
