// material-ui
import { Box } from '@mui/material';
// project import
import MainCard, { MainCardProps } from 'ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }: MainCardProps) => (
    <MainCard
        sx={{
            maxWidth: { xs: 505, lg: 505 },
            width: '100%',
            padding: { xs: 1.5, md: 1 },
            m: 'auto',
            '& > *': {
                flexGrow: 1,
                flexBasis: '50%'
            },
            backgroundColor: '#FFFF',
            borderRadius: 3,
            boxShadow: 10
        }}
        content={false}
        {...other}
    >
        <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
    </MainCard>
);

export default AuthCardWrapper;
