import { useNavigate } from 'react-router-dom';
import { useSearchParam } from 'react-use';

// project imports
import imgLoading from 'assets/images/img_login_loading.gif';
import { refLoadingBackdrop } from 'components/LoadingBackdrop';
import { DASHBOARD_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { GuardProps } from 'types';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const loadingImg = () => <img src={imgLoading} alt="loading" />;

const GuestGuard = ({ children }: GuardProps) => {
    const { isLoggedIn, loginViaToken, logout, user, loginViaTabletToken } = useAuth();
    const navigate = useNavigate();
    const token = useSearchParam('token');
    const tabletToken = useSearchParam('tabletToken');

    useEffect(() => {
        if (token) {
            logout();
            refLoadingBackdrop.current?.handleOpen('Đang đăng nhập qua token . . .', loadingImg());
            loginViaToken(token)
                .then((res) => {
                    navigate(DASHBOARD_PATH, { replace: true });
                })
                .catch((res) => {
                    navigate(`${process.env.REACT_APP_PATH_CONTEXT}/login`);
                })
                .finally(() => {
                    refLoadingBackdrop.current?.handleClose();
                });
        }
        if (isLoggedIn) {
            navigate(DASHBOARD_PATH, { replace: true });
        }
    }, [isLoggedIn, token]);

    useEffect(() => {
        if (tabletToken) {
            logout();
            refLoadingBackdrop.current?.handleOpen('Đang đăng nhập qua token . . .', loadingImg());
            loginViaTabletToken(tabletToken)
                .then((res) => {
                    navigate(DASHBOARD_PATH, { replace: true });
                })
                .catch((res) => {
                    navigate(`${process.env.REACT_APP_PATH_CONTEXT}/login`);
                })
                .finally(() => {
                    refLoadingBackdrop.current?.handleClose();
                });
        }
    }, [tabletToken]);

    return <>{children}</>;
};

export default GuestGuard;
