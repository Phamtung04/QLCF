// types
import { createSlice } from '@reduxjs/toolkit';

interface Props {
    authInfo: {
        rememberMe: boolean;
        username: string;
        password: string;
    };
}
// initial state
const initialState: Props = {
    authInfo: {
        rememberMe: false,
        username: '',
        password: ''
    }
};

// ==============================|| SLICE - MENU ||============================== //

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRememberMe(state, action) {
            state.authInfo.rememberMe = action.payload;
        },
        setRememberAccount(state, action) {
            state.authInfo.username = action.payload?.username;
            state.authInfo.password = action.payload?.password;
        },
        resetAuthInfo: (state) => {
            state.authInfo = initialState.authInfo;
        }
    }
});

export default auth.reducer;

export const { setRememberMe, setRememberAccount, resetAuthInfo } = auth.actions;
