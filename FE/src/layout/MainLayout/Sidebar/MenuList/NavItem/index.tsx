// material-ui
import { Avatar, AvatarProps, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';
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
    iconExpand?: any;
    isCloseSidebar?: boolean;
}

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({
    item,
    level,
    onClickItem,
    iconClass,
    isDefaultPathIcon = false,
    iconSX,
    ref,
    iconExpand,
    isCloseSidebar = true
}: NavItemProps) => {
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

    const { borderRadius } = useConfig();
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const itemHandler = (event) => {
        isCloseSidebar && matchesSM && dispatch(openDrawer(false));
        onClickItem(item, event);
    };
    return (
        <ListItem disablePadding>
            <ListItemButton
                // disabled={item.disabled}
                ref={ref}
                sx={{
                    borderRadius: `${borderRadius}px`,
                    alignItems: 'center',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    flexDirection: drawerOpen ? 'row' : 'column',
                    p: 1,
                    '&:hover': {
                        background: '#ede7f6 !important'
                    },
                    ml: (level - 1) * 2
                }}
                onClick={(event) => itemHandler(event)}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }} className={iconClass}>
                    {!Boolean(isDefaultPathIcon) ? <Avatar src={item.icon} sx={iconSX} /> : <Avatar src={IcLoaiYeuCau} />}
                </ListItemIcon>
                <ListItemText
                    sx={{ ml: drawerOpen ? 1 : 0, textAlign: drawerOpen ? 'left' : 'center' }}
                    primary={
                        <Typography variant="h5" color="inherit" fontWeight={600}>
                            {drawerOpen && item.nameDrawerOpen ? item.nameDrawerOpen : item.name}
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
                {iconExpand && iconExpand}
            </ListItemButton>
        </ListItem>
    );
};

export default NavItem;
