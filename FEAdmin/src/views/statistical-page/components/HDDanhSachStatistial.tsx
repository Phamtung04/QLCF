import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Autocomplete } from '@mui/material';
import { formatCurrency } from 'utils/currencyFormatter';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { LocalizationProvider, LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import necessary chart.js modules
import statisticalService from 'services/statistical-services/statistical.service';
import branchService from 'services/branch-services/branch.service';
import { addDays, format, subDays } from 'date-fns';
import useAuth from 'hooks/useAuth';

// URLs for icons
const PRODUCT_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/2769/2769605.png';
const SHOPPING_BAG_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
const USER_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png';

interface RevenueByDate {
    date: string;
    revenue: number;
}

interface TopSellingProduct {
    itemId: number;
    itemName: string;
    totalSold: number;
}

interface StatisticsData {
    totalUsers: number;
    totalOrders: number;
    totalItems: number;
    revenueToday: number;
    growthVsYesterday: number;
    revenueThisMonth: number;
    growthVsLastMonth: number;
    revenueThisYear: number;
    growthVsLastYear: number;
    revenueByDate: RevenueByDate[];
    topSellingProducts: TopSellingProduct[];
}

const HDDanhSachStatistial = () => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [listBranch, setListBranch] = useState<any[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null); // State for selected branch
    const { userInfo } = useAuth();

    const adjustedStartDate = startDate ? subDays(startDate, 0) : subDays(new Date(), 1);
    const adjustedEndDate = endDate ? addDays(endDate, 1) : addDays(new Date(), 1);
    const formattedStartDate = format(adjustedStartDate, 'dd/MM/yyyy');
    const formattedEndDate = format(adjustedEndDate, 'dd/MM/yyyy');

    useEffect(() => {
        // Fetch statistics
        const fetchStatistics = async () => {
            try {
                const response = await statisticalService.getStatistics({
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    branchId: selectedBranchId || 0
                });
                setStatistics(response.result);
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            }
        };

        fetchStatistics();

        // Fetch branches
        const fetchBranches = async () => {
            try {
                const response = await branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: userInfo?.id ?? 0 });
                setListBranch(response.result);
                if (response.result.length > 0) {
                    setSelectedBranchId(response.result[0].id); // Auto-select first branch
                }
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };

        fetchBranches();
    }, [userInfo?.id]);

    const handleCalculateRevenue = async () => {
        setLoading(true);
        try {
            const response = await statisticalService.getStatistics({
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                branchId: selectedBranchId || 0
            });
            setStatistics(response.result);
        } catch (error) {
            console.error('Error calculating revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!statistics) {
        return <Typography>Loading statistics...</Typography>;
    }

    const chartData = {
        labels: statistics.revenueByDate.map((data) => data.date),
        datasets: [
            {
                label: 'Doanh thu',
                data: statistics.revenueByDate.map((data) => data.revenue),
                borderColor: '#00b0f0',
                backgroundColor: 'rgba(0, 176, 240, 0.2)',
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 500000,
                    callback: (tickValue: string | number) => (typeof tickValue === 'number' ? formatCurrency(tickValue) : tickValue)
                }
            }
        }
    } as any;

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h3" fontWeight={700}>
                    Thống kê doanh thu
                </Typography>
            </Grid>
            <Grid container spacing={2} mb={3} alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            fullWidth
                            options={listBranch}
                            getOptionLabel={(option) => option.name}
                            value={listBranch.find((option) => option.id === selectedBranchId) || null}
                            onChange={(event, newValue) => setSelectedBranchId(newValue ? newValue.id : null)}
                            renderInput={(params) => <TextField {...params} label="Chi nhánh" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} fullWidth label="Ngày bắt đầu" />}
                            value={startDate}
                            onChange={(newDate) => setStartDate(newDate)}
                            inputFormat="dd/MM/yyyy"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} fullWidth label="Ngày kết thúc" />}
                            value={endDate}
                            onChange={(newDate) => setEndDate(newDate)}
                            inputFormat="dd/MM/yyyy"
                        />
                    </Grid>
                </LocalizationProvider>

                <Grid item xs={12} md={3}>
                    <LoadingButton
                        sx={{ width: '100%', height: '100%' }}
                        loading={loading}
                        variant="contained"
                        color="primary"
                        onClick={handleCalculateRevenue}
                        fullWidth
                    >
                        Tính doanh thu
                    </LoadingButton>
                </Grid>
            </Grid>
            {/* Summary Statistics */}
            <Grid container spacing={3}>
                {[
                    { label: 'Tổng số sản phẩm', value: statistics.totalItems, icon: PRODUCT_ICON_URL },
                    { label: 'Tổng số đơn hàng', value: statistics.totalOrders, icon: SHOPPING_BAG_ICON_URL },
                    { label: 'Tổng số tài khoản', value: statistics.totalUsers, icon: USER_ICON_URL }
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{ padding: 2.5, display: 'flex', alignItems: 'center' }}>
                            <img src={stat.icon} alt={stat.label} style={{ width: 80, marginRight: 16 }} />
                            <Box>
                                <Typography variant="h3">{stat.label}</Typography>
                                <Typography mt={2} variant="h3">
                                    {stat.value}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                {[
                    { label: 'Doanh thu hôm nay', value: statistics.revenueToday, growth: statistics.growthVsYesterday },
                    { label: 'Doanh thu tháng này', value: statistics.revenueThisMonth, growth: statistics.growthVsLastMonth },
                    { label: 'Doanh thu năm nay', value: statistics.revenueThisYear, growth: statistics.growthVsLastYear }
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3} sx={{ padding: 2.5, display: 'flex', alignItems: 'center' }}>
                            <MonetizationOnIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2 }} />
                            <Box>
                                <Typography variant="h6">{stat.label}</Typography>
                                <Typography variant="h3" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    {formatCurrency(stat.value)}
                                </Typography>
                                <Typography color="textSecondary" display="flex" alignItems="center" sx={{ fontSize: '1.2rem', mt: 1 }}>
                                    {stat.growth >= 0 ? (
                                        <ArrowUpwardIcon color="success" fontSize="inherit" />
                                    ) : (
                                        <ArrowDownwardIcon color="error" fontSize="inherit" />
                                    )}
                                    &nbsp;{Math.abs(stat.growth)}%
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/* Revenue Line Chart */}
            <Box mt={3}>
                <Typography variant="h4">Doanh thu</Typography>
                <Box sx={{ height: 500 }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            </Box>
            <Box mt={3}>
                <Typography variant="h3">Top đồ uống bán chạy</Typography>
                <Grid container spacing={2} mt={2}>
                    {statistics.topSellingProducts.map((product) => (
                        <Grid item xs={12} md={4} key={product.itemId}>
                            <Paper
                                elevation={3}
                                sx={{ padding: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Typography variant="h6">{product.itemName}</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {product.totalSold} món
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default HDDanhSachStatistial;
