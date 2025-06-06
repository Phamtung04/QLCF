import HDTable, { ColumnProps } from 'components/HDTable';
import { useEffect, useState, ChangeEvent } from 'react';
import { Box, Grid, Typography, TextField, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, DeleteOutline, Edit, Search } from '@mui/icons-material';
import toastService from 'services/core/toast.service';
import tableService from 'services/table-service/table.service'; // Assume the new table service is set up
import branchService from 'services/branch-services/branch.service'; // New service for branches
import HDChinhSuaBan from './HDChinhSuaBan';
import HDThemBan from './HDThemBan';
import ShowQrDialog from './ShowQrDialog';
import AnimateButton from 'ui-component/extended/AnimateButton';
import QRCode from 'react-qr-code';
import useAuth from 'hooks/useAuth';

interface SelectedRowType {
    id: number;
    name: string;
    rid: string;
    description: string;
    status: number;
    quantity: number;
    branchId: number;
    branchName: string;
}

interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    branchId: number;
    userID: number;
}

const HDDanhSachBan = () => {
    const { userInfo } = useAuth();
    const [selectedRow, setSelectedRow] = useState<SelectedRowType | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [pageNum, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openQr, setOpenQr] = useState(false);
    const [selectedQr, setSelectedQr] = useState<SelectedRowType | null>(null);
    const [listBranch, setListBranch] = useState<SelectedRowType[]>([]);
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: pageNum + 1,
        rid: '',
        name: '',
        branchId: 0,
        userID: userInfo?.id ?? 0
    });

    const handleOpenModal = () => setOpenModal(true);

    const handleRowClick = (row: SelectedRowType) => setSelectedRow(row);

    const handleOpenQr = (row: SelectedRowType) => {
        setSelectedQr(row);
        setOpenQr(true);
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await tableService.getAllTables(formData);
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

    const getListBranch = async () => {
        try {
            const response = await branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: userInfo?.id ?? 0 });
            if (response) {
                setListBranch(response.result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNum, rowsPerPage]);

    useEffect(() => {
        getListBranch();
    }, []);

    const handleDelete = async (value: SelectedRowType) => {
        try {
            toastService.showConfirm({
                title: 'Bạn có chắc chắn?',
                text: 'Bạn có chắc chắn muốn xóa bàn này?',
                onConfirm: async () => {
                    try {
                        await tableService.deleteTable({ rid: value.rid });
                        toastService.toast('success', 'Thành công', 'Xóa thành công!');
                        await fetchData();
                    } catch (error) {
                        console.error('Lỗi xóa bàn:', error);
                        toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi xóa bàn!');
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const columns: ColumnProps[] = [
        { id: 'name', label: 'Tên bàn', headerCellSX: { background: '#EAEEF2' } },
        { id: 'description', label: 'Mô tả', headerCellSX: { background: '#EAEEF2' } },
        { id: 'branchName', label: 'Chi nhánh', headerCellSX: { background: '#EAEEF2' } },
        {
            id: 'ma_qr',
            label: 'Mã QR',
            headerCellSX: { background: '#EAEEF2' },
            renderCell: (value) => (
                <Box onClick={() => handleOpenQr(value)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                    <QRCode value={`http://localhost:8000/drinks?branch_id=${value.branchId}&table_id=${value.id}`} size={40} />
                </Box>
            )
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

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            page: 1,
            [name]: value
        }));
    };

    const handleAutocompleteChange = (event, newValue: SelectedRowType | null) => {
        setFormData((prevData) => ({
            ...prevData,
            page: 1,
            branchId: newValue ? newValue.id : 0
        }));
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý bàn</Typography>
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenModal} startIcon={<Add />}>
                                Thêm mới
                            </LoadingButton>
                            <HDThemBan open={openModal} onClose={setOpenModal} fetchData={() => fetchData()} listBranch={listBranch} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container spacing={2} my={2}>
                    <Grid item xs={12} md={5}>
                        <TextField fullWidth label="Tên bàn" name="name" value={formData.name} onChange={handleFormChange} />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Autocomplete
                            fullWidth
                            options={listBranch}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                            onChange={handleAutocompleteChange}
                            value={listBranch.find((branch) => branch.id === formData.branchId) || null}
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
                <HDChinhSuaBan
                    open
                    onClose={() => setSelectedRow(null)}
                    rid={selectedRow?.rid}
                    name={selectedRow?.name}
                    description={selectedRow?.description}
                    branchId={selectedRow?.branchId}
                    fetchData={() => fetchData()}
                    listBranch={listBranch}
                />
            )}
            <ShowQrDialog
                open={openQr}
                onClose={setOpenQr}
                branch_id={selectedQr?.branchId as number}
                table_id={selectedQr?.id as number}
            />
        </>
    );
};

export default HDDanhSachBan;
