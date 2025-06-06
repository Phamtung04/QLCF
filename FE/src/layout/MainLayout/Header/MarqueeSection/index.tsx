import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Marquee from 'react-fast-marquee';

const MarqueeSection = () => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box sx={{ mr: 1, backgroundColor: '#FFC20E', p: 1, borderRadius: 2 }}>
            <Marquee speed={50} gradientWidth={100} gradientColor={[255, 194, 14]} gradient style={{ overflow: 'hidden' }}>
                <Typography variant="h5" sx={{ m: 'auto' }} color="black">
                    Chào mừng bạn đến với Customer 360 !
                </Typography>
                <Typography variant="h5" sx={{ m: 'auto' }} color="black">
                    Chúc bạn có 1 ngày làm việc vui vẻ !
                </Typography>
            </Marquee>
        </Box>
    );
};

export default MarqueeSection;
