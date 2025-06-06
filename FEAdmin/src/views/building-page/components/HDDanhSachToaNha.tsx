import HDTable, { ColumnProps } from 'components/HDTable';
import { useEffect, useState } from 'react';
import { Box, Grid, Checkbox, Typography, Button } from '@mui/material';
import { v4 } from 'uuid';
import { UseMutationResult } from 'react-query';
import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import { EyeBold } from 'assets/JsxIcon/EyeBold';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Add, DeleteOutline, QrCode } from '@mui/icons-material';
import toastService from 'services/core/toast.service';
import HDChinhSuaChiNhanh from './HDChinhSuaChiNhanh';
import { LoadingButton } from '@mui/lab';
import HDThemChiNhanh from './HDThemChiNhanh';
import branchService from 'services/branch-services/branch.service';
import QRCode from 'react-qr-code';
import ShowQrDialog from './ShowQrDialog';

interface SelectedRowType {
    rid: string;
    name: string;
    description: string;
    id: number;
}
interface FormData {
    limit: number;
    page: number;
    rid: string;
    name: string;
    userID: number;
}

const HDDanhSachChiNhanh = () => {
    const { user, userInfo } = useAuth();
    const [selectedRow, setSelectedRow] = useState<SelectedRowType | null>(null);
    const [rows, setRows] = useState<SelectedRowType[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [pageNum, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openQr, setOpenQr] = useState(false);
    const [selectedQr, setSelectedQr] = useState<SelectedRowType | null>(null);
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: pageNum + 1,
        rid: '',
        name: '',
        userID: userInfo?.id ?? 0
    });

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleOpenQr = (row) => {
        setSelectedQr(row);
        setOpenQr(true);
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await branchService.getAllBranches(formData);
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
                text: 'Bạn có chắc chắn muốn xóa chi nhánh này?',
                onConfirm: async () => {
                    try {
                        await branchService.deleteBranch({ rid: value.rid });
                        toastService.toast('success', 'Thành công', 'Xóa thành công!');
                        await fetchData();
                    } catch (error) {
                        console.error('Lỗi xóa chi nhánh:', error);
                        toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi xóa chi nhánh!');
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const columns: ColumnProps[] = [
        {
            id: 'name',
            label: 'Tên chi nhánh',
            headerCellSX: { background: '#EAEEF2' }
        },
        {
            id: 'description',
            label: 'Mô tả',
            headerCellSX: { background: '#EAEEF2' }
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

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý chi nhánh</Typography>
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenModal} startIcon={<Add />}>
                                Thêm mới
                            </LoadingButton>
                            <HDThemChiNhanh open={openModal} onClose={setOpenModal} fetchData={() => fetchData()} />
                        </Grid>
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
                <HDChinhSuaChiNhanh
                    open
                    onClose={() => setSelectedRow(null)}
                    rid={selectedRow?.rid}
                    name={selectedRow?.name}
                    description={selectedRow?.description}
                    fetchData={() => fetchData()}
                />
            )}
            <ShowQrDialog open={openQr} onClose={setOpenQr} branch_id={selectedQr?.id as number} />
        </>
    );
};

export default HDDanhSachChiNhanh;
