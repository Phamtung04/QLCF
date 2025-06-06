// material-ui
import {
    Avatar,
    Box,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import img_empty_data from 'assets/images/img_empty_data.svg';
import 'moment/locale/vi';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ data = [], onClickItem }) => {
    const theme = useTheme();

    const newData = useMemo(
        () =>
            data.reduce((acc, cur) => {
                return acc.concat(_.get(cur, 'items', []));
            }, []),
        [data]
    );

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    return (
        <>
            {newData.length === 0 || !data ? (
                <Box mt={2} textAlign="center">
                    <img src={img_empty_data} alt="No Data !" />
                    <Typography variant="subtitle1" fontStyle="italic" sx={{ mt: 1, mb: 3 }}>
                        Bạn không có thông báo nào !
                    </Typography>
                </Box>
            ) : (
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 480,
                        py: 0,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                            maxWidth: 300
                        },
                        '& .MuiListItemSecondaryAction-root': {
                            top: 22
                        },
                        '& .MuiDivider-root': {
                            my: 0
                        },
                        '& .list-container': {
                            pl: 7
                        }
                    }}
                >
                    {_.map(newData, (item: any, index) => (
                        <>
                            <ListItemWrapper
                                key={item.id}
                                sx={{ backgroundColor: !_.get(item, 'isRead') ? 'rgba(0, 131, 69, 0.05)' : 'inherit' }}
                                onClick={(e) => onClickItem(item)}
                            >
                                <ListItem alignItems="center">
                                    <ListItemText
                                        primary={
                                            <>
                                                <Typography variant="caption">
                                                    {moment(_.get(item, 'creationTime')).format('L - LT')}
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ float: 'right' }}>
                                                    {moment(_.get(item, 'creationTime')).locale('vi').fromNow()}
                                                </Typography>
                                                <Typography>{_.get(item, 'tieuDeDetail', '')}</Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Grid container direction="column" className="list-container" mb={0}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" mb={0}>
                                            {_.get(item, 'noiDungDetail', '')}
                                        </Typography>
                                    </Grid>
                                    {/* <Typography variant="caption" display="block" gutterBottom>
                                        {moment(_.get(item, 'creationTime')).format('L - LT')}
                                    </Typography> */}
                                </Grid>
                            </ListItemWrapper>

                            <Divider />
                        </>
                    ))}
                </List>
            )}
        </>
    );
};

export default NotificationList;
