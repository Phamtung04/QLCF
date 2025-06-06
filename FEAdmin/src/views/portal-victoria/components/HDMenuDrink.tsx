import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, ButtonBase, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Remove, LocalMall } from '@mui/icons-material';
import AddDrink from './Dialog/AddDrink';
import drinkService from 'services/drink-service/drink.service';
import IcDrink from 'assets/images/noti.jpg';
import useAuth from 'hooks/useAuth';

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
    order: any;
    setOrder: any;
    branch_id: any;
}

interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    categoryId: number;
    branchId: number; // Đổi từ buildingId thành branchId
    isDisabled: number;
    userID: number;
}

const HDMenuDrink: React.FC<Props> = ({ selectedCategory, keywork, order, setOrder, branch_id }) => {
    const theme = useTheme();
    const { user, userInfo } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addDrinkDialogOpen, setAddDrinkDialogOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<DrinkItem[]>([]);
    const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
    const endOfListRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({
        limit: 0,
        page: 0,
        rid: '',
        name: '',
        categoryId: 0,
        branchId: branch_id, // Đổi từ buildingId thành branchId
        isDisabled: -1,
        userID: userInfo?.id ?? 0
    });
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchData = async (append = false) => {
        try {
            const response = await drinkService.getAllDrink(formData);
            if (response) {
                const newDrinkItems = append ? [...drinkItems, ...response.result] : response.result;
                setDrinkItems(newDrinkItems);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemoveCart = () => {
        setOrder([]);
        setCartItemCount(0);
        setQuantities({});
    };

    const handleAdd = (rid: string) => {
        const existingOrderItem = order.find((item) => item.rid === rid);
        if (existingOrderItem) {
            setOrder(order.map((item) => (item.rid === rid ? { ...item, quantity: item.quantity + 1 } : item)));
            setCartItemCount((prevCount) => prevCount + 1);
        } else {
            const selectedItem = drinkItems.find((item) => item.rid === rid);
            if (selectedItem) {
                setOrder([...order, { ...selectedItem, quantity: 1 }]);
            }
            setCartItemCount((prevCount) => prevCount + 1);
        }

        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [rid]: (prevQuantities[rid] || 0) + 1
        }));
    };

    const handleRemove = (rid: string) => {
        const existingOrderItem = order.find((item) => item.rid === rid);
        if (existingOrderItem && existingOrderItem.quantity > 1) {
            setOrder(order.map((item) => (item.rid === rid ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setOrder(order.filter((item) => item.rid !== rid));
        }
        setCartItemCount((prevCount) => prevCount - 1);
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [rid]: Math.max((prevQuantities[rid] || 0) - 1, 0)
        }));
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

    useEffect(() => {
        const updatedQuantities: { [key: string]: number } = {};
        order.forEach((item: any) => {
            updatedQuantities[item.rid] = item.quantity;
        });
        setQuantities(updatedQuantities);
    }, [order]);

    return (
        <Box>
            <Box mt={2} sx={{ maxHeight: '800px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                <Grid container spacing={1.5}>
                    {filteredItems
                        .sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1))
                        .map((item) => (
                            <Grid key={item.rid} item xs={12} md={4}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '16px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                        p: 2,
                                        m: 0.5
                                    }}
                                >
                                    <Box
                                        sx={{
                                            borderRadius: '15px',
                                            width: '100%',
                                            paddingTop: '100%',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
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
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                width: '100%'
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
                                                whiteSpace: 'nowrap',
                                                width: '100%'
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            mt: 2,
                                            zIndex: 2
                                        }}
                                    >
                                        {!item.isDisabled ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ml: 'auto'
                                                }}
                                            >
                                                <ButtonBase
                                                    onClick={() => handleRemove(item.rid)}
                                                    sx={{
                                                        backgroundColor: theme.palette.primary.light,
                                                        borderRadius: '50%',
                                                        color: theme.palette.primary.main
                                                    }}
                                                >
                                                    <Remove />
                                                </ButtonBase>
                                                <Typography
                                                    sx={{
                                                        mx: 1,
                                                        fontWeight: 500,
                                                        fontSize: '17px',
                                                        width: '25px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {quantities[item.rid] > 0 ? quantities[item.rid] : 0}
                                                </Typography>
                                                <ButtonBase
                                                    onClick={() => handleAdd(item.rid)}
                                                    sx={{
                                                        backgroundColor: theme.palette.primary.main,
                                                        borderRadius: '50%',
                                                        color: theme.palette.primary.light
                                                    }}
                                                >
                                                    <Add />
                                                </ButtonBase>
                                            </Box>
                                        ) : (
                                            <ButtonBase
                                                onClick={() => (item.isDisabled ? console.log('Món đã hết') : handleAdd(item.rid))}
                                                sx={{
                                                    ml: 'auto',
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
                            </Grid>
                        ))}
                </Grid>
            </Box>
            <Box ref={endOfListRef}>
                <Divider />
            </Box>
        </Box>
    );
};

export default HDMenuDrink;
