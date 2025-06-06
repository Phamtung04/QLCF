import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { matchRoutes, useLocation, useRoutes } from 'react-router-dom';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
    const { user } = useAuth();
    const location = useLocation();
    useEffect(() => {
        document.title = _.get(_.last(matchRoutes([MainRoutes, LoginRoutes], location.pathname)), 'route.title', 'Order System');
    }, [location.pathname]);

    return useRoutes([MainRoutes, LoginRoutes]);
}
