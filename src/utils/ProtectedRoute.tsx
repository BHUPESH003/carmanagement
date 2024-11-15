import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAtomValue } from 'jotai';
// import { userAtom } from '../atoms/authAtom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem('accessToken')
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};