import React, { useState, ChangeEvent } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid } from '@mui/material';
import toastService from 'services/core/toast.service';
import branchService from 'services/branch-services/branch.service';

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    rid: string;
    name: string;
    description: string;
    fetchData: () => Promise<void>;
}

interface BranchInfo {
    rid: string;
    name: string;
    description: string;
}

const HDChinhSuaChiNhanh: React.FC<Props> = ({ open, onClose, rid: initRid, name: initName, fetchData, description: initDescription }) => {
    const handleClose = () => {
        onClose(false);
    };

    const [branchInfo, setBranchInfo] = useState<BranchInfo>({
        rid: initRid,
        name: initName,
        description: initDescription
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name: nameChange, value } = e.target;
        setBranchInfo((prevInfo) => ({
            ...prevInfo,
            [nameChange]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!branchInfo.rid || !branchInfo.name) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }
            await branchService.addBranch(branchInfo);
            toastService.toast('success', 'Thành công', 'Cập nhật thông tin chi nhánh thành công!');
            onClose(false);
            fetchData();
        } catch (error) {
            console.error('Error updating branch:', error);
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
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Cập nhật chi nhánh</Typography>
                <TextField margin="normal" fullWidth label="Tên chi nhánh" name="name" value={branchInfo.name} onChange={handleChange} />
                <TextField
                    margin="normal"
                    multiline
                    rows={2}
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={branchInfo.description}
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

export default HDChinhSuaChiNhanh;
