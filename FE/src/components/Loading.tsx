import { Backdrop, CircularProgress, LinearProgress, styled } from '@mui/material';
import React, { useImperativeHandle } from 'react';

export const refLoading = React.createRef<{ handleToggle: () => void; handleOpen: () => void; handleClose: () => void }>();
const LoaderWrapper = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1301,
    width: '100%'
});
const Loading = () => {
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const handleClose = () => {
        setOpen(false);
        setProgress(100);
    };
    const handleOpen = () => {
        setProgress(0);
        setOpen(true);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    useImperativeHandle(
        refLoading,
        () => ({
            handleOpen,
            handleClose,
            handleToggle
        }),
        [open]
    );

    return (
        <>
            {open && (
                <LoaderWrapper>
                    <LinearProgress color="primary" />
                </LoaderWrapper>
            )}
        </>
    );
};
export default Loading;
