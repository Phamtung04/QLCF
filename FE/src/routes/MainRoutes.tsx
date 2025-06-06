import MainLayout from 'layout/MainLayout';
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import ClientGuard from 'utils/route-guard/ClientGuard';
// sample page routing
const PortalVictoriaPage = Loadable(lazy(() => import('views/portal-victoria')));
const MenuPage = Loadable(lazy(() => import('views/menu-view')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes: RouteObject | any = {
    path: '/',
    element: (
        <ClientGuard>
            <MainLayout />
        </ClientGuard>
    ),
    children: [
        { path: '/', element: <Navigate to="/order/drinks" replace />, index: true, title: 'Menu đồ uống' },
        {
            path: '/order/drinks',
            children: [{ path: '', element: <MenuPage />, title: 'Menu đồ uống' }]
        },
        {
            path: '/order/drinks-v1',
            children: [{ path: '', element: <PortalVictoriaPage />, title: 'Menu đồ uống' }]
        },
        { path: '*', element: <Navigate to="/" replace /> }
    ]
};

export default MainRoutes;
