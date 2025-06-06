import React, { useState, ChangeEvent } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Autocomplete
} from '@mui/material';
import toastService from 'services/core/toast.service';
import userService from 'services/user-service/user.service';
import { LoadingButton } from '@mui/lab';
import HDCapNhatToaNha from './HDCapNhatToaNha';

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
    selectedUser: SelectedRowType;
    branches: Branch[]; // Updated to branches
}

interface User {
    rid: string;
    userName: string;
    permission: string;
    lockUp: boolean;
    branchId: number;
    email: string;
}

interface Branch {
    id: number;
    name: string;
}

interface SelectedRowType {
    rid: string;
    name: string;
    permission: string;
    lockUp: boolean;
    listBranchId: number;
    email: string;
}

const HDChinhSuaUser: React.FC<Props> = ({ open, onClose, fetchData, selectedUser, branches }) => {
    const handleClose = () => {
        onClose(false);
    };
    const [openModal, setOpenModal] = useState(false);
    const [userInfo, setUserInfo] = useState<User>({
        rid: selectedUser.rid,
        userName: selectedUser.name,
        permission: selectedUser.permission,
        lockUp: selectedUser.lockUp,
        branchId: Number(selectedUser.listBranchId), // Initialized from selectedUser.branchId
        email: selectedUser.email
    });
    console.log(userInfo);
    const [isBranchSelectorVisible, setIsBranchSelectorVisible] = useState(
        selectedUser.permission === 'BARTENDING' || selectedUser.permission === 'RECEPTIONIST'
    );

    const handleOpenUpdate = () => {
        setOpenModal(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setUserInfo((prevInfo) => {
            const updatedInfo = { ...prevInfo, [name]: newValue };
            setIsBranchSelectorVisible(updatedInfo.permission === 'BARTENDING' || updatedInfo.permission === 'RECEPTIONIST');
            return updatedInfo;
        });
    };

    const handleBranchChange = (event: any, newValue: Branch | null) => {
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            branchId: newValue ? newValue.id : 0
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!userInfo.rid || !userInfo.userName || !userInfo.permission || !userInfo.email) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }

            if ((userInfo.permission === 'RECEPTIONIST' || userInfo.permission === 'BARTENDING') && !userInfo.branchId) {
                toastService.toast('warning', 'Cảnh báo', 'Chọn chi nhánh!');
                return;
            }

            // Reset branchId to 0 if the user is ADMIN or SUPERADMIN
            if (userInfo.permission === 'ADMIN' || userInfo.permission === 'SUPERADMIN') {
                userInfo.branchId = 0;
            }

            const response = await userService.updateUser(userInfo);
            if (response.message === 'User_mis đã tồn tại!') {
                toastService.toast('error', 'Lỗi', 'User đăng nhập đã tồn tại!');
                return;
            }
            toastService.toast('success', 'Thành công', 'Chỉnh sửa tài khoản thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Chỉnh sửa tài khoản thất bại!');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Cập nhật tài khoản</Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form">
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Tên tài khoản"
                        name="userName"
                        value={userInfo.userName}
                        onChange={handleChange}
                    />

                    <TextField margin="normal" fullWidth label="Email" name="email" value={userInfo.email} onChange={handleChange} />
                    <Grid container>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" margin="normal">
                                <FormLabel component="legend">Phân quyền</FormLabel>
                                <RadioGroup aria-label="permission" name="permission" value={userInfo.permission} onChange={handleChange}>
                                    <FormControlLabel value="SUPERADMIN" control={<Radio />} label="Admin" />
                                    <FormControlLabel value="ADMIN" control={<Radio />} label="Quản lý" />
                                    <FormControlLabel value="RECEPTIONIST" control={<Radio />} label="Nhân viên" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {isBranchSelectorVisible && (
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={branches}
                                    getOptionLabel={(option) => option.name}
                                    value={branches.find((branch) => branch.id === userInfo.branchId) || null} // Use userInfo.branchId
                                    onChange={handleBranchChange}
                                    renderInput={(params) => <TextField {...params} label="Chọn chi nhánh" margin="normal" />}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={userInfo.lockUp} onChange={handleChange} name="lockUp" />}
                                label="Khóa tài khoản"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <HDCapNhatToaNha fetchAllData={fetchData} ridUser={selectedUser.rid} open={openModal} onClose={() => setOpenModal(false)} />
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleClose}>
                            Hủy
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleSubmit}>
                            Cập nhật
                        </Button>
                    </Grid>
                    {!isBranchSelectorVisible && (
                        <Grid item>
                            <LoadingButton variant="contained" disableElevation size="medium" onClick={handleOpenUpdate}>
                                Cập nhật chi nhánh quản lý
                            </LoadingButton>
                        </Grid>
                    )}
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default HDChinhSuaUser;
