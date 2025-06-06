import { Box, Drawer, Stack, useMediaQuery, Grid } from '@mui/material';
import { CSSObject, Theme, useTheme } from '@mui/material/styles';
import { memo, useMemo } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'store';
import { drawerMiniWidth, drawerWidth } from 'store/constant';
import { openDrawer } from 'store/slices/menu';
import Chip from 'ui-component/extended/Chip';
import LogoSection from '../LogoSection';
import MenuList from './MenuList';

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
    window?: Window;
}

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
});

const Sidebar = ({ window }: SidebarProps) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up(1025));

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const logo = useMemo(
        () => (
            <Box
                sx={{
                    display: { xs: 'block' },
                    [theme.breakpoints.up(1025)]: {
                        display: 'none'
                    }
                }}
            >
                <Grid sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Grid>
            </Box>
        ),
        []
    );

    const drawer = useMemo(
        () => (
            <PerfectScrollbar
                component="div"
                style={{
                    height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 60px)',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    marginTop: '8px'
                }}
            >
                <MenuList />
                {/* <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
                    <Chip label={process.env.REACT_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
                </Stack> */}
            </PerfectScrollbar>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [matchUpMd]
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>
            {matchUpMd ? (
                <Grid component="nav" sx={{ flexShrink: { md1024: 0 }, width: matchUpMd ? 120 : 'auto' }} aria-label="mailbox folders">
                    <Drawer
                        container={container}
                        variant={matchUpMd ? 'persistent' : 'temporary'}
                        anchor="left"
                        open
                        onClose={() => dispatch(openDrawer(!drawerOpen))}
                        sx={{
                            ...(drawerOpen && {
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    background: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    borderRight: 'none',
                                    [theme.breakpoints.up(1025)]: {
                                        top: '62px'
                                    }
                                }
                            }),

                            ...(!drawerOpen && [theme.breakpoints.up(1025)] && {
                                    '& .MuiDrawer-paper': {
                                        width: drawerMiniWidth,
                                        background: theme.palette.background.default,
                                        color: theme.palette.text.primary,
                                        borderRight: 'none',
                                        p: 0,
                                        [theme.breakpoints.up(1025)]: {
                                            top: '62px'
                                        }
                                    }
                                })
                        }}
                        ModalProps={{ keepMounted: true }}
                        color="inherit"
                    >
                        {logo}
                        {drawer}
                    </Drawer>
                </Grid>
            ) : (
                <Grid component="nav" sx={{ flexShrink: { md: 0 }, width: 'auto' }} aria-label="mailbox folders">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor="left"
                        open={drawerOpen}
                        onClose={() => dispatch(openDrawer(!drawerOpen))}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                background: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                borderRight: 'none',
                                [theme.breakpoints.up(1025)]: {
                                    top: '60px'
                                }
                            }
                        }}
                        ModalProps={{ keepMounted: true }}
                        color="inherit"
                    >
                        {drawerOpen && logo}
                        {drawerOpen && drawer}
                    </Drawer>
                </Grid>
            )}
        </>
    );
};

export default memo(Sidebar);
