import React, { memo, useEffect, useRef, useState, useMemo } from 'react';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as signalR from '@microsoft/signalr';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { LoadingButton } from '@mui/lab';
import { IconBell, IconChecks } from '@tabler/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import IcDrink from 'assets/images/noti.jpg';
import toastService from 'services/core/toast.service';
import notiService from 'services/noti-service/noti.service';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import orderService from 'services/order-serrvice/order.service';
import { Dvr, FreeBreakfastOutlined, NotificationsOutlined } from '@mui/icons-material';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { formatCurrency } from 'utils/currencyFormatter';

const defaultValues: any = {
    isRead: false
};

interface Notification {
    rid: string;
    notificationId: number;
    orderId: number;
    branchId: number;
    branchName: string;
    tableId: number;
    tableName: string;
    sentTime: string;
    adminStatus: number;
    clientStatus: number;
    orderStatus: string;
}
interface Order {
    rid: string;
    order_message: string;
    order_note: string;
    branch_id: number;
    branch_name: string;
    order_id: number;
    order_status: string;
    order_time: string;
    table_id: number;
    table_name: string;
    totalPrice: number;
    payment_method: string;
}
interface OrderDetails {
    order_id: number;
    customer_name: string;
    items: string[];
    total_price: number;
    order_time: string;
}
interface OrderItem {
    order_item_id: number;
    order_id: number;
    item_id: number;
    quantity: number;
    date_Create: string;
    rid: string;
    note: string | null;
    category_id: number;
    item_description: string;
    image: string;
    item_name: string;
    category_name: string;
    price: number;
}
const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [listOrders, setListOrders] = useState<Order[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const serviceToken = localStorage.getItem('serviceToken');
    const room_id = localStorage.getItem('room_id');
    const building_id = localStorage.getItem('building_id');
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getClientIdFromLocalStorage = () => {
        try {
            const client_id = localStorage.getItem('client_id');
            if (!client_id) return '';

            const parsedItem = JSON.parse(client_id);
            return String(parsedItem.value);
        } catch (error) {
            console.error('Error parsing client_id:', error);
            return '';
        }
    };

    const client_id = getClientIdFromLocalStorage();
    const generateClientId = () => uuidv4();
    const setClientIdWithExpiration = () => {
        const clientId = generateClientId();
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const item = {
            value: clientId,
            expiry: endOfDay.getTime()
        };
        localStorage.setItem('client_id', JSON.stringify(item));
    };

    const getClientId = () => {
        const itemStr = localStorage.getItem('client_id');
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        const now = new Date();
        if (now.getTime() > item.expiry) {
            localStorage.removeItem('client_id');
            return null;
        }
        return item.value;
    };

    const initializeClientId = () => {
        let clientId = getClientId();
        if (!clientId) {
            setClientIdWithExpiration();
            clientId = getClientId();
        }
    };
    useEffect(() => {
        initializeClientId();
        const socket = new SockJS(`${process.env.REACT_APP_BASE_SOCKET_URL}`);
        const stompClient = Stomp.over(socket);
        const connect = () => {
            stompClient.connect(
                {},
                (frame: any) => {
                    console.log('Connected:', frame);
                    stompClient.subscribe('/topic/orderUpdates', (message: any) => {
                        const orderUpdate = JSON.parse(message.body);
                        if (client_id === orderUpdate.clientId) {
                            fetchData();
                        }
                    });
                },
                (error: any) => {
                    console.error('WebSocket connection error:', error);
                }
            );
        };
        connect();
        return () => {
            stompClient.disconnect(() => {
                console.log('Disconnected from WebSocket');
            });
        };
    }, []);
    const fetchData = async () => {
        try {
            const orderResponse = await notiService.getAllNoti({
                rid: '',
                clientId: client_id ?? '',
                tableId: room_id ? parseInt(room_id, 10) : 0,
                branchId: building_id ? parseInt(building_id, 10) : 0,
                limit: 0,
                page: 0,
                statusClient: -1
            });
            setNotifications(orderResponse.result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [open]);

    const anchorRef = useRef<any>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleClickItem = async (notification: Notification) => {
        try {
            const updatedNotification = { ...notification, statusClient: 1 };
            await notiService.editNoti(updatedNotification);
            fetchData();
            fetchOrderDetails(notification.orderId); // Fetch order details when notification is clicked
            setDialogOpen(true); // Open dialog
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchOrderDetails = async (order_Id: number) => {
        try {
            const orderDetailsResponse = await orderService.getAllOrder({
                page: 0,
                limit: 0,
                rid: '',
                tableId: 0,
                status: '',
                orderId: order_Id,
                branchId: 0,
                userId: 0,
                date: moment().format('DD/MM/YYYY')
            });
            setListOrders(orderDetailsResponse.result.listOrder.result);
            setOrderItems(orderDetailsResponse.result.listOrderItem || []);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const formatTime = (sentTime) => {
        const orderTimeVN = moment(sentTime).format('HH:mm');
        return orderTimeVN;
    };

    const unreadCount = useMemo(() => {
        return notifications.filter((notification) => notification.clientStatus === 0).length;
    }, [notifications]);

    const handleMarkAllAsRead = async () => {
        try {
            const rids = notifications.map((notification) => notification.rid).join(',');
            await notiService.editNoti({ rid: rids, statusClient: 1 });
            fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xác nhận':
                return {
                    backgroundColor: '#FFDF80',
                    color: '#464646'
                };
            case 'Xác nhận':
                return {
                    backgroundColor: '#20B2AA',
                    color: '#FFFFFF'
                };
            case 'Đã hoàn thành':
                return {
                    backgroundColor: '#40B340',
                    color: '#FFFFFF'
                };
            case 'Từ chối':
                return {
                    backgroundColor: '#EF5350',
                    color: '#FFFFFF'
                };
            default:
                return {
                    backgroundColor: 'default',
                    color: 'default'
                };
        }
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
        setOrderDetails(null);
    };

    const calculateTotalQuantity = (orderId: number) => {
        return orderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity, 0);
    };
    const calculateTotalAmount = (orderId: number) => {
        return orderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const NotificationList = ({
        notificationList,
        onClickItem
    }: {
        notificationList: Notification[];
        onClickItem: (notification: Notification) => void;
    }) => (
        <List>
            {notificationList.map((notification) =>
                !notification.clientStatus ? (
                    <Box key={notification.rid}>
                        <ListItem button onClick={() => onClickItem(notification)}>
                            <ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    variant="dot"
                                    color={'primary'}
                                    sx={{ mr: 1 }}
                                >
                                    <Avatar src={IcDrink} alt={notification.rid} />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ fontWeight: 'bold' }} component="span" variant="body2" color="textPrimary">
                                            {`Đơn hàng của bạn: #${notification.orderId}`}
                                        </Typography>
                                    </div>
                                }
                                secondary={
                                    <Typography sx={{ fontWeight: 'bold' }} component="span" variant="body2" color="textSecondary">
                                        {`${formatTime(notification.sentTime)} - ${
                                            notification.orderStatus === 'Xác nhận' ? 'Đã xác nhận' : notification.orderStatus
                                        }`}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </Box>
                ) : (
                    <Box key={notification.rid}>
                        <ListItem button onClick={() => onClickItem(notification)}>
                            <ListItemAvatar>
                                <Avatar src={IcDrink} alt={notification.rid} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography>{`Đơn hàng của bạn: ${notification.orderId}`}</Typography>
                                    </div>
                                }
                                secondary={
                                    <>
                                        <Typography>{`${formatTime(notification.sentTime)} - ${notification.orderStatus}`}</Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </Box>
                )
            )}
        </List>
    );

    return (
        <>
            <IconButton
                sx={{
                    my: 1,
                    color: '#464646',
                    backgroundColor: '#ffd643',
                    borderRadius: '50%',
                    p: 1.5,
                    '&:hover': {
                        backgroundColor: '#ffd643' // Bảo đảm rằng màu nền không thay đổi khi hover
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.5rem' // Tăng kích thước icon
                    }
                }}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <NotificationsOutlined />
                {unreadCount > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            backgroundColor: '#D12421',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#FFFFFF',
                            fontSize: 15,
                            fontWeight: '500'
                        }}
                    >
                        {unreadCount}
                    </Box>
                )}
            </IconButton>
            {/* <Box display="flex" justifyContent="center">
                <Badge badgeContent={unreadCount} color="primary" sx={{ zIndex: 10 }} invisible={unreadCount === 0}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                            color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.dark,
                                color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[800]
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </Badge>
            </Box> */}

            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                sx={{ width: '95%', zIndex: 800 }}
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper sx={{ width: '95%' }}>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>
                                                        <Stack direction="row" spacing={2}>
                                                            <Typography variant="subtitle1">Thông Báo</Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item>
                                                        <LoadingButton
                                                            startIcon={<IconChecks />}
                                                            color="secondary"
                                                            onClick={handleMarkAllAsRead}
                                                        >
                                                            Đánh dấu tất cả đã đọc
                                                        </LoadingButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sx={{ maxHeight: '350px', overflowY: 'auto' }}>
                                                <NotificationList notificationList={notifications} onClickItem={handleClickItem} />
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {listOrders.map((orderItem) => (
                        <Box
                            key={orderItem.rid}
                            sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: 'white',
                                borderRadius: '15px',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Dvr color="primary" sx={{ mr: 1 }} />
                                <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>Thông tin đơn hàng</Typography>
                            </Box>
                            <Typography mt={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                                {orderItem.table_name} • #{orderItem.order_id}
                            </Typography>
                            <Typography mt={1} mb={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                                {moment(orderItem.order_time).format('HH:mm • DD/MM/YYYY')}
                            </Typography>
                            <Typography mb={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                                Ghi chú đơn hàng: {orderItem.order_message ? orderItem.order_message : 'Không có'}
                            </Typography>
                            <Typography mb={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    Trạng thái:{' '}
                                    <Chip
                                        label={orderItem.order_status}
                                        style={{
                                            ...getStatusColor(orderItem.order_status),
                                            lineHeight: 2,
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            height: 24,
                                            width: 150,
                                            marginLeft: 8 // Thêm khoảng cách giữa văn bản và Chip
                                        }}
                                    />
                                </Box>
                                {orderItem.order_note && (
                                    <>
                                        {isSmallScreen ? <>Lý do:</> : ' - Lý do: '}
                                        <span
                                            style={{
                                                color:
                                                    orderItem.order_status === 'Từ chối'
                                                        ? theme.palette.error.main
                                                        : theme.palette.secondary.main,
                                                fontWeight: 700
                                            }}
                                        >
                                            {orderItem.order_note}
                                        </span>
                                    </>
                                )}
                            </Typography>
                            <Divider />
                            <Box mt={0.5} display="flex" flexDirection="row" alignItems="center">
                                <FreeBreakfastOutlined color="primary" sx={{ mr: 1 }} />
                                <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>
                                    Chi tiết đơn hàng (
                                    {orderItems
                                        .filter((item) => item.order_id === orderItem.order_id)
                                        .reduce((total, item) => total + item.quantity, 0)}
                                    )
                                </Typography>
                            </Box>

                            <Box mt={1}>
                                {orderItems
                                    .filter((item) => item.order_id === orderItem.order_id)
                                    .map((item) => (
                                        <React.Fragment key={item.rid}>
                                            <Box
                                                sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: 'white',
                                                    borderRadius: 2,
                                                    width: '100%',
                                                    justifyContent: 'flex-start'
                                                }}
                                            >
                                                <Box sx={{ flex: '0 0 auto', width: 'auto', mr: 2 }}>
                                                    <img
                                                        src={item.image ? `${item.image}` : IcDrink}
                                                        alt={item.item_name}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '15px'
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                                                    <Box
                                                        display={'flex'}
                                                        flexDirection={'row'}
                                                        justifyContent={'space-between'}
                                                        alignItems="center"
                                                    >
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                flexShrink: 1,
                                                                minWidth: 0,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {item.item_name}
                                                        </Typography>
                                                        <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', marginLeft: 1 }}>
                                                            x {item.quantity}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontSize: 13, fontStyle: 'italic', marginRight: 1 }}
                                                        >
                                                            Ghi chú: {item.note}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                            </Box>
                            <Divider />
                            <Box mt={2} mb={2} display="flex" justifyContent="space-between">
                                <Typography sx={{ fontSize: '16px', fontWeight: 700 }} variant="body1">
                                    Tổng món: {calculateTotalQuantity(orderItem.order_id)}
                                </Typography>
                                <Typography sx={{ fontSize: '16px', fontWeight: 700 }} variant="body1">
                                    Tổng tiền: {formatCurrency(calculateTotalAmount(orderItem.order_id))}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingButton onClick={handleDialogClose} color="primary" variant="outlined">
                        Đóng
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default memo(NotificationSection);
