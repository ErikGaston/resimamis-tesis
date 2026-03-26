import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  // const { logged } = useContext(AuthContext);
  return <>{children}</>;

  // return (!logged )
  // ? children
  // : <Navigate to='/' />
};
