import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  
  // const { logged } = useContext( AuthContext )
  return (true)
    ? children
    : <Navigate to='/login' />
}
