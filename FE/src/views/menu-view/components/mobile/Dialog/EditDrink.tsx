import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Grid,
    Slide,
    ButtonBase,
    useMediaQuery,
    Paper,
    InputBase,
    IconButton
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Add, AddCircleOutline, Cancel, Edit, Remove, RemoveCircleOutline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import IcDrink from 'assets/images/noti.jpg';

interface DrinkItem {
    rid: string;
    name: string;
    categoryId: number;
    quantity: number;
    categoryName: string;
    description: string;
    isDisabled: boolean;
    image: string;
    note: string; // Add note field to DrinkItem
}

interface AddDrinkProps {
    open: boolean;
    handleClose: () => void;
    selectedDrink: DrinkItem | null;
    quantities: { [key: string]: number };
    handleUpdateNote: (rid: string, note: string) => void;
    setQuantities: any;
    setCartItemCount: any;
}

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditDrink: React.FC<AddDrinkProps> = ({
    open,
    handleClose,
    selectedDrink,
    quantities,
    handleUpdateNote,
    setCartItemCount,
    setQuantities
}) => {
    const [note, setNote] = useState('');
    const theme = useTheme();

    useEffect(() => {
        if (selectedDrink) {
            setNote(selectedDrink.note || '');
        }
    }, [selectedDrink]);
    const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));
    if (!selectedDrink) return null;

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
        handleUpdateNote(selectedDrink.rid, e.target.value);
    };

    const handleCloseDialog = () => {
        setNote('');
        handleClose();
    };
    const getHeight = () => {
        return isMdScreen ? 500 : 300;
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
    const handleClearNote = () => {
        setNote('');
        handleUpdateNote(selectedDrink.rid, '');
    };
    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogContent>
                {selectedDrink ? (
                    <Box
                        sx={{
                            width: '100%',
                            height: 'auto',
                            backgroundColor: '#fff',
                            padding: '25px',
                            borderRadius: '50px'
                        }}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: '500', color: '#464646' }}>{selectedDrink.name}</Typography>
                        <Typography sx={{ mt: 1, fontSize: '14px', fontWeight: '400', color: '#464646' }}>
                            {selectedDrink.description}
                        </Typography>
                        <Typography sx={{ mt: 3, ml: 1, fontSize: '13px', fontWeight: '400', color: '#333333' }}>Không bắt buộc</Typography>
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
                                value={note}
                                onChange={handleNoteChange}
                                placeholder="Nhập ghi chú"
                                inputProps={{ 'aria-label': 'search google maps' }}
                            />
                            {note && (
                                <IconButton type="button" sx={{ p: '3px' }} aria-label="clear search" onClick={handleClearNote}>
                                    <Cancel />
                                </IconButton>
                            )}
                            {!note && (
                                <IconButton type="button" sx={{ p: '3px' }} aria-label="clear search">
                                    <Edit />
                                </IconButton>
                            )}
                        </Paper>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center' // Căn giữa theo chiều ngang
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // Căn giữa theo chiều ngang
                                    backgroundColor: '#FFF9E5',
                                    borderRadius: '50px',
                                    width: '155px',
                                    height: 'auto',
                                    p: 0.5,
                                    mt: 1 // Khoảng cách với phần tử phía trên
                                }}
                            >
                                <ButtonBase
                                    onClick={() =>
                                        quantities[selectedDrink.rid] > 0
                                            ? handleRemove(selectedDrink.rid)
                                            : console.log('Chưa có trong giỏ hàng')
                                    }
                                    sx={{
                                        borderRadius: '50px',
                                        color: quantities[selectedDrink.rid] > 0 ? '#FFC20E' : '#B6BEC8',
                                        minWidth: '40px', // Ensures buttons are uniformly sized
                                        height: '40px' // Increase padding to increase button size
                                    }}
                                >
                                    <RemoveCircleOutline sx={{ fontSize: '28px' }} />
                                </ButtonBase>
                                <Typography
                                    sx={{
                                        width: '49px',
                                        color: '#292929',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        textAlign: 'center'
                                    }}
                                >
                                    {quantities[selectedDrink.rid] > 0 ? quantities[selectedDrink.rid] : 0}
                                </Typography>
                                <ButtonBase
                                    onClick={() => handleAdd(selectedDrink.rid)}
                                    sx={{
                                        borderRadius: '50px',
                                        color: '#FFC20E',
                                        minWidth: '40px', // Ensures buttons are uniformly sized
                                        height: '40px' // Increase padding to increase button size
                                    }}
                                >
                                    <AddCircleOutline sx={{ fontSize: '28px' }} />
                                </ButtonBase>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ padding: 2 }}>
                        Chọn 1 món để xem chi tiết
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditDrink;
