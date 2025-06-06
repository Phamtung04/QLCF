import { Backdrop, Box, CircularProgress, styled, Typography } from '@mui/material';
import React, { useImperativeHandle, forwardRef, useState } from 'react';

export const refLoadingBackdrop = React.createRef<{
    handleToggle: () => void;
    handleOpen: (title?: string, loading?: React.ReactNode) => void;
    handleClose: () => void;
}>();

const LoadingBackdrop = forwardRef((props: { open?: boolean }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [title, setTitle] = useState<string | null>(null);
    const [progress, setProgress] = useState<React.ReactNode>(<CircularProgress color="primary" sx={{ mb: 2 }} />);

    const handleClose = () => {
        setInternalOpen(false);
    };

    const handleOpen = () => {
        setInternalOpen(true);
    };

    const handleToggle = () => {
        setInternalOpen(!internalOpen);
    };

    useImperativeHandle(
        ref,
        () => ({
            handleOpen: (titleLoading?: string, progressLoading?: React.ReactNode) => {
                handleOpen();
                if (titleLoading) setTitle(titleLoading);
                if (progressLoading) setProgress(progressLoading);
            },
            handleClose,
            handleToggle
        }),
        []
    );

    const isOpen = props.open !== undefined ? props.open : internalOpen;

    return (
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} open={isOpen}>
            <Box justifyContent="center" display="flex" flexDirection="column" alignItems="center">
                {progress}
                {title && <Typography>{title}</Typography>}
            </Box>
        </Backdrop>
    );
});

LoadingBackdrop.displayName = 'LoadingBackdrop';

export default LoadingBackdrop;
