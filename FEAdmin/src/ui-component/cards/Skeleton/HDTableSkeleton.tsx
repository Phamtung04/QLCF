// material-ui
import { Skeleton } from '@mui/material';

// ==============================|| SKELETON - TOTAL INCOME DARK/LIGHT CARD ||============================== //

const HDTableSkeleton = () => (
    <>
        {[...Array(5)].map((_) => (
            <Skeleton key={v4()} variant="rectangular" sx={{ my: 3, mx: 3 }} />
        ))}
    </>
);

export default HDTableSkeleton;
