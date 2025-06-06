import React from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook để sử dụng theme của Material-UI
import HDMenuView from './components/HDMenuView';
import HDMenuViewMobile from './components/mobile/HDMenuViewMobile';
import useAuth from 'hooks/useAuth';

const MenuPage = () => {
    const theme = useTheme(); // Sử dụng hook useTheme để truy cập theme của Material-UI
    const isMdUp = useMediaQuery(theme.breakpoints.up('md')); // Kiểm tra nếu màn hình lớn hơn hoặc bằng md

    return isMdUp ? <HDMenuView /> : <HDMenuViewMobile />;
};

export default MenuPage;
