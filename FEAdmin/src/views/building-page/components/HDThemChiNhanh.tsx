import React, { useState } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid } from '@mui/material';
import toastService from 'services/core/toast.service';
import branchService from 'services/branch-services/branch.service';

interface BranchInfo {
    rid: string;
    name: string;
    description: string;
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
}

const HDThemChiNhanh: React.FC<Props> = ({ open, onClose, fetchData }) => {
    const [branchInfo, setBranchInfo] = useState<BranchInfo>({
        rid: '',
        name: '',
        description: ''
    });

    const handleClose = () => {
        onClose(false);
        setBranchInfo({
            rid: '',
            name: '',
            description: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBranchInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!branchInfo.name) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }

            await branchService.addBranch(branchInfo);
            toastService.toast('success', 'Thành công', 'Thêm chi nhánh thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi thêm chi nhánh!');
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
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Thêm mới chi nhánh</Typography>
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
                        <Button variant="contained" onClick={handleSubmit}>
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default HDThemChiNhanh;
