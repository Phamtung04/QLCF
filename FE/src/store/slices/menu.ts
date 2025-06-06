// types
import { createSlice } from '@reduxjs/toolkit';
import { MenuProps } from 'types/menu';

// initial state
const initialState: MenuProps = {
    drawerOpen: false,
    activeItem: {
        id: 0,
        name: 'Trang chủ',
        normalizedName: 'home'
    }
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveItem(state, action) {
            state.activeItem = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        }
    }
});

export default menu.reducer;

export const { setActiveItem, openDrawer } = menu.actions;
