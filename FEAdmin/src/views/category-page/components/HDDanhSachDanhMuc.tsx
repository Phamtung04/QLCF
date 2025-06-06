import React, { useEffect, useState } from 'react';
import { Autocomplete, Avatar, Box, Grid, TextField, Typography } from '@mui/material';
import { Add, DeleteOutline, Edit, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import AnimateButton from 'ui-component/extended/AnimateButton';
import HDTable, { ColumnProps } from 'components/HDTable';
import useAuth from 'hooks/useAuth';
import toastService from 'services/core/toast.service';
import IcDrink from 'assets/images/noti.jpg';
import HDThemDanhMuc from './HDThemDanhMuc';
import HDChinhSuaDanhMuc from './HDChinhSuaDanhMuc';
import categoryService from 'services/category-services/category.service';

interface DanhMuc {
    rid: string;
    image: string;
    id: number;
    name: string;
}
interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
}
interface SelectedRowType {
    rid: string;
    image: string;
    id: number;
    name: string;
}

const HDDanhSachDanhMuc = () => {
    const { user } = useAuth();
    const [selectedRow, setSelectedRow] = useState<SelectedRowType | null>(null);
    const [rows, setRows] = useState<DanhMuc[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: page + 1,
        rid: '',
        name: ''
    });
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleRowClick = async (value) => {
        setSelectedRow(value);
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await categoryService.getAllMenuCategories(formData);
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

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    // const transformData = (data: ChiNhanh[]): ChiNhanh[] => {
    //     const result: ChiNhanh[] = [];

    //     const addChildren = (item: ChiNhanh, prefix: string) => {
    //         result.push({ ...item, ten_DV: prefix + item.ten_DV });
    //         if (item.children && item.children.length > 0) {
    //             item.children.forEach((child) => addChildren(child, prefix + '--- '));
    //         }
    //     };

    //     data.forEach((item) => addChildren(item, ''));
    //     return result;
    // };

    const handleDelete = async (value) => {
        toastService.showConfirm({
            title: 'Bạn có chắc?',
            text: 'Bạn có chắc muốn xóa danh mục này?',
            onConfirm: async () => {
                try {
                    await categoryService.deleteCategory({ rid: value.rid.toString() });
                    toastService.toast('success', 'Thành công', 'Xóa thành công!');
                    await fetchData();
                } catch (error) {
                    toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi xóa danh mục!');
                }
            }
        });
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
            label: 'Tên Danh mục',
            headerCellSX: { background: '#EAEEF2' }
        },

        {
            id: 'hanhDong',
            label: 'Thao tác',
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                    <AnimateButton>
                        <Box sx={{ width: 25, height: 25, cursor: 'pointer' }} onClick={() => handleRowClick(value)}>
                            <Edit />
                        </Box>
                    </AnimateButton>
                    <AnimateButton>
                        <Box sx={{ width: 25, height: 25, cursor: 'pointer' }} onClick={() => handleDelete(value)}>
                            <DeleteOutline />
                        </Box>
                    </AnimateButton>
                </Box>
            )
        }
    ];

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
    const handleNameChange = (event) => {
        const newName = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            page: 1,
            name: newName
        }));
    };
    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý danh mục</Typography>
                <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenModal} startIcon={<Add />}>
                    Thêm mới
                </LoadingButton>
                <HDThemDanhMuc open={openModal} onClose={setOpenModal} fetchData={fetchData} />
            </Grid>
            <Grid item container spacing={2} my={2}>
                <Grid item xs={12} md={10}>
                    <TextField fullWidth label="Tên danh mục" name="name" value={formData.name} onChange={handleNameChange} />
                </Grid>
                <Grid item xs={12} md={2}>
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
                page={page}
                totalPage={totalPage}
            />

            {selectedRow && (
                <HDChinhSuaDanhMuc open onClose={() => setSelectedRow(null)} selectedValue={selectedRow} fetchData={fetchData} />
            )}
        </>
    );
};

export default HDDanhSachDanhMuc;
