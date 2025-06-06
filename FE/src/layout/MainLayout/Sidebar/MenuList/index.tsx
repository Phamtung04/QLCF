import { memo } from 'react';

// material-ui

// project imports
import { List } from '@mui/material';
import IcTrangChu from 'assets/images/ic_trang_chu.svg';
import IcOrder from 'assets/images/online-order.png';
import IcDanhMuc from 'assets/images/ic_category.png';
import IcDoUong from 'assets/images/drink.png';
import IcPhongHop from 'assets/images/conversation.png';
import { useNavigate } from 'react-router-dom';
import { ILoaiYeuCau } from 'services/api-services/loaiYeuCau.service';
import { EnumMenu } from 'store';

import NavItem from './NavItem';

const menuItems: ILoaiYeuCau[] = [
    {
        id: EnumMenu.Home,
        icon: IcTrangChu,
        name: 'Trang chủ'
    }
];
const MenuList = () => {
    const navi = useNavigate();

    const handleClickItem = (item) => {
        switch (item.id) {
            case EnumMenu.Home:
                navi('/order/drinks', { replace: true });
                break;
            default:
                break;
        }
    };

    return (
        <List>
            {_.map(menuItems, (item) => (
                <NavItem
                    key={item.id}
                    item={item}
                    iconSX={{
                        background: 'none',
                        overflow: 'inherit'
                    }}
                    level={1}
                    onClickItem={() => handleClickItem(item)}
                />
            ))}
        </List>
    );
};

export default memo(MenuList);
