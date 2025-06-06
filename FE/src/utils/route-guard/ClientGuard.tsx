import useCustomNavigate from 'contexts/UseCustomNavigate';
// project imports
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'store';
import { GuardProps } from 'types';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const ClientGuard = ({ children }: GuardProps) => {
    const { isLoggedIn, user } = useAuth();
    const { navigateToReturnUrl, navigateAndCurrentPath } = useCustomNavigate();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {children}
            {/* <HDIdleTimer /> */}
        </>
    );
};

export default ClientGuard;
