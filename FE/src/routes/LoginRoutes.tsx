import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import GuestGuard from 'utils/route-guard/GuestGuard';

// login routing
const InputForm = Loadable(lazy(() => import('views/pages/authentication/authentication/InputForm')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <MinimalLayout />
        </NavMotion>
    ),
    children: [
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/order`,
            element: <InputForm />,
            title: 'Thông tin khách hàng'
        }
    ]
};

export default LoginRoutes;
