import React, { useEffect, useState } from 'react';
import { Box, Card, Tab, Tabs, Typography, TextField, Grid } from '@mui/material';
import HDOrderListByTable from './HDOrderListByTable'; // Đổi từ HDOrderListByRoom thành HDOrderListByTable
import orderService from 'services/order-serrvice/order.service';
import useAuth from 'hooks/useAuth';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';
import { styled } from '@mui/system';

interface FormData {
    limit: number;
    page: number;
    rid: string;
    tableId: number; // Đổi từ room_id
    branchId: number; // Đổi từ building_id
    status: string;
    orderId: number;
    userId: number;
    date: string;
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

const CustomTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: 'rgb(247, 163, 10)'
    }
});

const CustomTab = styled((props: any) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    color: 'rgba(0, 0, 0, 0.85)',
    '&.Mui-selected': {
        color: 'rgb(247, 163, 10)',
        fontWeight: theme.typography.fontWeightMedium
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)'
    }
}));

const HDVictoriaView = ({ tableData }) => {
    const { userInfo } = useAuth();
    const [order, setOrder] = useState<any[]>([]);
    const [waitingOrders, setWaitingOrders] = useState<any[]>([]);
    const [confirmOrders, setConfirmOrders] = useState<any[]>([]);
    const [completedOrders, setCompletedOrders] = useState<any[]>([]);
    const [rejectOrders, setRejectOrders] = useState<any[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderStatus, setStatus] = useState<string>('');
    const [value, setValue] = useState(0);
    const tableID = tableData.id || null;
    const branchID = tableData.branchId || null;
    const tableName = tableData.name || '';

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [formData, setFormData] = useState<FormData>({
        limit: 0,
        page: 0,
        rid: '',
        branchId: branchID,
        tableId: tableID,
        status: '',
        orderId: 0,
        userId: userInfo?.id ?? 0,
        date: moment().format('DD/MM/YYYY')
    });

    useEffect(() => {
        if (userInfo) {
            if (userInfo.permission === 'RECEPTIONIST') {
                setStatus('');
            } else if (userInfo.permission === 'BARTENDING') {
                setStatus('Xác nhận,Đã hoàn thành,Từ chối');
            } else if (userInfo.permission === 'SUPERADMIN' || userInfo.permission === 'ADMIN') {
                setStatus('');
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (orderStatus) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                status: orderStatus
            }));
        }
    }, [orderStatus]);

    const fetchData = async () => {
        try {
            const response = await orderService.getAllOrder(formData);
            if (response) {
                const orders = response.result.listOrder.result;
                const orderItemsResponse = response.result.listOrderItem || [];
                console.log(orders);
                const filterOrdersByStatus = (statusOrder: string) => {
                    return orders.filter((item) => item.order_status === statusOrder);
                };
                setWaitingOrders(filterOrdersByStatus('Chờ xác nhận'));
                setConfirmOrders(filterOrdersByStatus('Xác nhận'));
                setCompletedOrders(filterOrdersByStatus('Đã hoàn thành'));
                setRejectOrders(filterOrdersByStatus('Từ chối'));
                setOrderItems(orderItemsResponse);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formData]);

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    const handleChangeDate = (newDate: Date | null) => {
        if (newDate) {
            const formattedDate = moment(newDate).format('DD/MM/YYYY');
            setFormData((prevFormData) => ({
                ...prevFormData,
                date: newDate ? formattedDate : moment().format('DD/MM/YYYY')
            }));
        }
    };

    function CustomTabPanel(props: { children?: React.ReactNode; valueTab: number; index: number }) {
        const { children, valueTab, index } = props;

        return (
            <div role="tabpanel" hidden={valueTab !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
                {valueTab === index && (
                    <Box>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>
            <Grid container alignItems="center">
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} fullWidth variant="outlined" label="Ngày đơn hàng" />}
                            value={moment(formData.date, 'DD/MM/YYYY').toDate()}
                            onChange={(newDate) => handleChangeDate(newDate)}
                            inputFormat="dd/MM/yyyy"
                            views={['day']}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Card sx={{ paddingBottom: '20px', mt: 2 }}>
                <Box p={1.5}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <CustomTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <CustomTab label={`Chờ xác nhận (${waitingOrders.length})`} {...a11yProps(0)} />
                            <CustomTab label={`Đã xác nhận (${confirmOrders.length})`} {...a11yProps(1)} />
                            <CustomTab label={`Đã hoàn thành (${completedOrders.length})`} {...a11yProps(2)} />
                            <CustomTab label={`Đã từ chối (${rejectOrders.length})`} {...a11yProps(3)} />
                        </CustomTabs>
                    </Box>

                    <CustomTabPanel valueTab={value} index={0}>
                        <HDOrderListByTable
                            table_Id={tableID}
                            branch_id={branchID}
                            tableName={tableName}
                            listOrders={waitingOrders}
                            listOrderItems={orderItems}
                            orderData={order}
                            setOrderData={setOrder}
                            getOrder={fetchData}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel valueTab={value} index={1}>
                        <HDOrderListByTable
                            table_Id={tableID}
                            branch_id={branchID}
                            tableName={tableName}
                            listOrders={confirmOrders}
                            listOrderItems={orderItems}
                            orderData={order}
                            setOrderData={setOrder}
                            getOrder={fetchData}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel valueTab={value} index={2}>
                        <HDOrderListByTable
                            table_Id={tableID}
                            branch_id={branchID}
                            tableName={tableName}
                            listOrders={completedOrders}
                            listOrderItems={orderItems}
                            orderData={order}
                            setOrderData={setOrder}
                            getOrder={fetchData}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel valueTab={value} index={3}>
                        <HDOrderListByTable
                            table_Id={tableID}
                            branch_id={branchID}
                            tableName={tableName}
                            listOrders={rejectOrders}
                            listOrderItems={orderItems}
                            orderData={order}
                            setOrderData={setOrder}
                            getOrder={fetchData}
                        />
                    </CustomTabPanel>
                </Box>
            </Card>
        </>
    );
};

export default HDVictoriaView;
