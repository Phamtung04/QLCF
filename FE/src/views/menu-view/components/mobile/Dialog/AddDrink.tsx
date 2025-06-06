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
    useMediaQuery,
    IconButton,
    Paper,
    InputBase
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Add, AddCircleOutline, ArrowBack, LocalMallOutlined, Remove, RemoveCircleOutline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import IcDrink from 'assets/images/noti.jpg';
import IcBG from 'assets/images/bg.png';
import { formatCurrency } from 'utils/currencyFormatter';

interface DrinkItem {
    rid: string;
    name: string;
    categoryId: number;
    quantity: number;
    categoryName: string;
    description: string;
    isDisabled: boolean;
    image: string;
    price: number;
}

interface AddDrinkProps {
    open: boolean;
    handleClose: () => void;
    selectedDrink: DrinkItem | null;
    handleAdd: (rid: string) => void;
    handleRemove: (rid: string) => void;
    quantities: { [key: string]: number };
    handleDialogOpen: any;
    cartItemCount: any;
    notes: any;
    handleNoteChange: any;
    handleAddToCart: any;
}

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddDrink: React.FC<AddDrinkProps> = ({
    open,
    handleClose,
    selectedDrink,
    handleAdd,
    handleRemove,
    quantities,
    handleDialogOpen,
    cartItemCount,
    handleAddToCart,
    handleNoteChange,
    notes
}) => {
    const [note, setNote] = useState('');
    const theme = useTheme();
    const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));
    if (!selectedDrink) return null;

    const handleCloseDialog = () => {
        setNote('');
        handleClose();
    };

    return (
        <Dialog
            sx={{
                top: '0%',
                height: 'calc(100%)',
                width: 'calc(100%)',
                borderRadius: '20px 20px 0 0'
            }}
            fullScreen
            open={open}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
        >
            <Box
                sx={{
                    backgroundImage: `url(${IcBG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%',
                    position: 'relative'
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '20px 20px 0 0'
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: '#FFFFFF',
                            backgroundColor: '#FFD643',
                            borderRadius: '50%',
                            padding: 1 // điều chỉnh kích thước nút nếu cần
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: '#FFFFFF',
                            fontWeight: '500',
                            fontSize: '19px'
                        }}
                    >
                        Thêm đồ uống
                    </Typography>
                    <IconButton
                        sx={{
                            color: '#292929',
                            backgroundColor: '#FFD643',
                            borderRadius: '50%',
                            padding: 1 // điều chỉnh kích thước nút nếu cần
                        }}
                        onClick={handleDialogOpen}
                    >
                        <LocalMallOutlined />
                        {cartItemCount > 0 && (
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
                                    fontSize: 13,
                                    fontWeight: '500'
                                }}
                            >
                                {cartItemCount}
                            </Box>
                        )}
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        p: 0,
                        position: 'relative',
                        height: 'calc(100% - 64px)' // Adjust height to fit remaining space
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            display: 'flex',
                            flexDirection: 'column', // Sắp xếp các phần tử theo chiều dọc
                            borderRadius: '32px 32px 0 0',
                            backgroundColor: '#fff',
                            padding: '44px'
                        }}
                    >
                        {selectedDrink ? (
                            <>
                                <Typography sx={{ fontSize: '24px', fontWeight: '500', color: '#464646' }}>
                                    {selectedDrink.name} - {formatCurrency(selectedDrink.price)}
                                </Typography>
                                <Typography sx={{ mt: 1, fontSize: '14px', fontWeight: '400', color: '#464646' }}>
                                    {selectedDrink.description}
                                </Typography>
                                <Typography sx={{ mt: 3, ml: 1, fontSize: '13px', fontWeight: '400', color: '#333333' }}>
                                    Không bắt buộc
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
                                        value={notes[selectedDrink.rid] || ''}
                                        onChange={(e) => handleNoteChange(selectedDrink.rid, e.target.value)}
                                        placeholder="Nhập ghi chú"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                    />
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
                                {quantities[selectedDrink.rid] > 0 ? (
                                    <ButtonBase
                                        onClick={handleAddToCart}
                                        sx={{
                                            mt: 2,
                                            borderRadius: '50px',
                                            backgroundColor: '#FFD643',
                                            color: '#464646',
                                            width: '100%',
                                            height: '56px',
                                            p: '8px 16px',
                                            '&:hover': {
                                                backgroundColor: '#FFD654'
                                            }
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>Thêm vào giỏ hàng</Typography>
                                    </ButtonBase>
                                ) : (
                                    <ButtonBase
                                        sx={{
                                            mt: 2,
                                            borderRadius: '50px',
                                            backgroundColor: '#EAEEF2',
                                            color: '#464646',
                                            width: '100%',
                                            height: '56px',
                                            p: '8px 16px',
                                            '&:hover': {
                                                backgroundColor: '#EAEEF2'
                                            }
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>Thêm vào giỏ hàng</Typography>
                                    </ButtonBase>
                                )}
                            </>
                        ) : (
                            <Typography variant="h6" sx={{ padding: 2 }}>
                                Chọn 1 món để xem chi tiết
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default AddDrink;
