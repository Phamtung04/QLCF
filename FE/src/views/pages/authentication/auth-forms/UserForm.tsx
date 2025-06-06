import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useNavigate } from 'react-router-dom';
import { dispatch } from 'store';
import homeService from 'services/home-service/home.service';

interface UserInfo {
    name: string;
    room: number;
    role: string;
}
interface Room {
    id: number;
    name: string;
}
const UserForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [listRooms, setListRoom] = useState<Room[]>([]);
    const [formValues, setFormValues] = useState<UserInfo>({
        name: '',
        room: 0,
        role: 'CLIENT'
    });
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const fetchData = async () => {
        try {
            const response = await homeService.getAllFilterHome({ branchId: 0 });
            if (response) {
                setListRoom(response.result.listTable);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        fetchData();
        localStorage.removeItem('userForm');
    }, []);

    const handleAutocompleteChange = (event: React.SyntheticEvent, value: { id: number; name: string } | null) => {
        setFormValues({
            ...formValues,
            room: value ? value.id : 0
        });
    };

    const handleSubmit = async () => {
        if (!formValues.room) {
            setSubmitError('Vui lòng chọn bàn');
            return;
        }

        try {
            setLoading(true);
            localStorage.setItem('userForm', JSON.stringify(formValues));
            setLoading(false);
            navigate('/portal-victoria');
        } catch (error) {
            setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    return (
        <form noValidate autoComplete="off">
            {submitError && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity="error">{submitError}</Alert>
                </Box>
            )}
            {/* <Box sx={{ mb: 2 }}>
                <TextField fullWidth label="Họ tên" name="name" onChange={handleChange} value={formValues.name} color="secondary" />
            </Box> */}
            <Box sx={{ mb: 2 }}>
                <Autocomplete
                    options={listRooms}
                    getOptionLabel={(option) => option.name}
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => <TextField {...params} label="Phòng họp" color="secondary" />}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <AnimateButton>
                    <LoadingButton
                        disableElevation
                        fullWidth
                        size="large"
                        type="button"
                        variant="contained"
                        color="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        Tiếp tục
                    </LoadingButton>
                </AnimateButton>
            </Box>
        </form>
    );
};

export default UserForm;
