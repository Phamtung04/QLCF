import { Box } from '@mui/material';
import img_empty_data from 'assets/images/img_empty_data.svg';
import MainCard from 'ui-component/cards/MainCard';

const HDCardNotFound = ({ label = '', action = null }: { label: any; action?: any }) => {
    return (
        <MainCard sx={{ py: 2 }}>
            <Box textAlign="center">
                <img src={img_empty_data} alt="No Data !" />
                {label}
            </Box>
        </MainCard>
    );
};

export default HDCardNotFound;
