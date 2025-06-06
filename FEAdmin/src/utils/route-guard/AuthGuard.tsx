// project imports
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'store';
import { GuardProps } from 'types';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: GuardProps) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate(`${process.env.REACT_APP_PATH_CONTEXT}/login`, {
                replace: true
            });
        } else {
            navigate(`${process.env.REACT_APP_PATH_CONTEXT}/rooms`);
        }
    }, [isLoggedIn]);

    return (
        <>
            {children}
            {/* <HDIdleTimer /> */}
        </>
    );
};

export default AuthGuard;
