import HDTable, { ColumnProps } from 'components/HDTable';
import { useEffect, useState } from 'react';
import { Box, Grid, Checkbox, Typography, Button, TextField, Autocomplete } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import EditIcon from '@mui/icons-material/Edit';
import { Add, DeleteOutline, QrCode, Search } from '@mui/icons-material';
import toastService from 'services/core/toast.service';
import HDChinhSuaUser from './HDChinhSuaUser';
import { LoadingButton } from '@mui/lab';
import HDThemUser from './HDThemUser';
import branchService from 'services/branch-services/branch.service'; // Changed from buildingService
import userService from 'services/user-service/user.service';

interface SelectedRowType {
    rid: string;
    name: string;
    permission: string;
    lockUp: boolean;
    listBranchId: number;
    email: string;
}
interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    branchId: number;
}
interface Branch {
    id: number;
    name: string;
}
const HDDanhSachUser = () => {
    const { user } = useAuth();
    const [selectedRow, setSelectedRow] = useState<SelectedRowType | null>(null);
    const [rows, setRows] = useState<SelectedRowType[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [pageNum, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedQr, setSelectedQr] = useState<SelectedRowType | null>(null);
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: pageNum + 1,
        rid: '',
        name: '',
        branchId: 0
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
            const response = await userService.getAllUser(formData);
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
    }, [pageNum, rowsPerPage]);
    const handleDelete = async (value) => {
        try {
            toastService.showConfirm({
                title: 'Bạn có chắc chắn?',
                text: 'Bạn có chắc chắn muốn xóa tài khoản này?',
                onConfirm: async () => {
                    try {
                        await userService.deleteUser({ rid: value.rid });
                        toastService.toast('success', 'Thành công', 'Xóa thành công!');
                        await fetchData();
                    } catch (error) {
                        console.error('Lỗi xóa tài khoản:', error);
                        toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi xóa tài khoản!');
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    };
    const handleSubmit = async (row) => {
        try {
            const updatedRow = {
                lockUp: !row.lockUp,
                rid: row.rid
            };
            await userService.updateTTUser(updatedRow);
            toastService.toast('success', 'Thành công', 'Cập nhật tài khoản thành công!');
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật tài khoản!');
        }
    };
    const columns: ColumnProps[] = [
        {
            id: 'name',
            label: 'Tên tài khoản',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'permission',
            label: 'Loại tài khoản',
            headerCellSX: { background: '#EAEEF2' },
            renderCell: (row) => {
                let permissionLabel = '';
                switch (row.permission) {
                    case 'SUPERADMIN':
                        permissionLabel = 'Admin';
                        break;
                    case 'ADMIN':
                        permissionLabel = 'Quản lý';
                        break;
                    case 'BARTENDING':
                        permissionLabel = 'Pha chế';
                        break;
                    case 'RECEPTIONIST':
                        permissionLabel = 'Nhân viên';
                        break;
                    default:
                        permissionLabel = row.permission;
                }
                return <span>{permissionLabel}</span>;
            }
        },
        {
            id: 'email',
            label: 'Email',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'listNameBranch',
            label: 'Chi nhánh quản lý',
            headerCellSX: { background: '#EAEEF2' },
            renderCell: (row) => <span>{row.listNameBranch}</span> // Show branch names
        },
        {
            id: 'lockUp',
            label: 'Khóa tài khoản',
            headerCellSX: { background: '#EAEEF2', textAlign: 'center' },
            renderCell: (row) => (
                <Box
                    onClick={() => handleSubmit(row)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}
                >
                    <Checkbox checked={row.lockUp} />
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
    const fetchBranches = async () => {
        try {
            const response = await branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: 0 });
            setBranches(response.result);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };
    useEffect(() => {
        fetchBranches();
    }, []);
    const handleChange = (name: string, value: string | number) => {
        setFormData((prevState) => ({
            ...prevState,
            page: 1,
            [name]: value
        }));
    };
    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý tài khoản</Typography>
                <Grid item>
                    <Grid container alignItems="center">
                        <Grid item>
                            <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenModal} startIcon={<Add />}>
                                Thêm mới
                            </LoadingButton>
                            <HDThemUser open={openModal} onClose={setOpenModal} fetchData={() => fetchData()} branches={branches} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container spacing={3} mt={0.5}>
                    <Grid item xs={12} md={5}>
                        <TextField
                            fullWidth
                            label="Tên tài khoản"
                            name="name"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Autocomplete
                            fullWidth
                            options={branches}
                            getOptionLabel={(option) => option.name}
                            value={branches.find((option) => option.id === formData.branchId) || null}
                            onChange={(event, newValue) => handleChange('branchId', newValue ? newValue.id : 0)}
                            renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                        />
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
            </Grid>

            <HDTable
                sxTableContainer={{ maxHeight: 270 }}
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
                <HDChinhSuaUser
                    open
                    onClose={() => setSelectedRow(null)}
                    selectedUser={selectedRow}
                    fetchData={() => fetchData()}
                    branches={branches}
                />
            )}
        </>
    );
};

export default HDDanhSachUser;
