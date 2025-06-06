import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BannerLogin from 'assets/images/img_banner_login.png';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper from '../AuthWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import { useState } from 'react';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <AuthWrapper>
            <Grid container alignItems="center" justifyContent="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                <Grid
                    item
                    xs={12}
                    md={7}
                    lg={7.5}
                    sx={{
                        px: { xs: 1, sm: 2 },
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            maxWidth: { xs: 505, md: 800, lg: 1000 },
                            overflow: 'hidden',
                            borderRadius: '16px',
                            justifyContent: 'center' // Canh giữa ảnh để tạo bố cục cân đối
                        }}
                    >
                        <img src={BannerLogin} alt="Banner Login" loading="lazy" width="60%" />
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={5}
                    lg={4.5}
                    sx={{
                        px: { xs: 1, sm: 2 },
                        mb: 2
                    }}
                    display="flex"
                    justifyContent="center" // Đưa form lại gần hơn với ảnh
                >
                    <AuthCardWrapper>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12}>
                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                    <Typography variant={'h3'} sx={{ color: '#454F5B' }}>
                                        Chào mừng đến với
                                    </Typography>
                                    <Typography gutterBottom variant={'h3'} color="black" fontWeight={700}>
                                        Quản lý quán cà phê
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <AuthLogin />
                            </Grid>
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default Login;
