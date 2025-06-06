// material-ui
import { Skeleton } from '@mui/material';

// ==============================|| SKELETON - TOTAL INCOME DARK/LIGHT CARD ||============================== //

const HDSkeleton = ({ count = 3, variant = 'text' }: { count?: number; variant?: 'text' | 'rectangular' | 'circular' }) => (
    <>
        {[...Array(count)].map((_) => (
            <Skeleton key={v4()} variant={variant} />
        ))}
    </>
);

export default HDSkeleton;
