import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    TextField,
    IconButton,
    useTheme,
    Dialog,
    DialogTitle,
    RadioGroup,
    FormControlLabel,
    DialogContent,
    Radio,
    DialogActions,
    Button
} from '@mui/material';
import {
    Feed,
    Check,
    Dvr,
    ArrowBackIos,
    ArrowForwardIos,
    SentimentDissatisfied,
    FreeBreakfastOutlined,
    NotInterested
} from '@mui/icons-material';
import orderService from 'services/order-serrvice/order.service';
import toastService from 'services/core/toast.service';
import { LoadingButton } from '@mui/lab';
import IcDrink from 'assets/images/noti.jpg';
import SwipeableViews from 'react-swipeable-views';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import RejectionDialog from './Dialog/RejectionDialog';
import Logo from 'assets/images/logo_mail.jpg';
import mailService from 'services/home-service/mail.service';
import { formatCurrency } from 'utils/currencyFormatter';

interface Props {
    orderData: any;
    setOrderData: any;
    listOrders: any;
    listOrderItems: any;
    tableName: any;
    table_Id: any;
    branch_id: any;
    getOrder: any;
}

interface Order {
    rid: string;
    tableId: number;
    branchId: number;
    orderStatus: string;
    orderTime: string;
    items: ItemOrder[];
}

interface EmailDetails {
    rebno?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    message?: string;
}

interface ItemOrder {
    rid: string;
    itemId: number;
    quantity: number;
    dateCreate: string;
    note: string;
    price: number;
}

interface Item {
    rid: string;
    id: number;
    quantity: number;
    dateCreate: string;
    note: string;
    name: string;
    categoryId: number;
    categoryName: string;
    description: string;
    isDisabled: boolean;
    image: string;
}

