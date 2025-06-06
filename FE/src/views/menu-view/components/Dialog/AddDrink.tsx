import React, { useState } from 'react';
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
}

interface AddDrinkProps {
    open: boolean;
    handleClose: () => void;
    selectedDrink: DrinkItem | null;
    handleAdd: (rid: string) => void;
    handleRemove: (rid: string) => void;
    quantities: { [key: string]: number };
    handleUpdateNote: (rid: string, note: string) => void;
    handleCheckout: () => void;
}

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddDrink: React.FC<AddDrinkProps> = ({
    open,
    handleClose,
    selectedDrink,
    handleAdd,
    handleRemove,
    quantities,
    handleUpdateNote,
    handleCheckout
}) => {
    const [note, setNote] = useState('');
    const theme = useTheme();
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
                                    {quantities[selectedDrink.rid] > 0 && (
                                        <ButtonBase
                                            onClick={() => handleRemove(selectedDrink.rid)}
                                            sx={{ borderRadius: 15, color: theme.palette.primary.main }}
                                        >
                                            <Remove />
                                        </ButtonBase>
                                    )}
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
                <Button
                    variant="contained"
                    onClick={() => {
                        setNote('');
                        handleCheckout();
                    }}
                >
                    Thêm vào giỏ hàng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDrink;
