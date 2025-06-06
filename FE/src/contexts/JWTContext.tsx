import useBtUser from 'hooks/useBtUser';
import jwtDecode from 'jwt-decode';
import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoolean } from 'react-use';
import tokenProviderService from 'services/api-services/token-provider.service';
import toastService from 'services/core/toast.service';
import { useDispatch, useSelector } from 'store';
import accountReducer from 'store/accountReducer';
import { LOGIN, LOGOUT } from 'store/actions';
import Swal from 'sweetalert2';
import { KeyedObject } from 'types';
import { InitialLoginContextProps, JWTContextType } from 'types/auth';
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import axiosLocal from 'utils/axiosLocal';

// constant

interface UserInfo {
    name: string;
    room: number;
    role: string;
}
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    const expiredTime = decoded.exp;
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // console.log('expiredTime', expiredTime);
    // console.log('currentTime', currentTime);

    return expiredTime > currentTime;
};

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
        axiosLocal.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
        // axiosLocalServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
        delete axiosLocal.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const dispatchSlice = useDispatch();
    const { authInfo } = useSelector((stateS) => stateS.authLogin);
    const [loadingPrepareData, toggleLoading] = useBoolean(false);
    const { btUserState, setBtUserState } = useBtUser();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<UserInfo>({
        name: 'ADMIN',
        room: 0,
        role: 'ADMIN'
    });
    // const mPrepareBtUser = useMutation((data: any) => nopRutTienService.getBtUser(), {
    //     onSuccess: (res, variables) => {
    //         if (_.isEmpty(res.btUsers) || _.isNil(res.btUsers)) {
    //             dispatchSlice(verify(true));
    //         } else if (res.btUsers.length === 1) {
    //             if (_.get(_.head(res.btUsers), 'role') === 'BTVLT') dispatchSlice(verify(true));
    //             const headData: any = _.head(res.btUsers);
    //             _.set(headData, 'id', _.get(headData, 'userId') + _.get(headData, 'branch'));
    //             _.set(headData, 'name', btUserRole[headData.roleName] + ' - Đơn vị ' + headData.branch);
    //             setBtUserState(headData);
    //             dispatchSlice(setListBtUser(_.get(res, 'btUsers', [])));
    //             dispatchSlice(verify(false));
    //         } else if (!isVerified) {
    //             dispatchSlice(setListBtUser(_.get(res, 'btUsers', [])));
    //             refLoadingBackdrop.current?.handleOpen('Đang đăng nhập . . .');
    //             dispatchSlice(verify(false));
    //             refLoadingBackdrop.current?.handleClose();
    //         }
    //     }
    // });

    // const mCheckPermissionCustomer = useMutation((userData) => customerService.getUserInfo(_.get(userData, 'hdCode', '')), {
    //     onSuccess: (infoForCustomer: any, userData: any) => {
    //         dispatch({
    //             type: LOGIN,
    //             payload: {
    //                 isLoggedIn: true,
    //                 user: { ...userData, hasPermissionCustomer: !_.isEmpty(infoForCustomer.Get_User_InfoResult) }
    //             }
    //         });
    //     },
    //     onError: (err, userData) => {
    //         dispatch({
    //             type: LOGIN,
    //             payload: {
    //                 isLoggedIn: true,
    //                 user: userData
    //             }
    //         });
    //     }
    // });

    // const mPrepareProfile = useMutation(() => axios.get('api/account/my-profile'), {
    //     onSuccess: (res) => {
    //         mCheckPermissionCustomer.mutateAsync(res);
    //         !isVerified && mPrepareBtUser.mutateAsync(res);
    //     },
    //     retry: true
    // });

    const init = async () => {
        try {
            const serviceToken = window.localStorage.getItem('serviceToken');
            if (serviceToken && verifyToken(serviceToken)) {
                const userData: KeyedObject = jwtDecode(serviceToken);
                setSession(serviceToken);
                // mPrepareProfile.mutate();

                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: userData
                    }
                });

                // if (usersCheckLogs.includes(_.get(userData, 'sub', ''))) {
                //     navi('/hdbank-victoria/check-logs', { replace: true });
                // }
            } else {
                logout();
            }
        } catch (err) {
            logout();
        }
    };

    useEffect(() => {
        init();
    }, []);

    // const tokenSession = window.localStorage.getItem('serviceToken');
    // useEffect(() => {
    //     if (!tokenSession) {
    //         logout();
    //     }
    // }, [tokenSession]);

    // useEffect(() => {
    //     toggleLoading(mPrepareBtUser.isLoading || mCheckPermissionCustomer.isLoading || mPrepareProfile.isLoading);
    // }, [mPrepareBtUser.isLoading, mCheckPermissionCustomer.isLoading, mPrepareProfile.isLoading]);

    // useEffect(() => {
    //     console.log('rememberMe', rememberMe);
    // }, [rememberMe]);

    const login = async (username: string, password: string) => {
        const payload = {
            ClientId: 'kiemsoatsau_user',
            ClientSecret: '49C1A7E1-0C79-4A89-A3D6-A37998FB86B0',
            Scope: 'KSSSCOPE',
            username,
            password
        };

        const response = await axios.post(`${process.env.REACT_APP_BASE_API_TOKEN_URL}token/authorizeLogin`, payload);

        // console.log(response);

        const accessToken = _.get(response, 'access_token', '');
        setSession(accessToken);
        if (accessToken) {
            localStorage.setItem('userForm', JSON.stringify(formValues));
            navigate('/react-order/order-drink', { replace: true });
            window.location.reload();
            // localStorage.setItem('ungdungToken', _.get(tokenLoginQuick, 'token', ''));
            init();
        } else {
            toastService.toast('error', 'Lỗi', _.get(response, 'error_description') || 'Đăng nhập không thành công');
        }
        return response;
    };

    const loginViaToken = async (token: string) => {
        const payload = {
            token
        };

        const response = await axios.post('/api/token-provider/passwordless/token', payload);

        const accessToken = _.get(response, 'accessToken', '');
        setSession(accessToken);
        if (accessToken) {
            localStorage.setItem('ungdungToken', token);
            await init();
        }

        return response;
    };

    const loginViaTabletToken = async (token: string) => {
        const verifyPayload = await tokenProviderService.verifyTabletToken(token);

        if (verifyPayload.resultCode !== '00') {
            await Swal.fire({
                icon: 'error',
                title: 'Token không hợp lệ',
                text: 'Vui lòng thử lại hoặc liên hệ bộ phận kỹ thuật'
            });

            return;
        }

        const tokenLoginQuick = await axios.post('/api/token-provider/center-app-token', { usermis: verifyPayload.data?.userId });
        await loginViaToken(_.get(tokenLoginQuick, 'token'));
    };

    const registerDeviceID = async (token: string, engine: string = 'Firebase') => {
        const payload = {
            engine,
            token
        };
        const response = await axios.post('/api/messaging/device-token', payload);
        return response;
    };

    const logout = async () => {
        // console.log('xxxxxx');
        // axios.get('/api/ids4/account/logout');
        // dispatchSlice(resetAuthInfo());
        dispatch({ type: LOGOUT });
        setSession(null);
        // navigate('/react-order/order-drink', { replace: true });
    };

    if (!state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider
            value={{
                ...state,
                registerDeviceID,
                login,
                logout,
                loginViaToken,
                loginViaTabletToken,
                loadingPrepareData
            }}
        >
            {children}
        </JWTContext.Provider>
    );
};

export default JWTContext;
