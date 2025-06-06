import {
    Avatar,
    Badge,
    Box,
    Card,
    Chip,
    ClickAwayListener,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconLogout, IconSettings } from '@tabler/icons';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';
import { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import MorningImg from 'assets/images/morning.png';
import NightImg from 'assets/images/night.png';
import NoonImg from 'assets/images/noon.png';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import AvatarIcon from 'assets/images/icons/ic_avatar.svg';
import { refCustomization } from 'layout/Customization';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));
    const { borderRadius } = useConfig();
    const navigate = useNavigate();

    const styleObjTime =
        new Date().getHours() < 12
            ? { title: 'Chào Buổi Sáng', bgUrl: MorningImg, color: '#333' }
            : new Date().getHours() < 18
            ? { title: 'Chào Buổi Chiều', bgUrl: NoonImg, color: '#fff' }
            : { title: 'Chào Buổi Tối', bgUrl: NightImg, color: '#fff' };

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);

    const anchorRef = useRef<any>(null);
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const userForm = JSON.parse(localStorage.getItem('userForm') || '{}');

    return (
        <>
            <Box>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[800]
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        refCustomization.current?.handleToggle();
                        setOpen(false);
                    }}
                    color="inherit"
                >
                    <IconSettings stroke={1.5} size="1.3rem" />
                </Avatar>
            </Box>
        </>
    );
};

export default ProfileSection;
