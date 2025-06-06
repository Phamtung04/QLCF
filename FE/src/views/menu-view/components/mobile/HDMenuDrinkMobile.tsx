import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Grid,
    Typography,
    ButtonBase,
    Divider,
    useMediaQuery,
    Snackbar,
    Alert,
    TextField,
    Paper,
    InputBase,
    IconButton,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, Remove, LocalMall, Search, AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import CheckoutDialog from './Dialog/CheckoutDialog';
import AddDrink from './Dialog/AddDrink';
import drinkService from 'services/drink-service/drink.service';
import Logo from 'assets/images/no_order.jpg';
import IcDrink from 'assets/images/noti.jpg';
import Food1 from 'assets/images/Food1.png';
import Food2 from 'assets/images/Food2.png';
import Food3 from 'assets/images/Food3.png';
import CustomSelect from 'components/CustomSelect';
import { formatCurrency } from 'utils/currencyFormatter';

interface DrinkItem {
    rid: string;
    name: string;
    quantity: number;
    categoryId: number;
    categoryName: string;
    description: string;
    isDisabled: boolean;
    image: string;
    price: number;
}

interface Props {
    selectedCategory: number | null;
    keywork: string | null;
    setKeywork: any;
    listTable: any;
    selectedBranch: any;
    selectedTable: any;
    listBranch: any;
    selectedTableName: any;
    setSelectedBranch: any;
    setSelectedTable: any;
    cartItemCount: any;
    setCartItemCount: any;
    setDialogOpen: any;
    dialogOpen: any;
    cartRef: React.RefObject<HTMLDivElement>;
    setSelectedTableName: any;
    handleDialogOpen: any;
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
interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    categoryId: number;
    branchId: number;
    isDisabled: number;
}

