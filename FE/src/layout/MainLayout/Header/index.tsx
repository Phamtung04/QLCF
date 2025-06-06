// material-ui
import { Avatar, Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// assets
import { IconMenu2 } from '@tabler/icons';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';
// project imports
import LogoSection from '../LogoSection';
import InfoSection from './InfoSection';
import LocalizationSection from './LocalizationSection';
import LogoutSection from './LogoutSection';
import NotificationSection from './NotificationSection';
import MarqueeSection from './MarqueeSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import SearchSection from './SearchSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userForm = JSON.parse(localStorage.getItem('userForm') || '{}');
    const { drawerOpen } = useSelector((state) => state.menu);
    // const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();
    const matchUpMd = useMediaQuery(theme.breakpoints.up(1025));
    const matchDownMd = useMediaQuery(theme.breakpoints.down(1025));
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    ml: 3,
                    [theme.breakpoints.down(1025)]: {
                        padding: 1
                    }
                }}
            >
                <LogoSection />
            </Box>

            <Box mr={1}>
                <NotificationSection />
            </Box>
            <Box mr={1}>
                <ProfileSection />
            </Box>
        </>
    );
};

export default Header;
