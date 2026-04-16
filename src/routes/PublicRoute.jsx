import React from "react";
import { Navigate } from "react-router-dom";

/** Rutas solo para invitados (p. ej. login). Con token válido redirige al inicio autenticado. */
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/overview" replace />;
  }
  return <>{children}</>;
};
