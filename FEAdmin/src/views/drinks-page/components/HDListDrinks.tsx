import HDTable, { ColumnProps } from 'components/HDTable';
import { useEffect, useState } from 'react';
import { Box, Grid, Checkbox, Typography, Avatar, TextField, Autocomplete } from '@mui/material';
import { v4 } from 'uuid';
import { UseMutationResult } from 'react-query';
import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import IcDrink from 'assets/images/noti.jpg';
import EditIcon from '@mui/icons-material/Edit';
import { Add, DeleteOutline, Search } from '@mui/icons-material';
import toastService from 'services/core/toast.service';
import HDEditDrink from './HDEditDrink';
import { LoadingButton } from '@mui/lab';
import HDAddDrink from './HDAddDrink';
import drinkService from 'services/drink-service/drink.service';
import categoryService from 'services/category-services/category.service';
import branchService from 'services/branch-services/branch.service';
import { formatCurrency } from 'utils/currencyFormatter';

interface DrinkItem {
    rid: string;
    categoryId: number;
    branchId: number; // Đổi từ buildingId thành branchId
    categoryName: string;
    description: string;
    disabled: boolean;
    image: string;
    id: number;
    name: string;
    price: number;
}
interface Category {
    id: number;
    name: string;
    image: string;
}
interface Branch {
    rid: string;
    name: string;
    description: string;
    id: number;
    branchId: number; // Đổi từ buildingId thành branchId
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

const HDListDrinks = () => {
    const { userInfo } = useAuth();
    const [selectedRow, setSelectedRow] = useState<DrinkItem | null>(null);
    const [categories, setCategory] = useState<Category[]>([]);
    const [listBranch, setListBranch] = useState<Branch[]>([]); // Đổi từ listBuilding thành listBranch
    const [rows, setRows] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [pageNum, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(15);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: pageNum + 1,
        rid: '',
        name: '',
        categoryId: 0,
        branchId: 0, // Đổi từ buildingId thành branchId
        isDisabled: -1,
        userID: userInfo?.id ?? 0
    });

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleRowClick = (row) => {
        setSelectedRow(row);
    };
    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await drinkService.getAllDrink(formData);
            if (response) {
                setRows(response.result);
                setTotalPage(response.total);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingData(false);
        }
    };
    const fetchAllCategoryAndBranch = async () => {
        try {
            const [categoryResponse, branchResponse] = await Promise.all([
                categoryService.getAllMenuCategories({ page: 0, limit: 0, name: '', rid: '' }),
                branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: userInfo?.id ?? 0 }) // Đổi từ buildingService thành branchService
            ]);

            if (categoryResponse) {
                setCategory(categoryResponse.result);
            }
            if (branchResponse) {
                setListBranch(branchResponse.result); // Đổi từ setListBuilding thành setListBranch
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAllCategoryAndBranch();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pageNum, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setFormData((prevData) => ({
            ...prevData,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = +event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setFormData((prevData) => ({
            ...prevData,
            limit: newRowsPerPage,
            page: 1
        }));
    };
    const handleSubmit = async (row) => {
        console.log('Current Row:', row); // Kiểm tra giá trị trước khi gửi

        try {
            const updatedRow = {
                ...row,
                disabled: row.disabled ? false : true, // Đảo giá trị mà không cần `!`
                image: ''
            };
            await drinkService.editDrink(updatedRow);
            toastService.toast('success', 'Thành công', 'Cập nhật đồ uống thành công!');
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật đồ uống!');
        }
    };

    const handleDelete = async (value) => {
        try {
            toastService.showConfirm({
                title: 'Bạn có chắc chắn?',
                text: 'Bạn có chắc chắn muốn xóa đồ uống này?',
                onConfirm: async () => {
                    try {
                        await drinkService.deleteDrink({ rid: value.rid });
                        toastService.toast('success', 'Thành công', 'Xóa thành công!');
                        await fetchData();
                    } catch (error) {
                        console.error('Lỗi xóa chức danh:', error);
                        toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi xóa đồ uống!');
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    };
    const columns: ColumnProps[] = [
        {
            id: 'image',
            label: 'Hình ảnh',
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar src={row.image ? `${row.image}` : IcDrink} alt={row.name} sx={{ width: 65, height: 65 }} />
                </Box>
            )
        },
        {
            id: 'name',
            label: 'Tên đồ uống',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'categoryName',
            label: 'Tên danh mục',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'branchName',
            label: 'Chi nhánh', // Đổi từ Tòa nhà thành Chi nhánh
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'description',
            label: 'Mô tả',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'price',
            label: 'Giá tiền', // Thêm cột Giá tiền
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (row) => <Typography sx={{ textAlign: 'center' }}>{row.price ? `${formatCurrency(row.price)}` : 'N/A'}</Typography>
        },
        {
            id: 'isDisabled',
            label: 'Hết món',
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (row) => (
                <Box
                    onClick={() => handleSubmit(row)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}
                >
                    <Checkbox checked={row.isDisabled} />
                </Box>
            )
        },
        {
            id: 'hanhDong',
            label: 'Thao tác',
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (value) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <AnimateButton>
                            <Box sx={{ width: 25, height: 25, cursor: 'pointer' }} onClick={() => handleRowClick(value)}>
                                <EditIcon />
                            </Box>
                        </AnimateButton>
                        <AnimateButton>
                            <Box sx={{ width: 25, height: 25, cursor: 'pointer' }} onClick={() => handleDelete(value)}>
                                <DeleteOutline />
                            </Box>
                        </AnimateButton>
                    </Box>
                );
            }
        }
    ];

    const handleChange = (name: string, value: string | number) => {
        setFormData((prevState) => ({
            ...prevState,
            page: 1, // Reset the formData page to 1
            [name]: value
        }));
    };
    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý đồ uống</Typography>
                <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenModal} startIcon={<Add />}>
                    Thêm mới
                </LoadingButton>
                <HDAddDrink
                    open={openModal}
                    onClose={setOpenModal}
                    fetchData={() => fetchData()}
                    categories={categories}
                    listBranch={listBranch} // Đổi từ listBuilding thành listBrand
                />
            </Grid>
            <Grid item container spacing={3} mb={3}>
                <Grid item xs={12} md={3.3}>
                    <TextField fullWidth label="Tên đồ uống" name="name" onChange={(e) => handleChange(e.target.name, e.target.value)} />
                </Grid>
                <Grid item xs={12} md={3.3}>
                    <Autocomplete
                        fullWidth
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        value={categories.find((option) => option.id === formData.categoryId) || null}
                        onChange={(event, newValue) => handleChange('categoryId', newValue ? newValue.id : 0)}
                        renderInput={(params) => <TextField {...params} label="Danh mục" />}
                    />
                </Grid>
                <Grid item xs={12} md={3.3}>
                    <Autocomplete
                        fullWidth
                        options={listBranch} // Đổi từ listBuilding thành listBranch
                        getOptionLabel={(option) => option.name}
                        value={listBranch.find((option) => option.id === formData.branchId) || null} // Đổi từ buildingId thành branchId
                        onChange={(event, newValue) => handleChange('branchId', newValue ? newValue.id : 0)} // Đổi từ buildingId thành branchId
                        renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                    />
                </Grid>
                <Grid item xs={12} md={2.1}>
                    <LoadingButton
                        variant="contained"
                        disableElevation
                        size="medium"
                        startIcon={<Search />}
                        sx={{ width: '100%', height: '100%' }}
                        onClick={fetchData}
                    >
                        Tìm kiếm
                    </LoadingButton>
                </Grid>
            </Grid>
            <HDTable
                sxTableContainer={{ maxHeight: 350 }}
                loading={loadingData}
                rows={rows}
                columns={columns}
                border
                isGlobalFilter={false}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowsPerPage={rowsPerPage}
                page={pageNum}
                totalPage={totalPage}
            />
            {selectedRow && (
                <HDEditDrink
                    open
                    onClose={() => setSelectedRow(null)}
                    selectedDrink={selectedRow}
                    fetchData={() => fetchData()}
                    categories={categories}
                    listBranch={listBranch} // Đổi từ listBuilding thành listBrand
                />
            )}
        </>
    );
};

export default HDListDrinks;
