import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Stack,
    TextField,
    Autocomplete,
    CircularProgress,
    Chip
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import toastService from 'services/core/toast.service';
import orderService from 'services/order-serrvice/order.service';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import homeService from 'services/home-service/home.service';
import HDOrderItemDialog from './HDOrderItemDialog';
import QRCode from 'react-qr-code';
import { DateTimePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { Search } from '@mui/icons-material';
import tableService from 'services/table-service/table.service';
import branchService from 'services/branch-services/branch.service';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { formatCurrency } from 'utils/currencyFormatter';

interface Order {
    rid: string;
    branch_id: number;
    branch_id_1: number | null;
    branch_name: string | null;
    description: string;
    order_id: number;
    order_status: string;
    order_time: string;
    table_id: number;
    table_name: string;
    order_note: string;
    totalPrice: number;
    payment_method: string;
}
interface OrderItem {
    order_item_id: number;
    order_id: number;
    item_id: number;
    quantity: number;
    date_Create: string;
    rid: string;
    note: string | null;
    category_id: number;
    item_description: string;
    image: string;
    item_name: string;
    category_name: string;
}

interface SelectedRowType {
    rid: string;
    image: string;
    id: number;
    name: string;
}
interface FormData {
    limit: number;
    page: number;
    rid: string;
    tableId: number;
    branchId: number;
    status: string;
    orderId: number;
    userId: number;
    date: string;
}
interface Table {
    id: number;
    name: string;
    branchId: number;
}
interface Branch {
    rid: string;
    name: string;
    description: string;
    id: number;
    branchId: number;
}
const HDDanhSachOrder = () => {
    const { userInfo } = useAuth();
    const theme = useTheme();
    const [listBranch, setListBranch] = useState<Branch[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [pageNum, setPage] = useState(0);
    const location = useLocation();
    const [orderId, setOrderId] = useState<number | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listTables, setListTable] = useState<Table[]>([]);
    const storedOrderId = localStorage.getItem('order_id');
    const [formData, setFormData] = useState<FormData>({
        limit: rowsPerPage,
        page: pageNum + 1,
        rid: '',
        tableId: 0,
        branchId: 0,
        status: '',
        orderId: Number(storedOrderId) || 0,
        userId: userInfo?.id ?? 0,
        date: moment().format('DD/MM/YYYY')
    });
    const listStatus = [
        { id: 1, name: 'Chờ xác nhận' },
        { id: 2, name: 'Xác nhận' },
        { id: 3, name: 'Đã hoàn thành' },
        { id: 4, name: 'Từ chối' }
    ];
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (Number(storedOrderId) !== 0) {
            setOrderId(Number(storedOrderId));
            setFormData((prevData) => ({
                ...prevData,
                order_id: Number(storedOrderId)
            }));
            localStorage.removeItem('order_id');
        }
    }, [storedOrderId]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await orderService.getAllOrder(formData);
            console.log(response);
            if (response) {
                setOrders(response.result.listOrder.result);
                setOrderItems(response.result.listOrderItem || []);
                setTotalPage(response.result.listOrder.total);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingData(false);
        }
    };
    const fetchAllTableAndBranch = async () => {
        try {
            const [tableResponse, branchResponse] = await Promise.all([
                tableService.getAllTables({ page: 0, limit: 0, name: '', rid: '', branchId: 0, userID: userInfo?.id ?? 0 }),
                branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: userInfo?.id ?? 0 })
            ]);

            if (tableResponse) {
                setListTable(tableResponse.result);
            }
            if (branchResponse) {
                setListBranch(branchResponse.result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [pageNum, rowsPerPage]);
    useEffect(() => {
        fetchAllTableAndBranch();
    }, []);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setFormData((prevFormData) => ({
            ...prevFormData,
            page: newPage + 1
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = +event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        setFormData((prevFormData) => ({
            ...prevFormData,
            limit: newRowsPerPage,
            page: 1
        }));
    };

    const formatTime = (sentTime) => {
        const orderTimeVN = moment(sentTime).format('HH:mm DD/MM/YYYY');
        return orderTimeVN;
    };

    const handleStepClick = async (step: string, orderRid: string) => {
        try {
            await orderService.updateOrder({ rid: orderRid, status: step, message: '' });
            toastService.toast('success', 'Thành công', 'Cập nhật trạng thái thành công!');
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi Cập nhật trạng thái!');
        }
    };

    const handleOpenDialog = (order: Order) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedOrder(null);
    };
    const handleChange = (name: string, value: string | number) => {
        setFormData((prevState) => ({
            ...prevState,
            page: 1,
            [name]: value
        }));
    };
    useEffect(() => {
        fetchTablesByBranchId(formData.branchId);
    }, [formData.branchId]);
    const fetchTablesByBranchId = async (branchId: number) => {
        try {
            const response = await tableService.getAllTables({
                page: 0,
                limit: 0,
                name: '',
                rid: '',
                branchId,
                userID: userInfo?.id ?? 0
            });

            if (response && response.result) {
                setListTable(response.result);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };
    const handleStatusChange = (event, newValue) => {
        const selectedStatus = newValue.map((status) => status.name).join(',');
        setFormData((prevFormData) => ({
            ...prevFormData,
            page: 1,
            status: selectedStatus
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xác nhận':
                return {
                    backgroundColor: '#FFDF80',
                    color: '#464646'
                };
            case 'Xác nhận':
                return {
                    backgroundColor: '#20B2AA',
                    color: '#FFFFFF'
                };
            case 'Đã hoàn thành':
                return {
                    backgroundColor: '#40B340',
                    color: '#FFFFFF'
                };
            case 'Từ chối':
                return {
                    backgroundColor: '#EF5350',
                    color: '#FFFFFF'
                };
            default:
                return {
                    backgroundColor: 'default',
                    color: 'default'
                };
        }
    };
    const handleChangeDate = (newDate: Date | null) => {
        if (newDate) {
            const formattedDate = moment(newDate).format('DD/MM/YYYY');
            setFormData((prevFormData) => ({
                ...prevFormData,
                date: newDate ? formattedDate : moment().format('DD/MM/YYYY')
            }));
        }
    };
    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontWeight: 700, fontSize: '24px' }}>Quản lý đơn hàng</Typography>
            </Grid>
            <Grid item container spacing={3} mb={3}>
                <Grid item xs={12} md={2.6}>
                    <Autocomplete
                        fullWidth
                        options={listBranch}
                        getOptionLabel={(option) => option.name}
                        value={listBranch.find((option) => option.id === formData.branchId) || null}
                        onChange={(event, newValue) => handleChange('branchId', newValue ? newValue.id : 0)}
                        renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                    />
                </Grid>
                <Grid item xs={12} md={2.6}>
                    <Autocomplete
                        fullWidth
                        options={listTables}
                        getOptionLabel={(option) => option.name}
                        value={listTables.find((option) => option.id === formData.tableId) || null}
                        onChange={(event, newValue) => handleChange('tableId', newValue ? newValue.id : 0)}
                        renderInput={(params) => <TextField {...params} label="Bàn" />}
                    />
                </Grid>
                <Grid item xs={12} md={2.6}>
                    <Autocomplete
                        multiple
                        fullWidth
                        options={listStatus}
                        getOptionLabel={(option) => option.name}
                        value={listStatus.filter((option) => formData.status.split(',').includes(option.name)) || []}
                        onChange={handleStatusChange}
                        renderInput={(params) => <TextField {...params} label="Trạng thái" />}
                    />
                </Grid>
                <Grid item xs={12} md={2.6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} fullWidth label="Ngày đơn hàng" />}
                            value={moment(formData.date, 'DD/MM/YYYY').toDate()}
                            onChange={(newDate) => handleChangeDate(newDate)}
                            inputFormat="dd/MM/yyyy"
                            views={['day']}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={1.4}>
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
            <Box>
                <TableContainer component={Paper} elevation={3} sx={{ p: 2 }}>
                    {loadingData ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            backgroundColor: '#F4F6F8',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Mã đơn
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Ngày tạo
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Chi nhánh
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Bàn
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Tổng tiền
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                    Phương thức thanh toán
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1.7}>
                                                <Box display="flex" justifyContent="center" alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#616161' }}>
                                                        Trạng Thái
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow
                                            key={order.order_id}
                                            onClick={() => handleOpenDialog(order)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell colSpan={4}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={1.7}>
                                                        <Typography>{order.order_id}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Typography>{formatTime(order.order_time)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Typography>{order.branch_name}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Typography>{order.table_name}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Typography>{formatCurrency(order.totalPrice)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Typography>
                                                            {order.payment_method ? order.payment_method : 'Chưa cập nhật'}
                                                        </Typography>{' '}
                                                        {/* New Payment Method Column */}
                                                    </Grid>
                                                    <Grid item xs={1.7}>
                                                        <Box display="flex" justifyContent="center" alignItems="center">
                                                            <Chip
                                                                label={order.order_status}
                                                                style={{
                                                                    ...getStatusColor(order.order_status),
                                                                    lineHeight: 2,
                                                                    borderRadius: 8,
                                                                    fontWeight: 600,
                                                                    height: 24,
                                                                    width: 150
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Typography variant="body2" color="textSecondary" align="center">
                                                Không có đơn hàng
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <Box display="flex" justifyContent="right" alignItems="center">
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={totalPage}
                        rowsPerPage={rowsPerPage}
                        page={pageNum}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Tổng số trên 1 trang:"
                        nextIconButtonProps={{
                            sx: { display: 'none' }
                        }}
                        backIconButtonProps={{
                            sx: { display: 'none' }
                        }}
                        labelDisplayedRows={(paginationInfo) => (
                            <>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ ml: 1.5, display: 'flex', justifyItems: 'flex-end', alignItems: 'center' }}
                                    component="span"
                                >
                                    Hiển thị từ {paginationInfo.from} - {paginationInfo.from + rowsPerPage - 1} trên tổng số{' '}
                                    {totalPage ? totalPage * rowsPerPage : 0}
                                </Typography>
                                <Stack>
                                    <Pagination
                                        count={totalPage}
                                        color="primary"
                                        page={paginationInfo.page + 1}
                                        onChange={(e, v) => handleChangePage(e, v - 1)}
                                        showFirstButton
                                        showLastButton
                                    />
                                </Stack>
                            </>
                        )}
                    />
                </Box>
            </Box>

            <HDOrderItemDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                order={selectedOrder}
                orderItems={orderItems}
                handleStepClick={handleStepClick}
            />
        </>
    );
};

export default HDDanhSachOrder;
