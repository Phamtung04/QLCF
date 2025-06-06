import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CardItemProps {
    title?: string;
    subtitle?: string;
    link: string;
}

const HDCardItem = (props: CardItemProps) => {
    const { title, subtitle, link, ...others } = props;
    const navi = useNavigate();

    const onNavigate = () => {
        navi(link, { replace: true });
    };

    return (
        <Button
            variant="contained"
            fullWidth
            sx={{
                // padding: '12px',
                justifyContent: 'flex-start',
                textTransform: 'none',
                boxShadow: 'none',
                borderRadius: '8px',
                variant: 'contained',
                color: '#181818',
                backgroundColor: '#FDF4DD',
                ':hover': {
                    bgcolor: '#F8DD99',
                    color: '#181818',
                    boxShadow: 'none'
                }
            }}
            onClick={() => onNavigate()}
            {...others}
        >
            <Stack spacing={0.5} textAlign="left">
                <Typography color={'#181818'} variant="h3" lineHeight={'26px'} fontWeight={600}>
                    {title}
                </Typography>
                <Typography color={'#9D730A'} variant="subtitle1" mt={1} fontWeight={600}>
                    {subtitle}
                </Typography>
            </Stack>
        </Button>
    );
};

export default HDCardItem;
