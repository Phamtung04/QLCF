// action - state management
import { dispatch } from 'store';
import { InitialLoginContextProps } from 'types/auth';
import axiosServices from 'utils/axios';
import { LOGIN, LOGOUT } from './actions';
import { clearInfoBtUser, clearListBtUser, verify } from './slices/bt-user';

// ==============================|| ACCOUNT REDUCER ||============================== //

interface AccountReducerActionProps {
    type: string;
    payload?: InitialLoginContextProps;
}

const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    userInfo: null
};

const accountReducer = (state = initialState, action: AccountReducerActionProps) => {
    switch (action.type) {
        case LOGIN: {
            const { user, userInfo } = action.payload!;
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                user,
                userInfo
            };
        }
        case LOGOUT: {
            dispatch(clearInfoBtUser());
            dispatch(clearListBtUser());
            dispatch(verify(false));
            localStorage.removeItem('ungdungToken');
            localStorage.removeItem('isEkyc');
            localStorage.removeItem('isVerified');
            return {
                ...state,
                isInitialized: true,
                isLoggedIn: false,
                user: null,
                userInfo: null
            };
        }

        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
