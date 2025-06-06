import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import HDDanhSachOrder from './HDDanhSachOrder';

const HDOrderView = () => {
    return (
        <>
            <MainCard sx={{ backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <HDDanhSachOrder />
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>
        </>
    );
};

export default HDOrderView;
