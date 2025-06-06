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
import { Add, Remove, LocalMall, Search, AddCircleOutline, RemoveCircleOutline, Cancel } from '@mui/icons-material';
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
const HDMenuDrink: React.FC<Props> = ({
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
    setSelectedTableName
}) => {
    const theme = useTheme();
    const [filteredItems, setFilteredItems] = useState<DrinkItem[]>([]);
    const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
    const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<Item[]>([]);
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
    useEffect(() => {
        const cachedOrder = localStorage.getItem('order');
        if (cachedOrder) {
            const parsedOrder = JSON.parse(cachedOrder);
            const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;
            const updatedOrderItems = parsedOrder.filter((item) => item.branchId === branch_id);
            // localStorage.setItem('order', JSON.stringify(updatedOrderItems));
            setOrderItems(updatedOrderItems);
        }
    }, [selectedBranch, dialogOpen]);
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
            const firstValidItem = filtered.find((item) => !item.isDisabled);
            if (firstValidItem) {
                setSelectedDrink(firstValidItem);
                setSelectedItemId(firstValidItem.rid);
            }
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
    const options = listBranch.map((item) => ({ value: item.id, label: item.name }));
    const filteredTables = listTable.filter((table) => table.branchId === selectedBranch);
    const tableOptions = filteredTables.map((item) => ({ value: item.id, label: item.name }));

    const handleBranchChange = (event) => {
        const value = event.target.value;
        setSelectedBranch(value);
        setSelectedTable(null);
        setFormData((prevFormData) => ({
            ...prevFormData,
            branchId: value
        }));
        localStorage.setItem('branch_id', value); // Lưu branch_id vào localStorage
        localStorage.removeItem('table_id'); // Xóa table_id khỏi localStorage khi thay đổi branch
    };

    const handleTableChange = (event) => {
        const value = event.target.value;
        setSelectedTable(value);
        localStorage.setItem('table_id', value); // Lưu table_id vào localStorage
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
        // Animation effect
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

    const handleClearSearch = () => {
        setKeywork('');
    };
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderLeft: '2px solid #F8F9FA',
                mb: 3
            }}
        >
            <Box>
                <Grid container spacing={1.5}>
                    <Grid item xs={5}>
                        <Box sx={{ maxHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'none', ml: 1.5 }}>
                            <Box
                                sx={{
                                    mb: 3,
                                    mt: 1,
                                    mx: 1,
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
                                    borderRadius: '15px',
                                    backgroundColor: '#FFFFFF',
                                    p: 2
                                }}
                            >
                                <Box mb={2}>
                                    <CustomSelect
                                        options={options}
                                        value={selectedBranch}
                                        onChange={handleBranchChange}
                                        list={listBranch}
                                        selected={selectedBranch}
                                        placeholder={'Chọn chi nhánh'}
                                    />
                                </Box>
                                <CustomSelect
                                    options={tableOptions}
                                    value={selectedTable}
                                    onChange={handleTableChange}
                                    list={filteredTables}
                                    selected={selectedTable}
                                    placeholder={'Chọn bàn'}
                                />
                            </Box>
                            <Divider />
                            <Paper
                                component="form"
                                sx={{
                                    p: '2px 4px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#EAEEF2',
                                    borderRadius: '42px',
                                    my: 3
                                }}
                                onChange={(e) => setKeywork((e.target as HTMLInputElement).value)}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Tìm kiếm"
                                    value={keywork || ''}
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                />
                                {keywork && (
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="clear search" onClick={handleClearSearch}>
                                        <Cancel />
                                    </IconButton>
                                )}
                                {!keywork && (
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                        <Search />
                                    </IconButton>
                                )}
                            </Paper>
                            <Grid container spacing={1.5}>
                                {filteredItems
                                    .sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1))
                                    .map((item) => (
                                        <Grid key={item.rid} item xs={12} md={12}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    borderRadius: '50px',
                                                    width: '100%',
                                                    height: 'auto',
                                                    backgroundColor: selectedItemId === item.rid ? '#FFF9E5' : '#FFFFFF'
                                                }}
                                                onClick={
                                                    !item.isDisabled
                                                        ? () => {
                                                              setSelectedDrink(item);
                                                              setSelectedItemId(item.rid);
                                                              handleChangeDrink();
                                                          }
                                                        : undefined
                                                } // Set selected drink on click
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
                                                            borderRadius: '50%',
                                                            width: '83px',
                                                            height: '83px',
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
                                                                    color: '#292929',
                                                                    fontWeight: '500',
                                                                    fontSize: '19px',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    width: '100%',
                                                                    whiteSpace: 'normal',
                                                                    wordWrap: 'break-word'
                                                                }}
                                                            >
                                                                {item.name}
                                                            </Typography>
                                                            <Box>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontWeight: '500',
                                                                        fontSize: '14px',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        width: '100%',
                                                                        whiteSpace: 'normal',
                                                                        wordWrap: 'break-word',
                                                                        marginBottom: '2px'
                                                                    }}
                                                                >
                                                                    Giá tiền: {formatCurrency(item.price)}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        width: '100%',
                                                                        fontSize: '12px',
                                                                        fontWeight: '400',
                                                                        whiteSpace: 'normal',
                                                                        wordWrap: 'break-word'
                                                                    }}
                                                                >
                                                                    Mô tả: {item.description}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
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
                                            </Box>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={7}>
                        {selectedDrink ? (
                            <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
                                <img
                                    src={randomImage}
                                    alt={selectedDrink.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '400px',
                                        height: 'auto',
                                        backgroundColor: '#fff',
                                        padding: '44px',
                                        borderRadius: '50px'
                                    }}
                                >
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
                                </Box>
                            </Box>
                        ) : (
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
                        )}
                    </Grid>
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
        </Box>
    );
};

export default HDMenuDrink;
