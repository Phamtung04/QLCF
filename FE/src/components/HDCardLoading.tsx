import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';

const HDCardLoading = ({ title = 'Đang tải dữ liệu . . .' }: { title?: string }) => {
    return (
        <MainCard>
            <Box justifyContent="center" display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="primary" sx={{ mb: 2 }} />
                <Typography>{title}</Typography>
            </Box>
        </MainCard>
    );
};

export default HDCardLoading;
