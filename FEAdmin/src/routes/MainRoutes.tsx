import MainLayout from 'layout/MainLayout';
import { element } from 'prop-types';
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import ProtectedRoute from 'utils/route-guard/ProtectedRoute';

// sample page routing
const CategoryPage = Loadable(lazy(() => import('views/category-page')));
const RoomPage = Loadable(lazy(() => import('views/room-page')));
const DrinksPage = Loadable(lazy(() => import('views/drinks-page')));
const OrderPage = Loadable(lazy(() => import('views/order-page')));
const PortalListRoom = Loadable(lazy(() => import('views/choose-room')));
const BuildingPage = Loadable(lazy(() => import('views/building-page')));
const UserPage = Loadable(lazy(() => import('views/user-page')));
const StatistialPage = Loadable(lazy(() => import('views/statistical-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes: RouteObject | any = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        { path: '/', element: <Navigate to="/orderadmin/rooms" replace />, index: true, title: 'Trang chủ' },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/rooms`,
            children: [{ path: '', element: <PortalListRoom />, title: 'Trang chủ' }]
        },
        // {
        //     path: `${process.env.REACT_APP_PATH_CONTEXT}/menu`,
        //     children: [{ path: '', element: <PortalVictoriaPage />, title: 'Menu đồ uống' }]
        // },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-orders`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                    <OrderPage />
                </ProtectedRoute>
            ),
            title: 'Đơn hàng'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-categories`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                    <CategoryPage />
                </ProtectedRoute>
            ),
            title: 'Danh mục'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-drinks`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                    <DrinksPage />
                </ProtectedRoute>
            ),
            title: 'Đồ uống'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-rooms`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                    <RoomPage />
                </ProtectedRoute>
            ),
            title: 'Bàn phục vụ'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/statistical`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']}>
                    <StatistialPage />
                </ProtectedRoute>
            ),
            title: 'Bàn phục vụ'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-towers`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                    <BuildingPage />
                </ProtectedRoute>
            ),
            title: 'Chi nhánh'
        },
        {
            path: `${process.env.REACT_APP_PATH_CONTEXT}/list-users`,
            element: (
                <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                    <UserPage />
                </ProtectedRoute>
            ),
            title: 'Tài khoản'
        },
        { path: '*', element: <Navigate to="/" replace /> }
    ]
};

export default MainRoutes;