const HDMenuDrinkMobile: React.FC<Props> = ({
    selectedCategory,
    keywork,
    listTable,
    selectedBranch,
    selectedTable,
    listBranch,
    selectedTableName,
    setKeywork,
    setSelectedBranch,
    setSelectedTable,
    setCartItemCount,
    cartItemCount,
    setDialogOpen,
    dialogOpen,
    cartRef,
    setSelectedTableName,
    handleDialogOpen
}) => {
    const theme = useTheme();
    const [filteredItems, setFilteredItems] = useState<DrinkItem[]>([]);
    const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
    const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<Item[]>([]);
    const [addDrinkDialogOpen, setAddDrinkDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const randomImages = [Food1, Food2, Food3];
    const [randomImage, setRandomImage] = useState<string>(randomImages[Math.floor(Math.random() * randomImages.length)]);
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
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const fetchData = async () => {
        if (formData.branchId === 0) return; // Skip API call if branchId is 0
        setIsLoading(true);
        try {
            const response = await drinkService.getAllDrink(formData);
            if (response) {
                setDrinkItems(response.result);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formData]);
    useEffect(() => {
        const selectedTableObj = listTable.find((table) => table.id === selectedTable);
        if (!selectedTableObj) {
            return;
        }
        setSelectedTableName(selectedTableObj.name);
    }, [selectedTable, selectedBranch, listTable]);
    const getQuantity = () => {
        const existingOrder = localStorage.getItem('order');
        if (existingOrder) {
            const orderCart = JSON.parse(existingOrder);
            const newQuantities: { [key: string]: number } = {};
            let count = 0;
            const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;

            orderCart.forEach((item: any) => {
                if (item.branchId === branch_id) {
                    newQuantities[item.rid] = item.quantity;
                    count += item.quantity;
                }
            });

            setQuantities(newQuantities);
            setCartItemCount(count);
        }
    };
    // useEffect(() => {
    //     const cachedOrder = localStorage.getItem('order');
    //     if (cachedOrder) {
    //         const parsedOrder = JSON.parse(cachedOrder);
    //         const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;
    //         const updatedOrderItems = parsedOrder.filter((item) => item.branchId === branch_id);
    //         // localStorage.setItem('order', JSON.stringify(updatedOrderItems));
    //         setOrderItems(updatedOrderItems);
    //     }
    // }, [selectedBranch, dialogOpen]);
    useEffect(() => {
        getQuantity();
    }, [dialogOpen, selectedBranch]);
    const handleRemoveCart = () => {
        const existingItem = localStorage.getItem('order');
        if (existingItem) {
            const currentOrder = JSON.parse(existingItem);
            const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;

            // Lọc các mục không có branchId bằng với selectedBranch
            const updatedOrderItems = currentOrder.filter((item) => item.branchId !== branch_id);

            // Cập nhật lại localStorage
            localStorage.setItem('order', JSON.stringify(updatedOrderItems));

            // Cập nhật lại trạng thái
            setCartItemCount(0);
            setQuantities({});
            setNotes({});
            setOrderItems(updatedOrderItems); // Nếu bạn muốn cập nhật lại orderItems hiển thị
        }
    };

    const handleAdd = (rid: string) => {
        const updatedQuantities = { ...quantities, [rid]: (quantities[rid] || 0) + 1 };
        setQuantities(updatedQuantities);
    };

    const handleRemove = (rid: string) => {
        const updatedQuantities = { ...quantities, [rid]: Math.max((quantities[rid] || 0) - 1, 0) };
        setQuantities(updatedQuantities);
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
            setSelectedDrink(filtered[0]);
            setSelectedItemId(filtered[0]?.rid);
            handleChangeDrink();
        };

        filterItems();
    }, [selectedCategory, keywork, drinkItems]);
    const handleNoteChange = (rid: string, note: string) => {
        setNotes((prevNotes) => ({
            ...prevNotes,
            [rid]: note
        }));
    };
    const handleChangeDrink = () => {
        setRandomImage(randomImages[Math.floor(Math.random() * randomImages.length)]);
    };
    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!selectedDrink) {
            return;
        }
        const rid = selectedDrink.rid;
        const existingItem = localStorage.getItem('order');
        const currentOrder = existingItem ? JSON.parse(existingItem) : [];
        const existingOrderItem = currentOrder.find((item: any) => item.rid === rid);

        if (existingOrderItem) {
            const updatedOrder = currentOrder.map((item: any) =>
                item.rid === rid ? { ...item, quantity: quantities[rid] || 0, note: notes[rid] || '' } : item
            );
            localStorage.setItem('order', JSON.stringify(updatedOrder));
        } else {
            const selectedItem = drinkItems.find((item) => item.rid === rid);
            if (selectedItem) {
                const newOrderItem = { ...selectedItem, quantity: quantities[rid] || 0, note: notes[rid] || '' };
                const updatedOrder = [...currentOrder, newOrderItem];
                localStorage.setItem('order', JSON.stringify(updatedOrder));
            }
        }
        setCartItemCount((prevCount) => prevCount + (quantities[rid] || 0));
        setQuantities({ ...quantities, [rid]: 0 }); // Reset quantity to 0 after adding to cart
        setNotes((prevNotes) => ({ ...prevNotes, [rid]: '' })); // Reset note to empty after adding to cart
        getQuantity();
        handleAddDrinkDialogClose();

        const btn = event.currentTarget;
        const cart = cartRef.current;

        if (!btn || !cart) return;

        const btnRect = btn.getBoundingClientRect();
        const cartRect = cart.getBoundingClientRect();

        const flyDiv = document.createElement('div');
        flyDiv.style.position = 'fixed';
        flyDiv.style.top = `${btnRect.top + btnRect.height / 2}px`;
        flyDiv.style.left = `${btnRect.left + btnRect.width / 2}px`;
        flyDiv.style.width = '50px';
        flyDiv.style.height = '50px';
        flyDiv.style.borderRadius = '50%';
        flyDiv.style.backgroundColor = 'transparent';
        flyDiv.style.zIndex = '1000';
        flyDiv.style.display = 'flex';
        flyDiv.style.alignItems = 'center';
        flyDiv.style.justifyContent = 'center';
        flyDiv.style.transition = `all 1s ease-in-out`;

        const checkIcon = document.createElement('div');
        checkIcon.style.width = '30px';
        checkIcon.style.height = '30px';
        checkIcon.style.backgroundColor = '#FFD643';
        checkIcon.style.borderRadius = '50%';
        checkIcon.style.display = 'flex';
        checkIcon.style.alignItems = 'center';
        checkIcon.style.justifyContent = 'center';

        const icon = document.createElement('i');
        icon.className = 'material-icons';
        icon.textContent = 'check';
        icon.style.color = '#ffffff';
        icon.style.fontSize = '20px';

        checkIcon.appendChild(icon);
        flyDiv.appendChild(checkIcon);
        document.body.appendChild(flyDiv);

        requestAnimationFrame(() => {
            flyDiv.style.top = `${cartRect.top + cartRect.height / 2}px`;
            flyDiv.style.left = `${cartRect.left + cartRect.width / 2}px`;
            flyDiv.style.width = '10px';
            flyDiv.style.height = '10px';
            flyDiv.style.opacity = '0';
        });

        setTimeout(() => {
            flyDiv.remove();
        }, 1200);
    };
    const handleAddDrinkDialogOpen = (drink: DrinkItem) => {
        setSelectedDrink(drink);
        setAddDrinkDialogOpen(true);
    };

    const handleAddDrinkDialogClose = () => {
        setAddDrinkDialogOpen(false);
        setSelectedDrink(null);
    };
    return (
        <Box
            sx={{
                borderLeft: '2px solid #F8F9FA',
                mb: 3,
                zIndex: 300,
                px: 2
            }}
        >
            <Box>
                <Grid container spacing={2} justifyContent="center">
                    {filteredItems.length > 0 ? (
                        isLoading ? (
                            <Box sx={{ mt: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <>
                                    {filteredItems
                                        .sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1))
                                        .map((item) => (
                                            <Grid item key={item.rid} xs={6} md={6} pb={2}>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: 'auto',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        mb: 2
                                                    }}
                                                    onClick={
                                                        !item.isDisabled
                                                            ? () => {
                                                                  handleAddDrinkDialogOpen(item);
                                                                  setSelectedItemId(item.rid);
                                                                  handleChangeDrink();
                                                              }
                                                            : undefined
                                                    } // Set selected drink on click
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '40px',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            borderRadius: '50%',
                                                            width: '83px',
                                                            height: '83px',
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 1,
                                                            backgroundColor: '#FFF9E5'
                                                        }}
                                                    >
                                                        <img
                                                            src={item.image ? `${item.image}` : IcDrink}
                                                            alt={item.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                borderRadius: '50%' // Chắc chắn rằng hình ảnh vẫn giữ được hình tròn
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: '50%',
                                                            transform: 'translate(-50%, 50%)',
                                                            zIndex: 1
                                                        }}
                                                    >
                                                        <ButtonBase
                                                            onClick={
                                                                !item.isDisabled
                                                                    ? () => {
                                                                          handleAddDrinkDialogOpen(item);
                                                                      }
                                                                    : undefined
                                                            }
                                                            sx={{
                                                                borderRadius: '50px',
                                                                backgroundColor: item.isDisabled ? '#EAEEF2' : '#FFD643',
                                                                color: '#464646',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                p: '8px 16px',
                                                                '&:hover': {
                                                                    backgroundColor: item.isDisabled ? '#EAEEF2' : '#FFD654'
                                                                }
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: '500',
                                                                    fontSize: '13px',
                                                                    wordWrap: 'break-word',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {item.isDisabled ? 'Hết món' : 'Chọn'}
                                                            </Typography>
                                                        </ButtonBase>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            marginTop: '41px', // Đẩy Box xuống để hình ảnh không bị che
                                                            width: '100%',
                                                            backgroundColor: '#FFF9E5',
                                                            borderRadius: '25px',
                                                            padding: 2,
                                                            textAlign: 'center',
                                                            zIndex: 0
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                color: '#292929',
                                                                marginTop: '41px',
                                                                fontWeight: '500',
                                                                fontSize: '19px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                width: '100%',
                                                                wordWrap: 'break-word',
                                                                marginBottom: 1,
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: '500',
                                                                fontSize: '15px'
                                                            }}
                                                        >
                                                            Giá tiền: {formatCurrency(item.price)}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                marginBottom: '2px'
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: '500',
                                                                    fontSize: '15px'
                                                                }}
                                                            >
                                                                Mô tả
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '400',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    width: '100%',
                                                                    wordWrap: 'break-word',
                                                                    whiteSpace: 'nowrap',
                                                                    mb: 0.5
                                                                }}
                                                            >
                                                                {item.description}
                                                            </Typography>
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

                                                        {/* <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                p: 1,
                                                                zIndex: 2,
                                                                position: 'relative'
                                                            }}
                                                        >
                                                            {!item.isDisabled ? null : (
                                                                <ButtonBase
                                                                    onClick={() =>
                                                                        item.isDisabled ? console.log('Món đã hết') : handleAdd(item.rid)
                                                                    }
                                                                    sx={{
                                                                        ml: 1,
                                                                        p: item.isDisabled ? 1 : 0,
                                                                        color: '#292929',
                                                                        fontWeight: '500',
                                                                        borderRadius: 15,
                                                                        backgroundColor: theme.palette.primary.main
                                                                    }}
                                                                >
                                                                    {item.isDisabled ? 'Hết món' : <Add />}
                                                                </ButtonBase>
                                                            )}
                                                        </Box> */}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                </>
                            </>
                        )
                    ) : (
                        <>
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
                                    Bạn chưa chọn chi nhánh!!!
                                </Typography>
                                <Typography sx={{ mt: 1, fontWeight: '400', fontSize: '15px', color: '#292929', textAlign: 'center' }}>
                                    {!selectedBranch || !selectedTable
                                        ? 'Vui lòng chọn chi nhánh và bàn.'
                                        : 'Vui lòng chọn món để thêm vào giỏ hàng.'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Grid>
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
                setOrderItems={setOrderItems}
                orderItems={orderItems}
            />
            <AddDrink
                open={addDrinkDialogOpen}
                handleClose={handleAddDrinkDialogClose}
                selectedDrink={selectedDrink}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                quantities={quantities}
                handleDialogOpen={handleDialogOpen}
                cartItemCount={cartItemCount}
                notes={notes}
                handleNoteChange={handleNoteChange}
                handleAddToCart={handleAddToCart}
            />
        </Box>
    );
};

export default HDMenuDrinkMobile;
