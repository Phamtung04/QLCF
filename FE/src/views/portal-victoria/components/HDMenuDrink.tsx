import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, ButtonBase, Divider, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Remove, LocalMall } from '@mui/icons-material';
import CheckoutDialog from './Dialog/CheckoutDialog';
import AddDrink from './Dialog/AddDrink';
import drinkService from 'services/drink-service/drink.service';
import IcDrink from 'assets/images/noti.jpg';

interface DrinkItem {
    rid: string;
    name: string;
    quantity: number;
    categoryId: number;
    categoryName: string;
    description: string;
    isDisabled: boolean;
    image: string;
}

interface Props {
    selectedCategory: number | null;
    keywork: string | null;
    listTable: any;
    selectedBranch: any;
    selectedTable: any;
    listBranch: any;
    selectedTableName: any;
}

interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    categoryId: number;
    branchId: number;
    isDisabled: number;
}

const HDMenuDrink: React.FC<Props> = ({
    selectedCategory,
    keywork,
    listTable,
    selectedBranch,
    selectedTable,
    listBranch,
    selectedTableName
}) => {
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addDrinkDialogOpen, setAddDrinkDialogOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<DrinkItem[]>([]);
    const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
    const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
    const [pageNum, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const endOfListRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({
        limit: 0,
        page: 0,
        rid: '',
        name: '',
        categoryId: 0,
        branchId: selectedBranch ?? 0,
        isDisabled: -1
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            branchId: selectedBranch ?? 0
        }));
    }, [selectedBranch]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [cartItemCount, setCartItemCount] = useState(0);
    const handleDialogOpen = () => {
        handleAddDrinkDialogClose();
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleAddDrinkDialogOpen = (drink: DrinkItem) => {
        setSelectedDrink(drink);
        setAddDrinkDialogOpen(true);
    };

    const handleAddDrinkDialogClose = () => {
        setAddDrinkDialogOpen(false);
        setSelectedDrink(null);
    };

    const fetchData = async () => {
        if (formData.branchId === 0) return; // Skip API call if branchId is 0
        try {
            const response = await drinkService.getAllDrink(formData);
            if (response) {
                setDrinkItems(response.result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formData]);
    useEffect(() => {
        // Initialize cartItemCount and quantities from localStorage
        const existingOrder = localStorage.getItem('order');
        if (existingOrder) {
            const orderItems = JSON.parse(existingOrder);
            const newQuantities: { [key: string]: number } = {};
            let count = 0;
            orderItems.forEach((item: any) => {
                newQuantities[item.rid] = item.quantity;
                count += item.quantity;
            });
            setQuantities(newQuantities);
            setCartItemCount(count);
        }
    }, [dialogOpen]);
    const handleRemoveCart = () => {
        localStorage.removeItem('order');
        setCartItemCount(0);
        setQuantities({});
    };

    const handleAdd = (rid: string) => {
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];
        const existingOrderItem = currentOrder.find((item: any) => item.rid === rid);
        if (existingOrderItem) {
            const updatedOrder = currentOrder.map((item: any) => (item.rid === rid ? { ...item, quantity: item.quantity + 1 } : item));
            localStorage.setItem('order', JSON.stringify(updatedOrder));
        } else {
            const selectedItem = drinkItems.find((item) => item.rid === rid);
            if (selectedItem) {
                const newOrderItem = { ...selectedItem, quantity: 1 };
                const updatedOrder = [...currentOrder, newOrderItem];
                localStorage.setItem('order', JSON.stringify(updatedOrder));
                handleAddDrinkDialogOpen(selectedItem); // Mở dialog khi thêm lần đầu tiên
            }
        }

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
    useEffect(() => {
        const filterItems = () => {
            let filtered = drinkItems;

            if (selectedCategory && selectedCategory !== 0) {
                filtered = filtered.filter((item) => item.categoryId === selectedCategory);
            }

            if (keywork) {
                filtered = filtered.filter((item) => item.name.toLowerCase().includes(keywork.toLowerCase()));
            }

            setFilteredItems(filtered);
        };

        filterItems();
    }, [selectedCategory, keywork, drinkItems]);

    const handleUpdateNote = (rid: string, note: string) => {
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];

        const updatedOrder = currentOrder.map((item: any) => (item.rid === rid ? { ...item, note } : item));
        localStorage.setItem('order', JSON.stringify(updatedOrder));
    };
    return (
        <Box>
            <Box mt={3}>
                <Grid container spacing={1.5}>
                    {filteredItems
                        .sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1))
                        .map((item) => (
                            <Grid key={item.rid} item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '16px',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' // Shadow for elevation
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            padding: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '15px',
                                                width: '100px',
                                                height: '100px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            <img
                                                src={item.image ? `${item.image}` : IcDrink}
                                                alt={item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '15px'
                                                }}
                                            />
                                        </Box>

                                        {item.isDisabled && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    zIndex: 1
                                                }}
                                            />
                                        )}

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flex: 1,
                                                marginLeft: 2,
                                                position: 'relative'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                    minWidth: 0 // ensure flex container can shrink properly
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                        whiteSpace: 'normal', // allow text to wrap
                                                        wordWrap: 'break-word'
                                                    }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: '100%',
                                                        fontSize: '13px',
                                                        whiteSpace: 'normal', // allow text to wrap
                                                        wordWrap: 'break-word'
                                                    }}
                                                >
                                                    {item.description.length > 17
                                                        ? `${item.description.slice(0, 17)}...`
                                                        : item.description}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    zIndex: 2,
                                                    position: 'relative'
                                                }}
                                            >
                                                {!item.isDisabled ? (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            backgroundColor: '#E8E8E8',
                                                            borderRadius: 15,
                                                            p: 0.5
                                                        }}
                                                    >
                                                        <ButtonBase
                                                            onClick={() =>
                                                                quantities[item.rid] > 0
                                                                    ? handleRemove(item.rid)
                                                                    : console.log('Chưa có trong giỏ hàng')
                                                            }
                                                            sx={{
                                                                borderRadius: 15,
                                                                color: theme.palette.primary.main
                                                            }}
                                                        >
                                                            <Remove />
                                                        </ButtonBase>
                                                        <Typography sx={{ mx: 1 }}>
                                                            {quantities[item.rid] > 0 ? quantities[item.rid] : 0}
                                                        </Typography>
                                                        <ButtonBase
                                                            onClick={() => handleAdd(item.rid)}
                                                            sx={{
                                                                borderRadius: 15,
                                                                color: theme.palette.primary.main
                                                            }}
                                                        >
                                                            <Add />
                                                        </ButtonBase>
                                                    </Box>
                                                ) : (
                                                    <ButtonBase
                                                        onClick={() => (item.isDisabled ? console.log('Món đã hết') : handleAdd(item.rid))}
                                                        sx={{
                                                            ml: 1,
                                                            p: item.isDisabled ? 1 : 0,
                                                            borderRadius: 15,
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: theme.palette.primary.light
                                                        }}
                                                    >
                                                        {item.isDisabled ? 'Không khả dụng' : <Add />}
                                                    </ButtonBase>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                </Grid>
            </Box>
            <Box sx={{ position: 'fixed', bottom: 25, right: 25, zIndex: 1000 }}>
                <ButtonBase
                    onClick={handleDialogOpen}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <LocalMall sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                    {cartItemCount > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                backgroundColor: theme.palette.primary.main,
                                width: 25,
                                height: 25,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: theme.palette.primary.light,
                                fontSize: 15,
                                fontWeight: '500'
                            }}
                        >
                            {cartItemCount}
                        </Box>
                    )}
                </ButtonBase>
            </Box>
            <CheckoutDialog
                open={dialogOpen}
                handleClose={handleDialogClose}
                cartCount={cartItemCount}
                handleRemoveCart={handleRemoveCart}
                setCartItemCount={setCartItemCount}
                setQuantities={setQuantities}
                quantities={quantities}
                listTable={listTable}
                listBranch={listBranch}
                selectedTable={selectedTable}
                selectedBranch={selectedBranch}
                selectedTableName={selectedTableName}
            />
            <AddDrink
                open={addDrinkDialogOpen}
                handleClose={handleAddDrinkDialogClose}
                selectedDrink={selectedDrink}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                quantities={quantities}
                handleUpdateNote={handleUpdateNote}
                handleCheckout={handleDialogOpen}
            />
            {/* <Box ref={endOfListRef}>
                <Divider />
            </Box> */}
        </Box>
    );
};

export default HDMenuDrink;
