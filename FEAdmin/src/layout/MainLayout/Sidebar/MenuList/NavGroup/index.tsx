import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';

// material-ui
import { ClickAwayListener, Grid, Paper, Popover, Popper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { gridSpacing } from 'store/constant';

// assets

// ==============================|| NOTIFICATION ||============================== //

const NavGroup = ({ items }, ref) => {
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleToggle = (event) => {
        setOpen((prevOpen) => !prevOpen);
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        setOpen(false);

        setAnchorEl(null);
    };

    useImperativeHandle(ref, () => ({
        handleToggle
    }));

    return (
        <>
            <Popper
                anchorEl={anchorEl}
                placement="right"
                open={open}
                role={undefined}
                transition
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 16]
                            }
                        }
                    ]
                }}
                sx={{ maxWidth: 500, zIndex: 100 }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={'left'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard
                                        border={false}
                                        elevation={16}
                                        content={false}
                                        boxShadow
                                        shadow={theme.shadows[16]}
                                        sx={{ p: 1 }}
                                    >
                                        <Grid container>{items}</Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default forwardRef(NavGroup);
