import { AppBar, Box, Collapse, Container, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';
// import HDSelectUserBTDialog from 'components/HDSelectUserBTDialog';
import useConfig from 'hooks/useConfig';
import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'store';
import { drawerMiniWidth, drawerWidth } from 'store/constant';
import Customization from '../Customization';
import Header from './Header';
import Sidebar from './Sidebar';
import getTokenService from 'services/api-services/getToken.service';
import useAuth from 'hooks/useAuth';

// assets

interface MainStyleProps {
    theme: Theme;
    open: boolean;
}

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }: MainStyleProps) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up(1025)]: {
            // marginLeft: -(drawerWidth - drawerMiniWidth),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down(1025)]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '0px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '0px',
            marginRight: '0px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down(1025)]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const { userInfo } = useAuth();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const { searchOpen } = useSelector((state) => state.search);

    const { container } = useConfig();

    const header = useMemo(
        () => (
            <Toolbar sx={{ p: 0, pl: '0 !important' }}>
                <Header />
            </Toolbar>
        ),
        []
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: drawerOpen ? theme.transitions.create('width') : 'none',
                    p: 1
                }}
            >
                {header}
            </AppBar>

            {/* drawer */}
            {userInfo?.permission === 'SUPERADMIN' || userInfo?.permission === 'ADMIN' ? <Sidebar /> : null}

            {/* main content */}

            <Main theme={theme} open={drawerOpen} sx={{ mr: 2 }}>
                {container && (
                    <Container maxWidth="lg">
                        {/* <Collapse in={searchOpen}>
                            <AvancedSearch />
                        </Collapse> */}

                        <Outlet />
                    </Container>
                )}
                {!container && (
                    <>
                        {/* <Collapse in={searchOpen}>
                            <AvancedSearch />
                        </Collapse> */}
                        <Outlet />
                    </>
                )}
                {/* <HDSelectUserBTDialog /> */}
            </Main>
            <Customization />
        </Box>
    );
};

export default MainLayout;
