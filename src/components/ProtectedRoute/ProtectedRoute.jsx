import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to sign in page while saving the attempted location
    return <Navigate to="/SignInform" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;