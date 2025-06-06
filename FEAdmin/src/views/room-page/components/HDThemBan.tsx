import React, { useState } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid, Autocomplete } from '@mui/material';
import toastService from 'services/core/toast.service';
import tableService from 'services/table-service/table.service';

interface TableInfo {
    rid: string;
    name: string;
    description: string;
    branchId: number;
}

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

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
    listBranch: SelectedRowType[]; // Changed to listBranch
}

const HDThemBan: React.FC<Props> = ({ open, onClose, fetchData, listBranch }) => {
    // Changed listBuilding to listBranch
    const [tableInfo, setTableInfo] = useState<TableInfo>({
        rid: '',
        name: '',
        description: '',
        branchId: 0
    });

    const handleClose = () => {
        onClose(false);
        setTableInfo({
            rid: '',
            name: '',
            description: '',
            branchId: 0
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setTableInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!tableInfo.name) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }

            await tableService.addTable(tableInfo);
            toastService.toast('success', 'Thành công', 'Thêm bàn thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi thêm bàn!');
        }
    };

    const handleAutocompleteChange = (event: any, newValue: SelectedRowType | null) => {
        setTableInfo((prevInfo) => ({
            ...prevInfo,
            branchId: newValue ? newValue.id : 0
        }));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Thêm mới bàn</Typography>
                <TextField margin="normal" fullWidth label="Tên bàn" name="name" value={tableInfo.name} onChange={handleChange} />
                <Autocomplete
                    fullWidth
                    options={listBranch} // Updated to use listBranch
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Chi nhánh" margin="normal" />}
                    onChange={handleAutocompleteChange}
                />
                <TextField
                    margin="normal"
                    multiline
                    rows={2}
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={tableInfo.description}
                    onChange={handleChange}
                />
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleClose}>
                            Hủy
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleSubmit}>
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default HDThemBan;
