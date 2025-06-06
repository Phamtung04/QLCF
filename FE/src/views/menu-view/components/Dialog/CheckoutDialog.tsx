import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    Box,
    Typography,
    ButtonBase,
    Divider,
    Slide,
    DialogActions,
    Snackbar,
    Alert,
    TextField, // Import TextField from @mui/material
    Paper,
    InputBase,
    CircularProgress,
    IconButton,
    Grid
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';
import { Add, AddCircleOutline, ArrowBack, Close, Delete, DeleteOutline, Edit, Remove, RemoveCircleOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import orderService from 'services/order-serrvice/order.service';
import EditDrink from './EditDrink'; // Import EditDrink component
import IcDrink from 'assets/images/noti.jpg';
import mailService from 'services/home-service/mail.service';
import Logo from 'assets/images/no_order.jpg';
import SuccessDialog from './SuccessDialog';
import { formatCurrency } from 'utils/currencyFormatter';

interface Order {
    // rid: string;
    clientId: string;
    // socketId: string;
    branchId: number;
    tableId: number;
    status: string;
    // orderTime: string;
    note: string;
    paymentMethod: string;
    items: ItemOrder[];
}

interface ItemOrder {
    // rid: string;
    id: number;
    quantity: number;
    price: number;
    note: string;
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
    branchId: number;
    price: number;
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
interface CheckoutDialogProps {
    open: boolean;
    handleClose: () => void;
    cartCount: number;
    handleRemoveCart: () => void;
    setQuantities: any;
    setCartItemCount: any;
    quantities: any;
    listTable: any;
    selectedBranch: any;
    selectedTable: any;
    listBranch: any;
    selectedTableName: any;
    orderItems: Item[];
    setOrderItems: any;
}
const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
    open,
    handleClose,
    cartCount,
    setCartItemCount,
    setQuantities,
    handleRemoveCart,
    quantities,
    listTable,
    selectedTable,
    selectedBranch,
    listBranch,
    selectedTableName,
    setOrderItems,
    orderItems
}) => {
    const theme = useTheme();
    const [itemOrders, setItemOrders] = useState<ItemOrder[]>([]);
    const [selectedSocket, setSelectedSocket] = useState<string | null>(() => {
        const socketId = localStorage.getItem('socket_id');
        return socketId;
    });

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

    const [selectedClientId, setSelectedClientId] = useState<string | null>(() => {
        return getClientIdFromLocalStorage();
    });

    const [order, setOrder] = useState<Order>({
        // rid: '',
        clientId: selectedClientId ?? '',
        branchId: selectedBranch,
        tableId: selectedTable,
        status: 'Chờ xác nhận',
        // orderTime: new Date().toISOString(),
        items: itemOrders,
        paymentMethod: 'Chưa cập nhật',
        note: ''
    });

    const [selectedDrink, setSelectedDrink] = useState<Item | null>(null);
    const [addDrinkOpen, setAddDrinkOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseNoti = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenNoti(false);
    };

    const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const handleCloseWarning = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWarning(false);
    };

    useEffect(() => {
        const items = orderItems.map((item) => ({
            // rid: item.rid,
            id: item.id,
            quantity: item.quantity,
            // dateCreate: new Date().toISOString(),
            price: item.price,
            note: item.note ?? ''
        }));
        setItemOrders(items);
    }, [orderItems]);

    useEffect(() => {
        const clientId = getClientIdFromLocalStorage();
        const socketId = localStorage.getItem('socket_id');
        setOrder((prevOrder) => ({
            ...prevOrder,
            clientId: clientId ?? '',
            socketId: socketId ?? '',
            tableId: selectedTable,
            branchId: selectedBranch,
            items: itemOrders
        }));
    }, [itemOrders, selectedTable, selectedBranch]);

    const removeItemsWithNegativeQuantity = () => {
        const cachedOrder = localStorage.getItem('order');
        if (cachedOrder) {
            const parsedOrder = JSON.parse(cachedOrder);
            const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;

            const updatedOrderItems = parsedOrder.filter((item: any) => item.quantity > 0 && item.branchId === branch_id);
            setOrderItems(updatedOrderItems);
        }
    };

    useEffect(() => {
        removeItemsWithNegativeQuantity();
    }, [open, quantities]);

    useEffect(() => {
        if (!open) return;

        const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;
        const updatedOrderItems = orderItems.filter((item) => item.branchId === branch_id);

        setOrderItems(updatedOrderItems);
        // localStorage.setItem('order', JSON.stringify(updatedOrderItems));
    }, [open, selectedBranch]);

    const handleOrderMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            note: event.target.value
        }));
    };

    const generateOrderItemsHTML = (items: Item[]): string => {
        return items
            .map(
                (item) => `
                    <tr>
                  <td>
                    ${item.name}
                    <p class="product-description">
                      Ghi chú: ${item.note ? item.note : 'Không có'}
                    </p>
                  </td>
                  <td>${item.quantity}</td>
                </tr>
                `
            )
            .join('');
    };
    function generateRebno() {
        const prefix = 'ORDER-';
        const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
        return prefix + randomDigits;
    }
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const branch_item = listBranch.filter((item) => item.id === (selectedBranch ? parseInt(selectedBranch, 10) : 0));
            if (order.tableId === 0 || !order.tableId || !order.branchId || order.branchId === 0) {
                setOpenWarning(true);
                return;
            }
            if (order.items.length === 0) {
                setOpenWarning(true);
                return;
            }
            const isValidTable = listTable.some((item) => {
                return item.id === order.tableId && item.branchId === order.branchId;
            });

            // Nếu không tìm thấy phòng hợp lệ
            if (!isValidTable) {
                setOpenWarning(true);
                return;
            }
            await orderService.postOrder(order);
            setOpenNoti(true);
            setOrderItems([]);
            setOrder((prevOrder) => ({
                ...prevOrder,
                note: ''
            }));
            setCartItemCount(0);
            handleRemoveCart();
            // Send email using EmailService
            handleCloseAndSetNoti();
        } catch (error) {
            console.error('Error submitting order:', error);
            setOpenError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddDrink = (item: Item) => {
        setSelectedDrink(item);
        setAddDrinkOpen(true);
    };

    const handleCloseAddDrink = () => {
        setAddDrinkOpen(false);
        setSelectedDrink(null);
    };

    const handleUpdateNote = (rid: string, note: string) => {
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];
        const updatedOrderItems = currentOrder.map((item) => (item.rid === rid ? { ...item, note } : item));
        localStorage.setItem('order', JSON.stringify(updatedOrderItems));
        const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;
        const updatedOrderFilter = updatedOrderItems.filter((item) => item.branchId === branch_id);
        // localStorage.setItem('order', JSON.stringify(updatedOrderItems));
        setOrderItems(updatedOrderFilter);
    };
    const handleAdd = (rid: string) => {
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];

        const updatedOrder = currentOrder.map((item: any) => (item.rid === rid ? { ...item, quantity: item.quantity + 1 } : item));
        localStorage.setItem('order', JSON.stringify(updatedOrder));

        const updatedQuantities = { ...quantities, [rid]: (quantities[rid] || 0) + 1 };
        setQuantities(updatedQuantities);
        setCartItemCount((prevCount) => prevCount + 1);
    };

    const handleRemove = (rid: string) => {
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];

        let updatedOrder;
        const existingOrderItem = currentOrder.find((item: any) => item.rid === rid);
        if (existingOrderItem && existingOrderItem.quantity > 1) {
            updatedOrder = currentOrder.map((item: any) => (item.rid === rid ? { ...item, quantity: item.quantity - 1 } : item));
        } else {
            updatedOrder = currentOrder.filter((item: any) => item.rid !== rid);
        }
        localStorage.setItem('order', JSON.stringify(updatedOrder));

        const updatedQuantities = { ...quantities, [rid]: Math.max((quantities[rid] || 0) - 1, 0) };
        setQuantities(updatedQuantities);
        setCartItemCount((prevCount) => prevCount - 1);
    };
    const handleCloseAndSetNoti = () => {
        handleClose();
        setOpenWarning(false);
        setOpenError(false);
    };
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
        <>
            <Dialog
                sx={{ top: '0%', height: 'calc(100%)', width: 'calc(91%)', borderRadius: '20px 20px 0 0' }}
                fullScreen
                open={open}
                onClose={handleCloseAndSetNoti}
                TransitionComponent={Transition}
            >
                {orderItems.length === 0 ? (
                    <>
                        <DialogTitle
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <IconButton
                                onClick={handleCloseAndSetNoti}
                                sx={{
                                    color: '#FFFFFF',
                                    backgroundColor: '#FFD643',
                                    borderRadius: '50%',
                                    padding: 1, // điều chỉnh kích thước nút nếu cần
                                    marginRight: 'auto'
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Box
                                sx={{
                                    p: 5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}
                            >
                                <img src={Logo} alt={'Success'} style={{ width: '200px', height: '200px' }} />
                                <Typography sx={{ fontWeight: '700', fontSize: '18px', color: '#292929', textAlign: 'center' }}>
                                    Chưa có đồ uống!!!
                                </Typography>
                                <Typography sx={{ mt: 1, fontWeight: '400', fontSize: '15px', color: '#292929', textAlign: 'center' }}>
                                    Giỏ hàng của bạn trống. Vui lòng thêm đồ uống từ menu.
                                </Typography>
                                <ButtonBase
                                    onClick={handleClose}
                                    sx={{
                                        mt: 5,
                                        borderRadius: '50px',
                                        backgroundColor: '#FFD643',
                                        color: '#464646',
                                        height: '56px',
                                        p: '8px 16px',
                                        '&:hover': {
                                            backgroundColor: '#FFD654'
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>Quay về menu</Typography>
                                </ButtonBase>
                            </Box>
                        </DialogContent>
                    </>
                ) : (
                    <>
                        <DialogTitle
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <IconButton
                                onClick={handleCloseAndSetNoti}
                                sx={{
                                    color: '#FFFFFF',
                                    backgroundColor: '#FFD643',
                                    borderRadius: '50%',
                                    padding: 1, // điều chỉnh kích thước nút nếu cần
                                    marginRight: 'auto'
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography
                                variant="h6"
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    color: '#292929',
                                    fontWeight: '500',
                                    fontSize: '19px',
                                    marginLeft: '-32px' // Adjust according to IconButton size to center text
                                }}
                            >
                                Giỏ hàng ({cartCount})
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box mx={15}>
                                <Grid mb={2} container justifyContent="space-between">
                                    <Grid ml={3} item>
                                        <Typography sx={{ fontSize: '20px', fontWeight: '500', color: '#464646' }}>Tên món</Typography>
                                    </Grid>
                                    <Grid mr={5} item>
                                        <Typography sx={{ fontSize: '20px', fontWeight: '500', color: '#464646' }}>Số lượng</Typography>
                                    </Grid>
                                </Grid>
                                {orderItems.map((item, index) => (
                                    <React.Fragment key={item.rid}>
                                        <Divider sx={{ backgroundColor: '#464646', height: '1px' }} />
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                overflow: 'hidden',
                                                borderRadius: '16px',
                                                backgroundColor: 'white',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                p: 2,
                                                width: '100%',
                                                flexWrap: 'wrap',
                                                mb: 1.5
                                            }}
                                        >
                                            <Box sx={{ flex: '0 0 auto', width: 'auto', mr: 2 }}>
                                                <img
                                                    src={item.image ? `${item.image}` : IcDrink}
                                                    alt={item.name}
                                                    style={{
                                                        width: '77px',
                                                        height: '77px',
                                                        borderRadius: '50%'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                                                <Typography sx={{ fontSize: '20px', fontWeight: '500', mb: 1 }}>{item.name}</Typography>
                                                <Box
                                                    onClick={() => handleOpenAddDrink(item)}
                                                    sx={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontSize: 12, fontWeight: '500', fontStyle: 'italic' }}
                                                    >
                                                        Ghi chú:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1, mr: 1 }}>
                                                        {item.note ? item.note : 'Không có'}
                                                    </Typography>
                                                    <ButtonBase
                                                        onClick={() => handleOpenAddDrink(item)}
                                                        sx={{
                                                            borderRadius: 15,
                                                            color: theme.palette.primary.main
                                                        }}
                                                    >
                                                        <Edit />
                                                    </ButtonBase>
                                                </Box>

                                                {/* Hiển thị giá tiền và tổng giá trị */}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                                        Giá: {formatCurrency(item.price)} x {item.quantity}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50px',
                                                    width: '155px',
                                                    height: 'auto',
                                                    p: 0.5,
                                                    mt: 1
                                                }}
                                            >
                                                <ButtonBase
                                                    onClick={() =>
                                                        quantities[item.rid] > 0
                                                            ? handleRemove(item.rid)
                                                            : console.log('Chưa có trong giỏ hàng')
                                                    }
                                                    sx={{
                                                        borderRadius: '50px',
                                                        color: '#FFC20E',
                                                        minWidth: '40px',
                                                        height: '40px'
                                                    }}
                                                >
                                                    <RemoveCircleOutline sx={{ fontSize: '35px' }} />
                                                </ButtonBase>
                                                <Typography
                                                    sx={{
                                                        width: '49px',
                                                        textAlign: 'center',
                                                        color: '#292929',
                                                        fontSize: '20px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Typography>
                                                <ButtonBase
                                                    onClick={() => handleAdd(item.rid)}
                                                    sx={{
                                                        borderRadius: '50px',
                                                        color: '#FFC20E',
                                                        minWidth: '40px',
                                                        height: '40px'
                                                    }}
                                                >
                                                    <AddCircleOutline sx={{ fontSize: '35px' }} />
                                                </ButtonBase>
                                            </Box>
                                        </Box>
                                    </React.Fragment>
                                ))}

                                <Divider sx={{ backgroundColor: '#464646', height: '1px' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mr: 1 }}>
                                    <Typography sx={{ fontSize: '19px', fontWeight: '400', color: '#333333' }}>Tổng tiền:</Typography>
                                    <Typography sx={{ fontSize: '19px', fontWeight: '500', color: '#292929' }}>
                                        {formatCurrency(totalPrice)}
                                    </Typography>
                                </Box>
                                <Typography sx={{ mt: 3, ml: 1, fontSize: '13px', fontWeight: '400', color: '#333333' }}>
                                    Ghi chú đơn hàng (không bắt buộc)
                                </Typography>
                                <Paper
                                    component="form"
                                    sx={{
                                        p: '8px 8px',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#F9FAFC',
                                        borderRadius: '40px',
                                        my: 1
                                    }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        value={order.note}
                                        onChange={handleOrderMessageChange}
                                        placeholder="Ghi chú đơn hàng"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                    />
                                </Paper>
                                {openWarning ? (
                                    <Typography
                                        sx={{ fontSize: '14px', fontWeight: '500', fontStyle: 'italic', color: 'red', textAlign: 'center' }}
                                    >
                                        Vui lòng quét lại mã QR hoặc chọn bàn
                                    </Typography>
                                ) : openError ? (
                                    <Typography
                                        sx={{ fontSize: '14px', fontWeight: '500', fontStyle: 'italic', color: 'red', textAlign: 'center' }}
                                    >
                                        Gửi đơn hàng thất bại
                                    </Typography>
                                ) : null}
                                {orderItems.length !== 0 ? (
                                    <Box
                                        display="flex"
                                        justifyContent="center" // Căn giữa theo chiều ngang
                                        alignItems="center"
                                    >
                                        <ButtonBase
                                            onClick={handleSubmit}
                                            sx={{
                                                mt: 2,
                                                borderRadius: '50px',
                                                backgroundColor: '#FFD643',
                                                color: '#464646',
                                                width: '330px',
                                                height: '56px',
                                                p: '8px 16px',
                                                '&:hover': {
                                                    backgroundColor: '#FFD654'
                                                }
                                            }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>Gửi đơn hàng</Typography>
                                            )}
                                        </ButtonBase>
                                    </Box>
                                ) : null}
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
            {selectedDrink && (
                <EditDrink
                    open={addDrinkOpen}
                    handleClose={handleCloseAddDrink}
                    selectedDrink={selectedDrink}
                    quantities={quantities}
                    handleUpdateNote={handleUpdateNote}
                    setCartItemCount={setCartItemCount}
                    setQuantities={setQuantities}
                />
            )}
            <SuccessDialog open={openNoti} handleClose={handleCloseNoti} />
        </>
    );
};

export default CheckoutDialog;
