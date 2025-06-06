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
    TextField // Import TextField from @mui/material
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/material/styles';
import { Add, Close, Delete, DeleteOutline, Edit, Remove } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import orderService from 'services/order-serrvice/order.service';
import EditDrink from './EditDrink'; // Import EditDrink component
import IcDrink from 'assets/images/noti.jpg';
import mailService from 'services/home-service/mail.service';
import Logo from 'assets/images/logo_mail.jpg';

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
    selectedTableName
}) => {
    const theme = useTheme();
    const [itemOrders, setItemOrders] = useState<ItemOrder[]>([]);
    const [orderItems, setOrderItems] = useState<Item[]>(() => {
        const cachedOrder = localStorage.getItem('order');
        return cachedOrder ? JSON.parse(cachedOrder) : [];
    });
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
        // socketId: selectedSocket ?? '',
        clientId: selectedClientId ?? '',
        branchId: selectedBranch,
        tableId: selectedTable,
        paymentMethod: 'Chưa cập nhật',
        status: 'Chờ xác nhận',
        // orderTime: new Date().toISOString(),
        items: itemOrders,
        note: ''
    });
    const [selectedDrink, setSelectedDrink] = useState<Item | null>(null);
    const [addDrinkOpen, setAddDrinkOpen] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
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
    }, [itemOrders, open]);

    useEffect(() => {
        const cachedOrder = localStorage.getItem('order');
        if (cachedOrder) {
            setOrderItems(JSON.parse(cachedOrder));
        }
    }, [open, quantities]);
    useEffect(() => {
        const branch_id = selectedBranch;
        const updatedOrderItems = orderItems.filter((item) => item.branchId === (branch_id ? parseInt(branch_id, 10) : 0));
        if (updatedOrderItems.length !== orderItems.length) {
            setOrderItems(updatedOrderItems);
            localStorage.setItem('order', JSON.stringify(updatedOrderItems));
        }
    }, [open]);

    // Handle change for the order message input
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
        const branch_item = listBranch.filter((item) => item.id === (selectedBranch ? parseInt(selectedBranch, 10) : 0));

        try {
            if (order.tableId === 0 || !order.tableId || !order.branchId || order.branchId === 0) {
                setOpenWarning(true);
                return;
            }
            if (order.items.length === 0) {
                setOpenWarning(true);
                return;
            }
            await orderService.postOrder(order);
            setOpenNoti(true);
            localStorage.removeItem('order');
            setOrderItems([]);
            setOrder((prevOrder) => ({
                ...prevOrder,
                note: ''
            }));
            setCartItemCount(0);
            handleRemoveCart();
            handleClose();
        } catch (error) {
            console.error('Error submitting order:', error);
            setOpenError(true);
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
        const updatedOrderItems = orderItems.map((item) => (item.rid === rid ? { ...item, note } : item));
        setOrderItems(updatedOrderItems);
        localStorage.setItem('order', JSON.stringify(updatedOrderItems));
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

        const existingOrderItem = currentOrder.find((item: any) => item.rid === rid);
        if (existingOrderItem && existingOrderItem.quantity > 1) {
            const updatedOrder = currentOrder.map((item: any) => (item.rid === rid ? { ...item, quantity: item.quantity - 1 } : item));
            localStorage.setItem('order', JSON.stringify(updatedOrder));
        } else {
            const updatedOrder = currentOrder.filter((item: any) => item.rid !== rid);
            localStorage.setItem('order', JSON.stringify(updatedOrder));
        }

        const updatedQuantities = { ...quantities, [rid]: Math.max((quantities[rid] || 0) - 1, 0) };
        setQuantities(updatedQuantities);
        setCartItemCount((prevCount) => prevCount - 1);
    };
    return (
        <>
            <Dialog
                sx={{ top: 'calc(100% - 70%)', height: 'calc(100% - 30%)', borderRadius: '20px 20px 0 0' }}
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>Đồ uống đã chọn ({cartCount})</DialogTitle>
                <DialogContent>
                    <Box>
                        {orderItems.map((item, index) => (
                            <React.Fragment key={item.rid}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '16px',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Shadow for elevation
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        p: 2,
                                        width: '100%',
                                        flexWrap: 'wrap', // Allow wrapping when space is not enough
                                        mb: 1.5 // Add margin bottom for spacing between items
                                    }}
                                >
                                    {/* <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                                        <ButtonBase
                                            onClick={() => handleOpenAddDrink(item)}
                                            sx={{
                                                borderRadius: 15,
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            <DeleteOutline />
                                        </ButtonBase>
                                    </Box> */}
                                    <Box sx={{ flex: '0 0 auto', width: 'auto', mr: 2 }}>
                                        <img
                                            src={item.image ? `${item.image}` : IcDrink}
                                            alt={item.name}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                                border: `2px solid ${theme.palette.primary.main}`
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 auto', minWidth: 0, mb: 2 }}>
                                        {' '}
                                        {/* Sử dụng minWidth: 0 để giảm độ rộng tối thiểu của Box */}
                                        <Typography variant="subtitle1">{item.name}</Typography>
                                        <Box onClick={() => handleOpenAddDrink(item)} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontSize: 12, fontWeight: '500', fontStyle: 'italic' }}>
                                                Ghi chú:
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ ml: 1, mr: 1 }}>
                                                {item.note && item.note.length > 3 ? `${item.note.slice(0, 3)}...` : item.note}
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
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#DCDCDC',
                                            borderRadius: 20,
                                            padding: 0.5,
                                            mt: { xs: 2, md: 0 }
                                        }}
                                    >
                                        <ButtonBase
                                            onClick={() =>
                                                item.quantity > 0 ? handleRemove(item.rid) : console.log('Chưa có trong giỏ hàng')
                                            }
                                            sx={{
                                                borderRadius: 15,
                                                color: theme.palette.primary.main,
                                                width: 20, // Fixed width for the button
                                                height: 20, // Fixed height for the button
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Remove />
                                        </ButtonBase>
                                        <Typography sx={{ mx: 1, my: 0.5, minWidth: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                                        <ButtonBase
                                            onClick={() => handleAdd(item.rid)}
                                            sx={{
                                                borderRadius: 15,
                                                color: theme.palette.primary.main,
                                                width: 20, // Fixed width for the button
                                                height: 20, // Fixed height for the button
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Add />
                                        </ButtonBase>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        ))}
                        {/* Add the TextField for the order message */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {orderItems.length !== 0 ? (
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {' '}
                            {/* Container with column layout */}
                            <TextField
                                label="Ghi chú đơn hàng"
                                fullWidth
                                value={order.note}
                                onChange={handleOrderMessageChange}
                                variant="outlined"
                            />
                            <LoadingButton variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                                Gửi đơn hàng
                            </LoadingButton>
                        </Box>
                    ) : null}
                </DialogActions>
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
            <Snackbar
                open={openWarning}
                autoHideDuration={3500}
                onClose={handleCloseWarning}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ width: '90%' }} // Set custom width
            >
                <Alert onClose={handleCloseWarning} severity="warning" variant="filled" sx={{ width: '100%' }}>
                    <div>Phòng họp không thuộc chi nhánh đã chọn.</div>
                    <div>Vui lòng chọn bàn hoặc quét lại QR.</div>
                </Alert>
            </Snackbar>
            <Snackbar
                open={openNoti}
                autoHideDuration={3500}
                onClose={handleCloseNoti}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNoti} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Gửi đơn hàng thành công
                </Alert>
            </Snackbar>
            <Snackbar
                open={openError}
                autoHideDuration={3500}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" variant="filled" sx={{ width: '100%' }}>
                    Gửi đơn hàng thất bại
                </Alert>
            </Snackbar>
        </>
    );
};

export default CheckoutDialog;
