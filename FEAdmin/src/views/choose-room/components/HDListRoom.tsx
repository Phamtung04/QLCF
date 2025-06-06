import React, { useState } from 'react';
import {
    Autocomplete,
    Box,
    Card,
    CardActionArea,
    Grid,
    TextField,
    Typography,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton
} from '@mui/material';
import tableService from 'services/table-service/table.service'; // Đổi từ roomService thành tableService
import { Close, EmojiFoodBeverageOutlined, TableRestaurantOutlined } from '@mui/icons-material'; // Thay đổi icon
import branchService from 'services/branch-services/branch.service'; // Đổi từ buildingService thành branchService
import useAuth from 'hooks/useAuth';
import PortalVictoriaPage from 'views/portal-victoria';
import { LoadingButton } from '@mui/lab';
import HDFilterMenu from './HDFilterMenu';

interface TableProp {
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

interface Branch {
    rid: string;
    name: string;
    description: string;
    id: number;
    branchId: number;
}

const HDListTable = () => {
    // Đổi từ HDListRoom thành HDListTable
    const theme = useTheme();
    const { user, userInfo } = useAuth();
    const [rows, setRows] = React.useState<TableProp[]>([]);
    const [listBranch, setListBranch] = React.useState<Branch[]>([]);
    const [pageNum, setPage] = React.useState(0);
    const [totalPage, setTotalPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(0);
    const [formData, setFormData] = React.useState<FormData>({
        limit: 0,
        page: 0,
        rid: '',
        name: '',
        branchId: 0,
        userID: userInfo?.id ?? 0
    });

    const [open, setOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableProp | null>(null);

    const handleChange = (name: string, value: string | number) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const fetchData = async () => {
        try {
            const response = await tableService.getAllTables(formData); // Đổi từ getAllRooms thành getAllTables
            if (response) {
                setRows(response.result);
                setTotalPage(response.total);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAllBranch = async () => {
        try {
            const response = await branchService.getAllBranches({ page: 0, limit: 0, name: '', rid: '', userID: userInfo?.id ?? 0 }); // Đổi từ getAllBuilding thành getAllBranch
            if (response) {
                setListBranch(response.result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [formData, open]);

    const handleTableClick = (table) => {
        setSelectedTable(table);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTable(null);
    };

    return (
        <>
            <Card sx={{ backgroundColor: '#f9f9f9', height: '100vh' }}>
                <Box p={2}>
                    <Grid my={2} container justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: 16 }} variant="h1">
                            Quản lý đơn hàng
                        </Typography>
                        <HDFilterMenu />
                    </Grid>

                    <Box>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2} px={2}>
                                <Grid item md={3} xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            borderRadius: '20%',
                                            backgroundColor: theme.palette.primary.main,
                                            width: 30,
                                            height: 30,
                                            my: 2
                                        }}
                                    />
                                    <Typography sx={{ fontSize: 16 }} variant="body1" my={2}>
                                        Đang có đơn hàng
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            borderRadius: '20%',
                                            backgroundColor: 'white',
                                            width: 30,
                                            height: 30,
                                            my: 2,
                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
                                        }}
                                    />
                                    <Typography sx={{ fontSize: 16 }} variant="body1" my={2}>
                                        Chưa có đơn hàng
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        {rows.map((row, index) => (
                            <Grid
                                item
                                xs={12}
                                md={4}
                                sm={6}
                                lg={3}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Card
                                    onClick={() => handleTableClick(row)} // Call handleTableClick with table information
                                    sx={{
                                        backgroundColor: row.status === 1 ? theme.palette.primary.main : 'white',
                                        width: '100%',
                                        borderRadius: '10px',
                                        color: row.status === 1 ? theme.palette.primary.light : 'inherit',
                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Light shadow for normal state
                                        transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for hover effect
                                        '&:hover': {
                                            transform: 'translateY(-5px)', // Slightly move the card up on hover
                                            boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)' // Stronger shadow on hover
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        sx={{
                                            borderRadius: 10,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start', // Align items at the start of the flex container
                                            alignItems: 'flex-start', // Align items at the start of the cross axis
                                            padding: 3,
                                            gap: 1
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: row.status === 1 ? theme.palette.primary.contrastText : 'inherit'
                                            }}
                                        >
                                            {row.branchName} - {row.name}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: row.status === 1 ? theme.palette.primary.contrastText : 'inherit'
                                                }}
                                            >
                                                {row.status === 1 ? `Đang có đơn hàng (${row.quantity})` : 'Chưa có đơn hàng'}
                                            </Typography>

                                            {row.status === 1 ? (
                                                <EmojiFoodBeverageOutlined
                                                    sx={{
                                                        color: theme.palette.primary.contrastText
                                                    }}
                                                />
                                            ) : (
                                                <TableRestaurantOutlined
                                                    sx={{
                                                        color: 'inherit'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                    <DialogTitle>Danh sách đơn hàng - {selectedTable?.name}</DialogTitle>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: 'white',
                            backgroundColor: '#f0f0f0',
                            '&:hover': {
                                backgroundColor: 'lightGrey'
                            },
                            borderRadius: '50%'
                        }}
                    >
                        <Close sx={{ color: 'gray' }} />
                    </IconButton>
                </Box>
                <DialogContent sx={{ flex: 1 }}>{selectedTable && <PortalVictoriaPage tableInfo={selectedTable} />}</DialogContent>
            </Dialog>
        </>
    );
};

export default HDListTable;
