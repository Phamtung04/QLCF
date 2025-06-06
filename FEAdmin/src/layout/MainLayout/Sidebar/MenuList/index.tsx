import React, { memo, useState } from 'react';
import { Grid, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import OrderIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import DrinkIcon from '@mui/icons-material/LocalCafe';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useNavigate } from 'react-router-dom';
import { ILoaiYeuCau } from 'services/api-services/loaiYeuCau.service';
import { EnumMenu } from 'store';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { BarChart } from '@mui/icons-material';

const menuItems: ILoaiYeuCau[] = [
    {
        id: EnumMenu.Home,
        icon: <HomeIcon />,
        name: 'Trang chủ'
    },
    {
        id: EnumMenu.Order,
        icon: <OrderIcon />,
        name: 'Đơn hàng'
    },
    {
        id: EnumMenu.Category,
        icon: <CategoryIcon />,
        name: 'Danh mục'
    },
    {
        id: EnumMenu.Drink,
        icon: <DrinkIcon />,
        name: 'Đồ uống'
    },
    {
        id: EnumMenu.Building,
        icon: <ApartmentIcon />,
        name: 'Chi nhánh'
    },
    {
        id: EnumMenu.Room,
        icon: <TableRestaurantIcon />,
        name: 'Bàn phục vụ'
    },
    {
        id: EnumMenu.User,
        icon: <PersonIcon />,
        name: 'Tài khoản'
    },
    {
        id: EnumMenu.Statistial,
        icon: <BarChart />, // Icon cho menu Thống kê
        name: 'Thống kê'
    }
];

const MenuList = () => {
    const { userInfo } = useAuth();
    const navi = useNavigate();
    const [selectedItem, setSelectedItem] = useState<ILoaiYeuCau | null>(null);
    const theme = useTheme();
    const handleClickItem = (item: ILoaiYeuCau) => {
        setSelectedItem(item);
        switch (item.id) {
            case EnumMenu.Home:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/rooms`, { replace: true });
                break;
            case EnumMenu.Order:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-orders`, { replace: true });
                break;
            case EnumMenu.Category:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-categories`, { replace: true });
                break;
            case EnumMenu.Drink:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-drinks`, { replace: true });
                break;
            case EnumMenu.Room:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-rooms`, { replace: true });
                break;
            case EnumMenu.Building:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-towers`, { replace: true });
                break;
            case EnumMenu.User:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/list-users`, { replace: true });
                break;
            case EnumMenu.Statistial:
                navi(`${process.env.REACT_APP_PATH_CONTEXT}/statistical`, { replace: true });
                break;
            default:
                break;
        }
    };

    function filterMenusByUserInfo(menus: ILoaiYeuCau[]) {
        switch (userInfo?.permission) {
            case 'RECEPTIONIST':
            case 'BARTENDING':
                return menus.filter((menu) => menu.name === 'Trang chủ');
            case 'ADMIN':
                return menus.filter(
                    (menu) =>
                        menu.name === 'Trang chủ' ||
                        menu.name === 'Đơn hàng' ||
                        menu.name === 'Danh mục' ||
                        menu.name === 'Đồ uống' ||
                        menu.name === 'Bàn phục vụ' ||
                        menu.name === 'Thống kê' // Chỉ hiển thị Thống kê cho ADMIN
                );
            default:
                return menus;
        }
    }

    const filteredMenuItems = filterMenusByUserInfo(menuItems);

    return (
        <List>
            {filteredMenuItems.map((item) => (
                <ListItemButton
                    key={item.id}
                    onClick={() => handleClickItem(item)}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: selectedItem?.id === item.id ? theme.palette.secondary.light : 'transparent',
                        '&:hover': {
                            backgroundColor: selectedItem?.id === item.id ? theme.palette.secondary.light : theme.palette.secondary.light,
                            color: selectedItem?.id === item.id ? theme.palette.secondary.light : theme.palette.secondary.light
                        },
                        minWidth: 'fit-content',
                        padding: '8px',
                        marginBottom: '5px'
                    }}
                >
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item>
                            <ListItemIcon
                                sx={{
                                    color: selectedItem?.id === item.id ? theme.palette.secondary.main : undefined,
                                    justifyContent: 'center'
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                        </Grid>
                        <Grid item>
                            <ListItemText primary={item.name} />
                        </Grid>
                    </Grid>
                </ListItemButton>
            ))}
        </List>
    );
};

export default memo(MenuList);
