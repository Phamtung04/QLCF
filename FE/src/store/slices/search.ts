// types
import { createSlice } from '@reduxjs/toolkit';

interface Props {
    searchOpen: boolean;
}
// initial state
const initialState: Props = {
    searchOpen: true
};

// ==============================|| SLICE - MENU ||============================== //

const search = createSlice({
    name: 'search',
    initialState,
    reducers: {
        toggleSearchBox(state) {
            state.searchOpen = !state.searchOpen;
        },
        openSearchBox(state) {
            state.searchOpen = true;
        },
        closeSearchBox(state) {
            state.searchOpen = false;
        }
    }
});

export default search.reducer;

export const { toggleSearchBox, openSearchBox, closeSearchBox } = search.actions;
