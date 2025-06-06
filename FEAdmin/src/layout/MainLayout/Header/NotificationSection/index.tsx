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
    Slide,
    Snackbar,
    Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { LoadingButton } from '@mui/lab';
import { IconBell, IconChecks, IconX } from '@tabler/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import IcDrink from 'assets/images/noti.jpg';
import notiService from 'services/noti-service/noti.service';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { Check, Dvr, FreeBreakfastOutlined, NotInterested } from '@mui/icons-material';
import orderService from 'services/order-serrvice/order.service';
import toastService from 'services/core/toast.service';
import RejectionDialog from 'views/portal-victoria/components/Dialog/RejectionDialog';
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
    const { userInfo } = useAuth();
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [listOrders, setListOrders] = useState<Order[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenOrder, setDialogOpenOrder] = useState(false);
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [currentOrderRid, setCurrentOrderRid] = useState<string>('');
    const serviceToken = localStorage.getItem('serviceToken');

    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleDialogCloseOrder = () => {
        setDialogOpenOrder(false);
    };
    useEffect(() => {
        const socket = new SockJS(`${process.env.REACT_APP_BASE_SOCKET_URL}`);
        const stompClient = Stomp.over(socket);
        const connect = () => {
            stompClient.connect(
                {},
                (frame: any) => {
                    console.log('Connected:', frame);
                    stompClient.subscribe('/topic/orderUpdates', (message: any) => {
                        const orderUpdate = JSON.parse(message.body);
                        const permission = userInfo?.permission;
                        console.log(message);

                        // So sánh trực tiếp listBranchId nếu nó là một chuỗi
                        const isInListBuilding = userInfo?.listBranchId === message.headers.branchId?.toString();

                        console.log(isInListBuilding);
                        const status = orderUpdate.status;
                        let shouldNotify = false;

                        if (permission === 'SUPERADMIN') {
                            shouldNotify = false;
                        } else if (isInListBuilding) {
                            if (permission === 'ADMIN' && status === 'Chờ xác nhận') {
                                shouldNotify = true;
                            } else if (permission === 'RECEPTIONIST' && status === 'Chờ xác nhận') {
                                shouldNotify = true;
                            }
                        }
                        if (permission === 'RECEPTIONIST' && status === 'Chờ xác nhận') {
                            shouldNotify = true;
                        }
                        if (shouldNotify) {
                            fetchData();
                            const notificationMessage = 'Có đơn hàng mới';
                            setDialogOpen(true);
                            showNotification(notificationMessage);
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
    const createNotification = (message: string) => {
        const options: NotificationOptions = {
            body: message,
            icon: 'https://mikazuki.com.vn/skins/default/images/icon-loa.png?auto=compress&cs=tinysrgb&dpr=1&w=500'
        };
        const notification = new Notification('Thông báo', options);
        notification.onclick = () => {
            window.location.href = 'http://localhost:8001/orderadmin';
        };
    };
    const showNotification = (message: string) => {
        // Kiểm tra nếu trình duyệt hỗ trợ Notification API
        if (!('Notification' in window)) {
            console.log('Trình duyệt không hỗ trợ thông báo trên màn hình!');
            return;
        }

        // Kiểm tra trạng thái quyền truy cập Notification
        if (Notification.permission === 'granted') {
            // Tạo thông báo nếu quyền đã được cấp
            createNotification(message);
        } else if (Notification.permission !== 'denied') {
            // Yêu cầu quyền nếu chưa cấp quyền hoặc người dùng chưa chọn
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    createNotification(message);
                } else {
                    console.log('Quyền thông báo bị từ chối!');
                }
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await notiService.getAllNoti({
                page: 0,
                limit: 0,
                statusAdmin: -1,
                clientId: '',
                rid: '',
                userId: userInfo?.id ?? 0
            });
            if (response) {
                setNotifications(response.result);
            }
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
    const handleCloseNoti = () => {
        setDialogOpen(false);
        if (location.pathname === '/orderadmin/rooms' && userInfo?.permission !== 'SUPERADMIN' && userInfo?.permission !== 'ADMIN') {
            window.location.reload();
        }
    };
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    const handleClickDetail = () => {
        try {
            if (location.pathname === '/orderadmin/list-orders') {
                window.location.reload();
            } else {
                navigate(`/orderadmin/list-orders`);
            }
            setDialogOpen(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleClickItem = async (notification: Notification) => {
        try {
            const updatedNotification = { ...notification, statusAdmin: 1 };
            await notiService.editNoti(updatedNotification);
            fetchData();
            fetchOrderDetails(notification.orderId); // Fetch order details when notification is clicked
            setDialogOpenOrder(true);
            // localStorage.setItem('order_id', notification.order_id.toString());
            // if (location.pathname === '/orderadmin/list-orders') {
            //     window.location.reload();
            // } else {
            //     navigate(`/orderadmin/list-orders`);
            // }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchOrderDetails = async (order_id: number) => {
        try {
            const orderDetailsResponse = await orderService.getAllOrder({
                page: 0,
                limit: 0,
                rid: '',
                tableId: 0,
                status: '',
                orderId: order_id,
                branchId: 0,
                userId: 0,
                date: ''
            });
            setListOrders(orderDetailsResponse.result.listOrder.result);
            setOrderItems(orderDetailsResponse.result.listOrderItem || []);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };
    const formatTime = (sentTime: string) => {
        const orderTimeVN = moment(sentTime).format('HH:mm');
        return orderTimeVN;
    };

    const unreadCount = useMemo(() => {
        return notifications.filter((notification) => notification.adminStatus === 0).length;
    }, [notifications]);

    const handleMarkAllAsRead = async () => {
        try {
            const rids = notifications.map((notification) => notification.rid).join(',');
            await notiService.editNoti({ rid: rids, statusAdmin: 1 });
            fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleCloseRejectionDialog = () => {
        setRejectionDialogOpen(false);
    };
    const handleReject = async (orderRid: string, orderReason) => {
        try {
            await orderService.updateOrder({ rid: orderRid, status: 'Từ chối', message: orderReason });
            toastService.toast('success', 'Thành công', 'Đã từ chối đơn hàng!');
            handleDialogCloseOrder();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi từ chối!');
        }
    };
    const handleConfirmRejection = (reason: string) => {
        handleReject(currentOrderRid, reason);
        handleCloseRejectionDialog();
    };
    const handleConfirm = async (ridUpd: string, statusUpd: string) => {
        try {
            console.log(ridUpd);
            await orderService.updateOrder({ rid: ridUpd, status: statusUpd, message: '' });
            toastService.toast('success', 'Thành công', 'Cập nhật thành công!');
            handleDialogCloseOrder();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật!');
        }
    };
    const handleOpenRejectionDialog = (orderRid: string) => {
        setCurrentOrderRid(orderRid);
        setRejectionDialogOpen(true);
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
                notification.adminStatus === 0 ? (
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
                                    <Avatar src={IcDrink} alt={notification.tableName} />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography sx={{ fontWeight: 'bold' }} component="span" variant="body2" color="textPrimary">
                                            {`Có đơn hàng mới từ: ${notification.tableName}`}
                                        </Typography>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography sx={{ fontWeight: 'bold' }} component="span" variant="body2" color="textSecondary">
                                            {formatTime(notification.sentTime)}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </Box>
                ) : (
                    <Box key={notification.rid}>
                        <ListItem button onClick={() => onClickItem(notification)}>
                            <ListItemAvatar>
                                <Avatar src={IcDrink} alt={notification.tableName} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`Có đơn hàng mới từ: ${notification.tableName}`}
                                secondary={
                                    <>
                                        <Typography sx={{ fontWeight: 'bold' }} component="span" variant="body2" color="textSecondary">
                                            {formatTime(notification.sentTime)}
                                        </Typography>
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
    const calculateTotalQuantity = (orderId: number) => {
        return orderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity, 0);
    };
    const calculateTotalAmount = (orderId: number) => {
        return orderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity * item.price, 0);
    };
    return (
        <>
            <Box>
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
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                sx={{ width: 480 }}
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
                            <Paper>
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
            <Snackbar
                open={dialogOpen}
                autoHideDuration={null}
                onClose={() => {
                    handleCloseNoti();
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => {
                        handleCloseNoti();
                    }}
                    severity="success"
                    variant="filled"
                    iconMapping={{
                        success: (
                            <FactCheckOutlinedIcon
                                fontSize="large"
                                sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.contrastText,
                                    width: '50px',
                                    height: '50px',
                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Độ mờ của bóng nổi
                                    borderRadius: '50%', // Bo tròn icon
                                    padding: theme.spacing(1) // Khoảng cách giữa icon và background
                                }}
                            />
                        )
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.main,
                        '& .MuiAlert-icon': {
                            marginRight: theme.spacing(3)
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: '700' }}>Thông báo có đơn hàng mới</Typography>
                            <Typography mt={0.5} sx={{ fontSize: '15px', fontWeight: '400' }}>
                                Bạn có đơn hàng mới từ bàn vui lòng chọn xem chi tiết để kiểm tra
                            </Typography>
                        </Box>
                        <Box mt={4} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                onClick={handleClickDetail}
                                sx={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: 'white',
                                    textAlign: 'center',
                                    width: 'auto',
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.dark
                                    }
                                }}
                                size="small"
                            >
                                Xem chi tiết
                            </Button>
                        </Box>
                    </Box>
                </Alert>
            </Snackbar>
            <Dialog open={dialogOpenOrder} onClose={handleDialogCloseOrder} maxWidth="sm" fullWidth>
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
                                Trạng thái:{' '}
                                <span
                                    style={{
                                        color:
                                            orderItem.order_status === 'Từ chối' ? theme.palette.error.main : theme.palette.secondary.main,
                                        fontWeight: 700
                                    }}
                                >
                                    {orderItem.order_status}
                                </span>
                                {orderItem.order_message && (
                                    <>
                                        {' - Lý do: '}
                                        <span
                                            style={{
                                                color:
                                                    orderItem.order_status === 'Từ chối'
                                                        ? theme.palette.error.main
                                                        : theme.palette.secondary.main,
                                                fontWeight: 700
                                            }}
                                        >
                                            {orderItem.order_message}
                                        </span>
                                    </>
                                )}
                            </Typography>
                            <Divider />
                            <Box mt={0.5} display="flex" flexDirection="row" alignItems="center">
                                <FreeBreakfastOutlined color="primary" sx={{ mr: 1 }} />
                                <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>
                                    Chi tiết đơn hàng ({orderItems.filter((item) => item.order_id === orderItem.order_id).length})
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
                            {orderItem.order_status !== 'Đã hoàn thành' && (
                                <>
                                    {userInfo?.permission === 'BARTENDING' && orderItem.order_status === 'Xác nhận' ? (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <LoadingButton
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                startIcon={<NotInterested />}
                                                onClick={() => handleOpenRejectionDialog(orderItem.rid)}
                                                sx={{ mb: 1 }}
                                            >
                                                Từ chối
                                            </LoadingButton>
                                            <LoadingButton
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                startIcon={<Check />}
                                                sx={{ mb: 1 }}
                                                onClick={() => handleConfirm(orderItem.rid, 'Đã hoàn thành')}
                                            >
                                                Thanh toán
                                            </LoadingButton>
                                        </Box>
                                    ) : null}

                                    {/* {userInfo?.permission === 'RECEPTIONIST' && orderItem.order_status === 'Chờ xác nhận' ? (
                                        <LoadingButton
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            startIcon={<Check />}
                                            onClick={() => handleConfirm(orderItem.RID, 'Xác nhận')}
                                            sx={{ mb: 1 }}
                                        >
                                            Xác nhận
                                        </LoadingButton>
                                    ) : null} */}
                                    {userInfo?.permission === 'ADMIN' ||
                                    userInfo?.permission === 'SUPERADMIN' ||
                                    userInfo?.permission === 'RECEPTIONIST' ? (
                                        orderItem.order_status === 'Chờ xác nhận' ? (
                                            <LoadingButton
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                onClick={() => handleConfirm(orderItem.rid, 'Xác nhận')}
                                                sx={{
                                                    mb: 1,
                                                    bgcolor: '#FFC20E',
                                                    '&:hover': {
                                                        bgcolor: '#FFD84C' // Màu nền khi hover
                                                    }
                                                }} // Thay đổi màu nút thành #FFC20E
                                            >
                                                Xác nhận
                                            </LoadingButton>
                                        ) : orderItem.order_status === 'Xác nhận' ? (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="error"
                                                    fullWidth
                                                    onClick={() => handleOpenRejectionDialog(orderItem.rid)}
                                                    sx={{ mb: 1 }}
                                                >
                                                    Từ chối
                                                </LoadingButton>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                    onClick={() => handleConfirm(orderItem.rid, 'Đã hoàn thành')}
                                                >
                                                    Thanh toán
                                                </LoadingButton>
                                            </Box>
                                        ) : null
                                    ) : null}
                                    {/* {userInfo?.permission !== 'RECEPTIONIST' && (
                                        <LoadingButton
                                            variant="contained"
                                            color={orderItem.order_status === 'Chờ xác nhận' ? 'secondary' : 'primary'}
                                            fullWidth
                                            onClick={() =>
                                                orderItem.order_status === 'Chờ xác nhận'
                                                    ? handleConfirm(orderItem.RID, 'Xác nhận')
                                                    : handleConfirm(orderItem.RID, 'Đã hoàn thành')
                                            }
                                        >
                                            {orderItem.order_status === 'Chờ xác nhận' ? 'Xác nhận đơn hàng' : 'Xác nhận hoàn thành'}
                                        </LoadingButton>
                                    )} */}
                                </>
                            )}
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingButton onClick={handleDialogCloseOrder} color="primary" variant="outlined">
                        Đóng
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <RejectionDialog open={rejectionDialogOpen} onClose={handleCloseRejectionDialog} onConfirm={handleConfirmRejection} />
        </>
    );
};

export default memo(NotificationSection);
