import { createRef, useImperativeHandle, useState } from 'react';

// material-ui
import { Drawer, Fab, Grid, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconSettings } from '@tabler/icons';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import BorderRadius from './BorderRadius';
import BoxContainer from './BoxContainer';
import FontFamily from './FontFamily';
import InputFilled from './InputFilled';
import Layout from './Layout';
import PresetColor from './PresetColor';
import UrlDevice from './UrlDevice';

// ==============================|| LIVE CUSTOMIZATION ||============================== //
export const refCustomization = createRef<any>();

const Customization = () => {
    const theme = useTheme();

    // drawer on/off
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };
    useImperativeHandle(
        refCustomization,
        () => ({
            handleToggle
        }),
        []
    );

    return (
        <>
            {/* toggle button */}
            {/* <Tooltip title="Live Customize">
                <Fab
                    component="div"
                    onClick={handleToggle}
                    size="medium"
                    variant="circular"
                    color="primary"
                    sx={{
                        borderRadius: 0,
                        borderTopLeftRadius: '50%',
                        borderBottomLeftRadius: '50%',
                        borderTopRightRadius: '50%',
                        borderBottomRightRadius: '4px',
                        top: '25%',
                        position: 'fixed',
                        right: 10,
                        zIndex: theme.zIndex.speedDial,
                        boxShadow: theme.customShadows.secondary
                    }}
                >
                    <AnimateButton type="rotate">
                        <IconButton color="inherit" size="large" disableRipple>
                            <IconSettings />
                        </IconButton>
                    </AnimateButton>
                </Fab>
            </Tooltip> */}

            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        width: 280
                    }
                }}
            >
                {open && (
                    <PerfectScrollbar component="div">
                        <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                            {/* <Grid item xs={12}>
                                <Layout />
                            </Grid> */}
                            <Grid item xs={12}>
                                {/* Theme Preset Color */}
                                <PresetColor />
                            </Grid>
                            <Grid item xs={12}>
                                {/* font family */}
                                <FontFamily />
                            </Grid>
                            <Grid item xs={12}>
                                {/* border radius */}
                                <BorderRadius />
                            </Grid>
                            <Grid item xs={12}>
                                {/* filled with outline textfield */}
                                <InputFilled />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <BoxContainer />
                            </Grid> */}

                            {/* <Grid item xs={12}>
                                <UrlDevice />
                            </Grid> */}
                        </Grid>
                    </PerfectScrollbar>
                )}
            </Drawer>
        </>
    );
};

export default Customization;
