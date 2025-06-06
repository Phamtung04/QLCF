import { Divider, Grid, InputLabel, Skeleton, Stack } from '@mui/material';
import HDSelect from 'components/form/HDSelect';
import React from 'react';
import { gridSpacing } from 'store/constant';

const HDThuPhiFormSkeleton = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <Skeleton variant="text" width="50%" />
                            <Skeleton variant="rectangular" height={50} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md>
                        <Skeleton variant="rectangular" height={35} />
                    </Grid>
                    <Grid item xs={12} md>
                        <Skeleton variant="rectangular" height={35} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <Skeleton variant="text" width="50%" />

                            <Skeleton variant="rectangular" height={50} />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md>
                        <Skeleton variant="rectangular" height={35} />
                    </Grid>
                    <Grid item xs={12} md>
                        <Skeleton variant="rectangular" height={35} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
                <Divider />
            </Grid>
            <Grid item xs={12} md={8}>
                <Stack spacing={1}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="rectangular" height={50} />
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="rectangular" height={50} />
                </Stack>
            </Grid>
        </Grid>
    );
};

export default HDThuPhiFormSkeleton;
