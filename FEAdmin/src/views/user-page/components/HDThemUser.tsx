import React, { useState } from 'react';
import {
    Button,
    Dialog,
    TextField,
    Box,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Autocomplete,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import toastService from 'services/core/toast.service';
import userService from 'services/user-service/user.service';

interface User {
    rid: string;
    userName: string;
    permission: string;
    lockUp: boolean;
    branchId: number; // Updated to number type
    email: string;
    password: string;
}

interface Branch {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
    branches: Branch[];
}

const HDThemUser: React.FC<Props> = ({ open, onClose, fetchData, branches }) => {
    const [userInfo, setUserInfo] = useState<User>({
        rid: '',
        userName: '',
        permission: '',
        lockUp: false,
        branchId: 0, // Changed to number
        email: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [isBranchSelectorVisible, setIsBranchSelectorVisible] = useState(false);

    const handleClose = () => {
        onClose(false);
        setUserInfo({
            rid: '',
            userName: '',
            permission: '',
            lockUp: false,
            branchId: 0,
            email: '',
            password: ''
        });
        setConfirmPassword('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!userInfo.userName || !userInfo.permission || !userInfo.email || !userInfo.password) {
            toastService.toast('warning', 'Cảnh báo', 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (userInfo.password !== confirmPassword) {
            toastService.toast('error', 'Lỗi', 'Mật khẩu xác nhận không khớp!');
            return;
        }

        if ((userInfo.permission === 'RECEPTIONIST' || userInfo.permission === 'BARTENDING') && !userInfo.branchId) {
            toastService.toast('warning', 'Cảnh báo', 'Vui lòng chọn chi nhánh!');
            return;
        }

        try {
            const response = await userService.addUser(userInfo);
            if (response.message === 'User_mis đã tồn tại!') {
                toastService.toast('error', 'Lỗi', 'User đăng nhập đã tồn tại!');
                return;
            }
            toastService.toast('success', 'Thành công', 'Thêm tài khoản thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Thêm tài khoản thất bại!');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Thêm mới tài khoản</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Tên tài khoản"
                    name="userName"
                    value={userInfo.userName}
                    onChange={handleChange}
                />
                <TextField margin="normal" fullWidth label="Email" name="email" value={userInfo.email} onChange={handleChange} />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Xác nhận mật khẩu"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
                            Thêm
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default HDThemUser;
