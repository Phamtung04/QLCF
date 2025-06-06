// material-ui
import { Avatar, Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// assets
import { IconMenu2 } from '@tabler/icons';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';
import LogoutSection from './LogoutSection';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userForm = JSON.parse(localStorage.getItem('userForm') || '{}');
    const { drawerOpen } = useSelector((state) => state.menu);
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
                {/* Replaced LogoSection with Typography displaying "PVT EAUT" */}
                <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
                    PVT EAUT
                </Typography>
            </Box>

            <Box mr={1}>
                <NotificationSection />
            </Box>
            <Box mr={1}>
                <ProfileSection />
            </Box>
            <Box>
                <LogoutSection />
            </Box>
        </>
    );
};

export default Header;
