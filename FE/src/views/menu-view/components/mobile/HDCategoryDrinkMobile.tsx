import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase, Paper, InputBase, IconButton } from '@mui/material';
import CategoryDialog from './Dialog/CategoryDialog';
import homeService from 'services/home-service/home.service';
import IcDrink from 'assets/images/noti.jpg';
import CustomSelect from 'components/CustomSelect';
import NotificationSection from 'layout/MainLayout/Header/NotificationSectionMobile';
import { Cancel, LocalMallOutlined, Search } from '@mui/icons-material';

interface Category {
    id: number;
    name: string;
    image: string | null;
    quantity: number;
}

interface Props {
    selectedCategory: number | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
    handleSelect: (id: number) => void;
    setListTable: any;
    listTable: any;
    selectedBranch: any;
    setListBranch: any;
    selectedTable: any;
    setSelectedTableName: any;
    setSelectedTable: any;
    listBranch: any;
    setSelectedBranch: any;
    setKeywork: any;
    keywork: any;
    cartRef: any;
    cartItemCount: any;
    handleDialogOpen: any;
}

const HDCategoryDrinkMobile: React.FC<Props> = ({
    selectedCategory,
    selectedBranch,
    handleSelect,
    setListTable,
    listTable,
    setSelectedCategory,
    setListBranch,
    selectedTable,
    setSelectedTableName,
    setSelectedBranch,
    setSelectedTable,
    listBranch,
    setKeywork,
    keywork,
    cartRef,
    cartItemCount,
    handleDialogOpen
}) => {
    const [listCategories, setListCategory] = useState<Category[]>([]);
    const handleClearSearch = () => {
        setKeywork('');
    };
    const IconCategory = 'https://cdn-icons-png.flaticon.com/512/4080/4080639.png';
    const fetchData = async () => {
        try {
            const [homeResponse] = await Promise.all([homeService.getAllFilterHome({ branchId: selectedBranch })]);

            if (homeResponse) {
                setListCategory(homeResponse.result.listMenuCategories);
                setListTable(homeResponse.result.listTable);
                setListBranch(homeResponse.result.listBranch);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedBranch]);

    useEffect(() => {
        const cachedOrder = localStorage.getItem('order');
        if (cachedOrder) {
            const parsedOrder = JSON.parse(cachedOrder);
            const branch_id = selectedBranch ? parseInt(selectedBranch, 10) : 0;
            const updatedOrderItems = parsedOrder.filter((item) => item.branchId === branch_id);
            // localStorage.setItem('order', JSON.stringify(updatedOrderItems));
        }
    }, [selectedBranch]);
    const options = listBranch.map((item) => ({ value: item.id, label: item.name }));
    const filteredTables = listTable.filter((table) => table.branchId === selectedBranch);
    const tableOptions = filteredTables.map((item) => ({ value: item.id, label: item.name }));
    const handleBranchChange = (event) => {
        const value = event.target.value;
        setSelectedBranch(value);
        setSelectedTable(null);
        localStorage.setItem('branch_id', value); // Lưu branch_id vào localStorage
        localStorage.removeItem('table_id'); // Xóa table_id khỏi localStorage khi thay đổi branch
    };

    const handleTableChange = (event) => {
        const value = event.target.value;
        setSelectedTable(value);
        localStorage.setItem('table_id', value); // Lưu table_id vào localStorage
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column', // Thêm dòng này để căn các phần tử trong cột
                justifyContent: 'center',
                zIndex: 300,
                px: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#EAEEF2',
                        borderRadius: '42px',
                        my: 3,
                        mr: 1,
                        opacity: '75%'
                    }}
                    onChange={(e) => setKeywork((e.target as HTMLInputElement).value)}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Tìm kiếm"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={keywork || ''}
                        onChange={(e) => setKeywork(e.target.value)}
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
                <NotificationSection />
                <IconButton
                    sx={{
                        my: 1,
                        ml: 1,
                        color: '#464646',
                        backgroundColor: '#ffd643',
                        borderRadius: '50%',
                        p: 1.5,
                        '&:hover': {
                            backgroundColor: '#ffd643' // Bảo đảm rằng màu nền không thay đổi khi hover
                        },
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem' // Tăng kích thước icon
                        }
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
                            ref={cartRef}
                        >
                            {cartItemCount}
                        </Box>
                    )}
                </IconButton>
            </Box>
            <Box
                sx={{
                    mb: 3,
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
            <Box
                sx={{
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '24px',
                    maxWidth: '92vw', // Ensure the container respects viewport width
                    width: '100%', // Take up full width of parent
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '10px',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: '10px',
                        padding: '8px',
                        width: '100%', // Ensure the inner content respects full width
                        overflowX: 'auto',
                        scrollbarWidth: 'none'
                    }}
                >
                    <ButtonBase
                        onClick={() => handleSelect(0)}
                        sx={{
                            border: selectedCategory === 0 ? `2px solid #FFC20E` : `transparent`,
                            borderRadius: '10px',
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0,
                            minWidth: '106px',
                            height: 'auto'
                        }}
                    >
                        <img
                            src={IconCategory}
                            alt={'danh mục'}
                            style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: '8px' }}
                        />
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', color: '#292929' }}>Tất cả</Typography>
                    </ButtonBase>
                    {listCategories.map((category) => (
                        <ButtonBase
                            key={category.id}
                            onClick={() => handleSelect(category.id)}
                            sx={{
                                border: selectedCategory === category.id ? `2px solid #FFC20E` : `transparent`,
                                borderRadius: '10px',
                                p: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flexShrink: 0,
                                minWidth: '106px',
                                height: 'auto'
                            }}
                        >
                            {category.image ? (
                                <img
                                    src={`${category.image}`}
                                    alt={category.name}
                                    style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: '8px' }}
                                />
                            ) : (
                                <img
                                    src={IcDrink}
                                    alt={category.name}
                                    style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: '8px' }}
                                />
                            )}
                            <Typography sx={{ fontWeight: '400', fontSize: '16px', color: '#292929' }}>{category.name}</Typography>
                        </ButtonBase>
                    ))}
                </Box>
                {/* <CategoryDialog open={dialogOpen} handleClose={handleDialogClose} handleSelect={handleSelect} sampleData={listCategories} /> */}
            </Box>
        </Box>
    );
};

export default HDCategoryDrinkMobile;
