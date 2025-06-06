import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import HDDanhSachDanhMuc from './HDDanhSachDanhMuc';

const HDCategoryView = () => {
    return (
        <>
            <MainCard sx={{ backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <HDDanhSachDanhMuc />
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>
        </>
    );
};

export default HDCategoryView;
