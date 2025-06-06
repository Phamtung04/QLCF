// material-ui
import { Avatar, AvatarProps, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import IcLoaiYeuCau from 'assets/images/ic_loai_yeu_cau.svg';

import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// assets

// types
import { ILoaiYeuCau } from 'services/api-services/loaiYeuCau.service';

interface NavItemProps {
    item: ILoaiYeuCau;
    level: number;
    onClickItem: (item, event) => void;
    iconClass?: string;
    isDefaultPathIcon?: boolean;
    iconSX?: AvatarProps['sx'];
    ref?: any;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavGroupItem = ({ item, level, onClickItem, iconClass, isDefaultPathIcon = true, iconSX, ref }: NavItemProps) => {
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    const { borderRadius } = useConfig();
    const dispatch = useDispatch();

    const itemHandler = (event) => {
        matchesSM && dispatch(openDrawer(false));
        onClickItem(item, event);
    };
    return (
        <ListItemButton
            ref={ref}
            sx={{
                borderRadius: `${borderRadius}px`,
                alignItems: 'center',
                backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                flexDirection: 'column',
                height: '100%',
                width: 150.5,
                '&:hover': {
                    background: '#ede7f6 !important'
                }
            }}
            onClick={(event) => itemHandler(event)}
        >
            <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }} className={iconClass}>
                {!Boolean(isDefaultPathIcon) ? <Avatar src={item.icon} sx={iconSX} /> : <Avatar src={IcLoaiYeuCau} />}
            </ListItemIcon>
            <ListItemText
                sx={{ ml: 0, textAlign: 'center' }}
                primary={
                    <Typography variant="h5" color="inherit" fontWeight={600}>
                        {item.displayName}
                    </Typography>
                }
                secondary={
                    item.ghiChu && (
                        <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                            {item.ghiChu}
                        </Typography>
                    )
                }
            />
        </ListItemButton>
    );
};

export default NavGroupItem;
