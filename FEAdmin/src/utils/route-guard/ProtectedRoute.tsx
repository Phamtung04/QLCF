// utils/route-guard/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth'; // Adjust the path as necessary

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const { userInfo } = useAuth();

    if (!allowedRoles.includes(userInfo?.permission ?? '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
