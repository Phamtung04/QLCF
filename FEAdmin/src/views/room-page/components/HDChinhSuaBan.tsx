import React, { useState, ChangeEvent } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid, Autocomplete } from '@mui/material';
import toastService from 'services/core/toast.service';
import tableService from 'services/table-service/table.service';

interface SelectedRowType {
    rid: string;
    name: string;
    description: string;
    id: number;
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    rid: string;
    name: string;
    description: string;
    branchId: number; // Changed from buildingId to branchId
    fetchData: () => Promise<void>;
    listBranch: SelectedRowType[]; // Updated to listBranch
}

const HDChinhSuaBan: React.FC<Props> = ({
    open,
    onClose,
    rid: initRid,
    name: initName,
    fetchData,
    description: initDescription,
    branchId: initBranchId, // Changed to branchId
    listBranch // Updated to listBranch
}) => {
    const handleClose = () => {
        onClose(false);
    };

    const [tableInfo, setTableInfo] = useState({
        rid: initRid,
        name: initName,
        description: initDescription,
        branchId: initBranchId // Using branchId here
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name: nameChange, value } = e.target;

        setTableInfo((prevInfo) => ({
            ...prevInfo,
            [nameChange]: value
        }));
    };

    const handleAutocompleteChange = (event: any, newValue: SelectedRowType | null) => {
        setTableInfo((prevInfo) => ({
            ...prevInfo,
            branchId: newValue ? newValue.id : 0 // Changed to branchId
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!tableInfo.rid || !tableInfo.name) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }

            await tableService.addTable(tableInfo); // Changed to tableService
            toastService.toast('success', 'Thành công', 'Cập nhật thông tin thành công!');
            onClose(false);
            fetchData();
        } catch (error) {
            console.error('Error updating table info:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật thông tin!');
        }
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
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Cập nhật bàn</Typography>
                <TextField margin="normal" fullWidth label="Tên bàn" name="name" value={tableInfo.name} onChange={handleChange} />
                <Autocomplete
                    fullWidth
                    options={listBranch} // Updated to use listBranch
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Chi nhánh" margin="normal" />}
                    onChange={handleAutocompleteChange}
                    value={listBranch.find((branch) => branch.id === tableInfo.branchId) || null} // Updated to branchId
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
                        <Button onClick={handleSubmit} variant="contained">
                            Cập nhật
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default HDChinhSuaBan;
