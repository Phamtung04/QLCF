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
    useMediaQuery
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Add, Remove } from '@mui/icons-material';
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
    return (
        <Dialog
            sx={{ top: `calc(100% - ${getHeight()}px)`, height: getHeight(), borderRadius: '20px 20px 0 0' }}
            fullScreen
            open={open}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <DialogTitle>Chi tiết đồ uống</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <img
                            src={selectedDrink.image ? `${selectedDrink.image}` : IcDrink}
                            alt={selectedDrink.name}
                            style={{ width: '100%', height: 'auto', borderRadius: '25px' }}
                        />
                    </Grid>
                    <Grid item xs={8} container direction="column" spacing={2}>
                        <Grid item container alignItems={'center'}>
                            <Grid item>
                                <Typography variant="h5">{selectedDrink.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: `1px solid ${theme.palette.primary.main}`,
                                        backgroundColor: 'white',
                                        borderRadius: 15,
                                        p: 0.5,
                                        ml: 1
                                    }}
                                >
                                    <ButtonBase
                                        onClick={() => quantities[selectedDrink.rid] > 0 && handleRemove(selectedDrink.rid)}
                                        sx={{ borderRadius: 15, color: theme.palette.primary.main }}
                                    >
                                        <Remove />
                                    </ButtonBase>
                                    <Typography sx={{ mx: 1 }}>{quantities[selectedDrink.rid]}</Typography>
                                    <ButtonBase
                                        onClick={() => handleAdd(selectedDrink.rid)}
                                        sx={{ borderRadius: 15, color: theme.palette.primary.main }}
                                    >
                                        <Add />
                                    </ButtonBase>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <TextField label="Ghi chú" variant="standard" fullWidth multiline value={note} onChange={handleNoteChange} />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCloseDialog}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDrink;
