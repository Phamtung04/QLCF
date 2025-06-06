import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import GuestGuard from 'utils/route-guard/GuestGuard';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication/Login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: `/orderadmin/login`,
            element: <AuthLogin />,
            title: 'Đăng nhập'
        }
    ]
};

export default LoginRoutes;
