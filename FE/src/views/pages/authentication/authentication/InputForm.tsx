import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BannerLogin from 'assets/images/img_banner_login.png';
import LogoColor from 'assets/images/logo-color.svg';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper from '../AuthWrapper';
import UserForm from '../auth-forms/UserForm';
import { useState } from 'react';

// ================================|| AUTH3 - LOGIN ||================================ //

const InputForm = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const theme = useTheme();
    // const { isLoggedIn } = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <AuthWrapper>
            <Grid container alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                <Grid item xs={12} md={7} lg={7.5} sx={{ px: { xs: 1, sm: 3 }, mb: 2 }}>
                    <Box>
                        <img src={LogoColor} alt="Logo Color" loading="lazy" width="246" />
                    </Box>
                    <Box sx={{ display: 'flex', m: 'auto', maxWidth: { xs: 505, md: 800, lg: 1000 } }}>
                        <img src={BannerLogin} alt="Banner Login" loading="lazy" width="100%" />
                    </Box>
                </Grid>
                <Grid item xs={12} md={5} lg={4.5} sx={{ px: { xs: 1, sm: 3 }, mb: 2 }} justifyContent="center">
                    <AuthCardWrapper>
                        <Grid container spacing={2} alignItems="center" justifyContent="start">
                            <Grid item xs={12}>
                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                    <Typography variant={'h3'} sx={{ color: '#454F5B' }}>
                                        Nhập thông tin để tiếp tục
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <UserForm />
                            </Grid>
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default InputForm;
