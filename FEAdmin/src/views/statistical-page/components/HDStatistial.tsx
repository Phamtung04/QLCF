import MainCard from 'ui-component/cards/MainCard';
import { Box, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import HDDanhSachStatistial from './HDDanhSachStatistial';

const HDStatistial = () => {
    return (
        <>
            <MainCard content={false} sx={{ p: 4, mb: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <HDDanhSachStatistial />
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>
        </>
    );
};

export default HDStatistial;