const HDOrderListByTable: React.FC<Props> = ({
    orderData,
    setOrderData,
    listOrders,
    listOrderItems,
    tableName,
    table_Id,
    getOrder,
    branch_id
}) => {
    const { userInfo } = useAuth();
    const [noteMap, setNoteMap] = useState<{ [key: number]: string }>({});
    const [isEditingNote, setIsEditingNote] = useState<{ [key: number]: boolean }>({});
    const theme = useTheme();
    const [itemOrders, setItemOrders] = useState<ItemOrder[]>([]);
    const [orderItems, setOrderItems] = useState<Item[]>(orderData);
    const [activeTab, setActiveTab] = useState(0);
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tiền mặt');
    const [customPaymentMethod, setCustomPaymentMethod] = useState('');

    const [currentOrderRid, setCurrentOrderRid] = useState<any>();
    const [order, setOrder] = useState<Order>({
        rid: '',
        branchId: branch_id,
        tableId: table_Id,
        orderStatus: 'Chờ xác nhận',
        orderTime: new Date().toISOString(),
        items: itemOrders
    });

    const handleChangeIndex = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        if (listOrders.length === 0) {
            setActiveTab(0); // Reset to 0 if listOrders is empty
        } else if (activeTab >= listOrders.length) {
            setActiveTab(listOrders.length - 1); // Set to the last index if activeTab is out of bounds
        }
    }, [listOrders, activeTab]);

    useEffect(() => {
        const items = orderData.map((item) => ({
            rid: item.rid,
            itemId: item.id,
            quantity: item.quantity,
            dateCreate: new Date().toISOString(),
            note: item.note ?? ''
        }));
        setItemOrders(items);
        setOrderItems(orderData);
    }, [orderData]);

    useEffect(() => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            items: itemOrders
        }));
    }, [itemOrders]);

    const handleSubmit = async () => {
        try {
            if (order.items.length === 0 || !order.items) {
                toastService.toast('info', 'Thông báo', 'Vui lòng thêm đồ uống!');
                return;
            }
            const orderWithClientId = {
                rid: order.rid,
                clientId: '', // Replace with actual client ID
                tableId: order.tableId,
                branchId: order.branchId,
                orderStatus: order.orderStatus,
                orderTime: order.orderTime,
                items: order.items
            };
            await orderService.postOrder(orderWithClientId);
            toastService.toast('success', 'Thành công', 'Đặt món thành công');
            await getOrder();
            setOrderData([]);
        } catch (error) {
            console.error(error);
            toastService.toast('error', 'Thất bại', 'Đặt món thất bại');
        }
    };

    const handleConfirm = async (orderRid: string, statusUpd: string) => {
        try {
            await orderService.updateOrder({ rid: orderRid, status: statusUpd, message: '' });
            toastService.toast('success', 'Thành công', 'Cập nhật thành công!');
            await getOrder();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật!');
        }
    };

    const handleReject = async (orderRid: any, orderReason) => {
        try {
            await orderService.updateOrder({ rid: orderRid.rid, status: 'Từ chối', message: orderReason });
            toastService.toast('success', 'Thành công', 'Đã từ chối đơn hàng!');
            await getOrder();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi từ chối!');
        }
    };
    const handleOpenPaymentDialog = (orderRid: string) => {
        setCurrentOrderRid(orderRid);
        setPaymentDialogOpen(true);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialogOpen(false);
        setSelectedPaymentMethod('Tiền mặt'); // Reset lại lựa chọn
        setCustomPaymentMethod('');
    };
    const handleConfirmPayment = async () => {
        try {
            const paymentMethodUpdate = selectedPaymentMethod === 'Khác' ? customPaymentMethod : selectedPaymentMethod;
            await orderService.updateOrder({ rid: currentOrderRid, status: 'Đã hoàn thành', message: '' });
            await orderService.updatePaymentMethod({
                rid: currentOrderRid,
                paymentMethod: paymentMethodUpdate // Thêm paymentMethod vào payload của API
            });
            toastService.toast('success', 'Thành công', 'Thanh toán thành công');
            await getOrder();
            handleClosePaymentDialog();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi thanh toán!');
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId: number) => {
        const { value } = event.target;
        setNoteMap((prevNoteMap) => ({
            ...prevNoteMap,
            [itemId]: value
        }));

        setItemOrders((prevItemOrders) => prevItemOrders.map((item) => (item.itemId === itemId ? { ...item, note: value } : item)));
        setOrderData((prevItemOrders) => prevItemOrders.map((item) => (item.id === itemId ? { ...item, note: value } : item)));
    };

    const handleDeleteItem = (itemId: number) => {
        const updatedOrderData = orderData.filter((item) => item.id !== itemId);
        setOrderData(updatedOrderData);
        const updatedItemOrders = itemOrders.filter((item) => item.itemId !== itemId);
        setItemOrders(updatedItemOrders);
    };

    const handleEditNote = (itemId: number) => {
        setIsEditingNote((prevIsEditingNote) => ({
            ...prevIsEditingNote,
            [itemId]: true
        }));
    };

    const handleConfirmNote = (itemId: number) => {
        setIsEditingNote((prevIsEditingNote) => ({
            ...prevIsEditingNote,
            [itemId]: false
        }));
    };

    const getOrderStatusText = () => {
        if (listOrders.some((orderItem) => orderItem.order_status === 'Đã hoàn thành')) {
            return 'Đơn hàng đã hoàn thành';
        }
        if (listOrders.some((orderItem) => orderItem.order_status === 'Xác nhận')) {
            return 'Đơn hàng đã xác nhận';
        }
        if (listOrders.some((orderItem) => orderItem.order_status === 'Từ chối')) {
            return 'Đơn hàng đã từ chối';
        }
        return 'Đơn hàng chưa xác nhận';
    };

    const calculateTotalQuantity = (orderId: number) => {
        return listOrderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity, 0);
    };
    const handleOpenRejectionDialog = (orderItem: any) => {
        setCurrentOrderRid(orderItem);
        setRejectionDialogOpen(true);
    };

    const handleCloseRejectionDialog = () => {
        setRejectionDialogOpen(false);
    };

    const handleConfirmRejection = (reason: string) => {
        handleReject(currentOrderRid, reason);
        handleCloseRejectionDialog();
    };
    const calculateTotalAmount = (orderId: number) => {
        return listOrderItems.filter((item) => item.order_id === orderId).reduce((total, item) => total + item.quantity * item.price, 0);
    };

    return (
        <Box
            mt={2}
            p={2}
            sx={{
                bgcolor: 'white',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '15px'
            }}
        >
            {listOrders.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 4 }}>
                    <SentimentDissatisfied sx={{ fontSize: 60, color: '#757575' }} />
                    <Typography sx={{ fontSize: '19px', fontWeight: 700, mt: 2 }}>Không có đơn hàng</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton disabled={activeTab === 0} onClick={() => setActiveTab((prevIndex) => prevIndex - 1)} sx={{ mr: 1 }}>
                        <ArrowBackIos />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{getOrderStatusText()}</Typography>
                    </Box>
                    <IconButton
                        disabled={activeTab === listOrders.length - 1}
                        onClick={() => setActiveTab((prevIndex) => prevIndex + 1)}
                        sx={{ ml: 1 }}
                    >
                        <ArrowForwardIos />
                    </IconButton>
                </Box>
            )}
            <SwipeableViews index={activeTab} onChangeIndex={handleChangeIndex} enableMouseEvents>
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
                            {tableName} • #{orderItem.order_id}
                        </Typography>
                        <Typography mt={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                            {moment(orderItem.order_time).format('HH:mm • DD/MM/YYYY')}
                        </Typography>
                        <Typography mt={1} mb={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                            Ghi chú đơn hàng: {orderItem.order_note ? orderItem.order_note : 'Không có'}
                        </Typography>
                        <Typography mb={1} sx={{ fontSize: '13px', fontWeight: 500 }}>
                            Trạng thái:{' '}
                            <span
                                style={{
                                    color: orderItem.order_status === 'Từ chối' ? theme.palette.error.main : theme.palette.secondary.main,
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
                                Chi tiết đơn hàng ({listOrderItems.filter((item) => item.order_id === orderItem.order_id).length})
                            </Typography>
                        </Box>
                        <Box mt={1}>
                            {listOrderItems
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
                                                    alt={item.name}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '15px'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                                                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }} variant="subtitle1">
                                                        {item.item_name}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }} variant="subtitle1">
                                                        SL: {item.quantity}
                                                    </Typography>
                                                </Box>
                                                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} mt={0.5}>
                                                    <Typography variant="body2" sx={{ fontSize: '15px', fontWeight: '500' }}>
                                                        Số tiền: {formatCurrency(item.price)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontSize: '15px', fontWeight: '500' }}>
                                                        Tổng: {formatCurrency(item.price * item.quantity)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} mt={0.5}>
                                                    {isEditingNote[item.item_id] ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                placeholder="Ghi chú"
                                                                value={noteMap[item.item_id] || ''}
                                                                onChange={(event) => handleNoteChange(event, item.item_id)}
                                                                sx={{ mt: 1, width: '100%', marginRight: 1 }}
                                                            />
                                                            <IconButton onClick={() => handleConfirmNote(item.item_id)}>
                                                                <Check />
                                                            </IconButton>
                                                        </Box>
                                                    ) : noteMap[item.id] ? (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontSize: 15, fontStyle: 'italic', marginRight: 1 }}
                                                        >
                                                            Ghi chú: {noteMap[item.item_id]}
                                                        </Typography>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontSize: 15, fontStyle: 'italic', marginRight: 1 }}
                                                        >
                                                            Ghi chú: {item.note}
                                                        </Typography>
                                                    )}
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
                                            onClick={() => handleOpenRejectionDialog(orderItem)}
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
                                            onClick={() => handleConfirm(orderItem.RID, 'Đã hoàn thành')}
                                        >
                                            Thanh toán
                                        </LoadingButton>
                                    </Box>
                                ) : null}
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
                                                    bgcolor: '#FFD84C'
                                                }
                                            }}
                                        >
                                            Xác nhận
                                        </LoadingButton>
                                    ) : orderItem.order_status === 'Xác nhận' ? (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <LoadingButton
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                onClick={() => handleOpenRejectionDialog(orderItem)}
                                                sx={{ mb: 1 }}
                                            >
                                                Từ chối
                                            </LoadingButton>
                                            <LoadingButton
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                sx={{ mb: 1 }}
                                                onClick={() => handleOpenPaymentDialog(orderItem.rid)} // Mở modal để chọn phương thức thanh toán
                                            >
                                                Thanh toán
                                            </LoadingButton>
                                        </Box>
                                    ) : null
                                ) : null}
                            </>
                        )}
                    </Box>
                ))}
            </SwipeableViews>
            <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog}>
                <DialogTitle>Chọn hình thức thanh toán</DialogTitle>
                <DialogContent>
                    <RadioGroup value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                        <FormControlLabel value="Tiền mặt" control={<Radio />} label="Tiền mặt" />
                        <FormControlLabel value="Momo" control={<Radio />} label="Momo" />
                        <FormControlLabel value="Chuyển khoản" control={<Radio />} label="Chuyển khoản" />
                        <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                    </RadioGroup>
                    {selectedPaymentMethod === 'Khác' && (
                        <TextField
                            label="Nhập hình thức thanh toán"
                            fullWidth
                            margin="normal"
                            value={customPaymentMethod}
                            onChange={(e) => setCustomPaymentMethod(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePaymentDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmPayment}
                        color="primary"
                        disabled={selectedPaymentMethod === 'Khác' && !customPaymentMethod}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <RejectionDialog open={rejectionDialogOpen} onClose={handleCloseRejectionDialog} onConfirm={handleConfirmRejection} />
        </Box>
    );
};

export default HDOrderListByTable;
