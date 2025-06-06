import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Avatar } from '@mui/material';
import HDOrderStepper from './HDOrderStepper';
import HDTable, { ColumnProps } from 'components/HDTable';
import { formatCurrency } from 'utils/currencyFormatter';

interface Order {
    order_id: number;
    table_id: number;
    order_status: string;
    order_time: string;
    rid: string;
    description: string;
    table_name: string;
    order_note: string;
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

interface OrderDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    orderItems: OrderItem[];
    handleStepClick: (step: string, orderRid: string) => void;
}
const columns: ColumnProps[] = [
    {
        id: 'image',
        label: 'Hình ảnh',
        headerCellSX: { background: '#EAEEF2' },
        renderCell: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar src={`${row.image}`} alt={row.name} sx={{ width: 65, height: 65 }} />
            </Box>
        )
    },
    {
        id: 'item_name',
        label: 'Tên món',
        headerCellSX: { background: '#EAEEF2' }
    },
    {
        id: 'quantity',
        label: 'Số lượng',
        headerCellSX: { background: '#EAEEF2' }
    },
    {
        id: 'price',
        label: 'Đơn giá',
        headerCellSX: { background: '#EAEEF2' },
        renderCell: (row) => `${formatCurrency(row.price)}`
    },
    {
        id: 'total',
        label: 'Tổng cộng',
        headerCellSX: { background: '#EAEEF2' },
        renderCell: (row) => `${formatCurrency(row.price * row.quantity)}`
    },
    {
        id: 'note',
        label: 'Ghi chú',
        headerCellSX: { background: '#EAEEF2' }
    }
];

const HDOrderItemDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, order, orderItems, handleStepClick }) => {
    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogContent>
                <Box width="100%">
                    <Typography variant="subtitle1" gutterBottom>
                        Trạng thái đơn hàng:
                    </Typography>
                    <HDOrderStepper
                        initialStep={order.order_status}
                        orderRid={order.rid}
                        handleClick={handleStepClick}
                        rejectionReason={order.order_note}
                    />
                    <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Danh sách sản phẩm:
                        </Typography>
                        <HDTable
                            rows={orderItems.filter((item) => item.order_id === order.order_id)}
                            columns={columns}
                            isGlobalFilter={false}
                            hideHPagination
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="primary" variant="contained">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HDOrderItemDialog;
