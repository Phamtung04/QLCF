import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography, Avatar, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // Import hook useNavigate
import IcDrink from 'assets/images/hero2.jpg';

type CustomDateTimeFormatOptions = {
    weekday: 'long' | 'short' | 'narrow';
    year: 'numeric' | '2-digit';
    month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
};
interface Props {
    keywork: string | null;
    setKeywork: React.Dispatch<React.SetStateAction<string | null>>;
}

const HDFilterMenu: React.FC<Props> = ({ keywork, setKeywork }) => {
    const { userInfo } = useAuth();
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywork(event.target.value);
    };

    const handleClearSearch = () => {
        setKeywork('');
    };

    const handleBack = () => {
        // Navigate về '/react-order/rooms' khi click vào biểu tượng mũi tên back
        navigate('/order/rooms');
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const options: CustomDateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentTime.toLocaleDateString('vi-VN', options);
    const formattedTime = currentTime.toLocaleTimeString();

    return (
        <Box display="flex" alignItems="center" mb={1.5}>
            {/* <Box display="flex" alignItems="center">
                <Tooltip title="Quay lại">
                    <Box borderRadius={'50%'} mr={3}>
                        <IconButton onClick={handleBack}>
                            <ArrowBackIosNewOutlinedIcon />
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box> */}

            {/* <Box flexGrow={2}>
                <TextField
                    fullWidth
                    label="Tìm kiếm"
                    placeholder="Tìm kiếm"
                    value={keywork || ''}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {keywork ? (
                                    <IconButton onClick={handleClearSearch}>
                                        <CloseIcon />
                                    </IconButton>
                                ) : (
                                    <SearchIcon />
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </Box> */}
            <Box
                flexGrow={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    textAlign: 'right' // Thêm textAlign vào đây để căn phải
                }}
            >
                <Box sx={{ mr: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                        {userInfo?.permission === 'RECEPTIONIST' ? 'Thu ngân - ' + userInfo.name : 'Pha chế - ' + userInfo?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: '400', fontSize: '13px' }}>
                            {formattedDate}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: '400', fontSize: '13px', width: '80px' }}>
                            {formattedTime}
                        </Typography>
                    </Box>
                </Box>
                <Avatar src={IcDrink} />
            </Box>
        </Box>
    );
};

export default HDFilterMenu;
