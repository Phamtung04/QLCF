// types
import { createSlice } from '@reduxjs/toolkit';

interface Props {
    btUser: any;
    btUserUnauthorize: any;
    lstBtUser: any[];
    isVerified: boolean;
    isNeedVerify: boolean;
}
// initial state
const initialState: Props = {
    btUser: {},
    btUserUnauthorize: {},
    lstBtUser: [],
    isVerified: false,
    isNeedVerify: false
};

// ==============================|| SLICE - MENU ||============================== //

const btUser = createSlice({
    name: 'btUser',
    initialState,
    reducers: {
        clearInfoBtUser(state) {
            state.btUser = {};
        },
        setInfoBtUser(state, action) {
            state.btUser = action.payload;
        },
        extendInfoBtUser(state, action) {
            state.btUser = { ...state.btUser, ...action.payload };
        },

        setListBtUser(state, action) {
            state.lstBtUser = action.payload;
        },
        clearListBtUser(state) {
            state.lstBtUser = [];
        },
        verify(state, action) {
            state.isVerified = action.payload;
            state.isNeedVerify = !action.payload;
        },
        needVerify(state, action) {
            state.isNeedVerify = action.payload;
        },
        clearInfoBtUserUnauthorize(state) {
            state.btUserUnauthorize = {};
        },
        setInfoBtUserUnauthorize(state, action) {
            state.btUserUnauthorize = action.payload;
        }
    }
});

export default btUser.reducer;

export const {
    setInfoBtUser,
    extendInfoBtUser,
    clearInfoBtUser,
    setListBtUser,
    clearListBtUser,
    verify,
    needVerify,
    setInfoBtUserUnauthorize,
    clearInfoBtUserUnauthorize
} = btUser.actions;
