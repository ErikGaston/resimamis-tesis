import { Navigate } from 'react-router-dom';

/** Entrada de la app: sin token → login; con token → overview (inicio autenticado). */
export const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/overview' : '/login'} replace />;
};
