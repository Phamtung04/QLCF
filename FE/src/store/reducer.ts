import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import btUserReducer from './slices/bt-user';
import menuReducer from './slices/menu';
import searchReducer from './slices/search';
import snackbarReducer from './slices/snackbar';
import authRducer from './slices/auth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    authLogin: persistReducer(
        {
            key: 'authLogin',
            storage,
            keyPrefix: 'hd360-'
        },
        authRducer
    ),
    snackbar: snackbarReducer,
    menu: menuReducer,
    search: searchReducer,
    btUser: persistReducer(
        {
            key: 'btUser',
            storage,
            keyPrefix: 'hd360-'
        },
        btUserReducer
    )
});

export default reducer;
