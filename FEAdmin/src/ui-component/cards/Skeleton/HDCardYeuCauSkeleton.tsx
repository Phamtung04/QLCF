// material-ui
import { Card, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

// ==============================|| SKELETON - TOTAL INCOME DARK/LIGHT CARD ||============================== //

const HDCardYeuCauSkeleton = () => (
    <Card sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                    <Skeleton variant="rectangular" width={44} height={44} />
                </ListItemAvatar>
                <ListItemText
                    sx={{ py: 0 }}
                    secondary={<Skeleton variant="rectangular" height={20} />}
                    primary={<Skeleton variant="text" />}
                />
            </ListItem>
        </List>
    </Card>
);

export default HDCardYeuCauSkeleton;
