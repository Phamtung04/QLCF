import HDTable, { ColumnProps } from 'components/HDTable';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import _ from 'lodash';
import toastService from 'services/core/toast.service';
import HDTablePagination from 'components/HDTablePagination';
import userService from 'services/user-service/user.service';

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    ridUser: string;
    fetchAllData: any;
}

interface ToaNha {
    id: number;
    name: string;
    status: number;
}

const HDCapNhatToaNha = ({ open, onClose, ridUser, fetchAllData }: Props) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [rows, setRows] = useState<ToaNha[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const response = await userService.getAllUserBranch({ limit: 0, page: 0, rid: ridUser });
            if (response) {
                const data = response.result;
                setRows(data);

                // Filter rows with status = 1 and set them as selected
                const selected = data.filter((item: ToaNha) => item.status === 1).map((item: ToaNha) => item.id);
                setSelectedRows(selected);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ridUser]);

    const handleSubmit = async () => {
        try {
            const iDString = selectedRows.join(',');
            const response = await userService.updateManageBranch({ rid: ridUser, listBranch: iDString });
            if (response) {
                toastService.toast('success', 'Thành công', 'Cập nhật thông tin thành công!');
                handleClose();
                fetchAllData();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRowCheckboxChange = (rowId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        let updatedRows = [...selectedRows];

        if (checked) {
            updatedRows.push(rowId);
        } else {
            updatedRows = updatedRows.filter((selectedRowId) => selectedRowId !== rowId);
        }

        setSelectedRows(updatedRows);
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        if (checked) {
            const allRowIds = rows.map((row) => row.id);
            setSelectedRows(allRowIds);
        } else {
            setSelectedRows([]);
        }
    };

    const handleClose = () => {
        onClose(false);
    };

    const columns: ColumnProps[] = [
        {
            id: 'status',
            label: <Checkbox checked={selectedRows.length === rows.length && rows.length > 0} onChange={handleSelectAllChange} />,
            headerCellSX: { background: '#EAEEF2' },
            cellSX: { width: '50px' },
            renderCell: (item: ToaNha) => (
                <Checkbox checked={selectedRows.includes(item.id)} onChange={(event) => handleRowCheckboxChange(item.id, event)} />
            )
        },
        {
            id: 'name',
            label: 'Chi nhánh',
            headerCellSX: { background: '#EAEEF2' }
        }
    ];

    return (
        <Dialog scroll="body" open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Cập nhật chi nhánh quản lý</Typography>
            </DialogTitle>
            <DialogContent>
                <HDTablePagination loading={loadingData} rows={rows} columns={columns} border isGlobalFilter />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="outlined" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HDCapNhatToaNha;
