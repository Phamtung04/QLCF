import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    IconButton,
    InputAdornment,
    Typography,
    Alert,
    Snackbar,
    Autocomplete,
    Paper,
    InputBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from 'hooks/useAuth';
import { Cancel, Search } from '@mui/icons-material';
import LocalMallOutlined from '@mui/icons-material/LocalMallOutlined';
import CustomSelect from 'components/CustomSelect';
import NotificationSection from 'layout/MainLayout/Header/NotificationSectionMobile';

interface Room {
    id: number;
    name: string;
    buildingId: number;
}
interface Building {
    name: string;
    id: number;
}
interface Props {
    keywork: string | null;
    setKeywork: React.Dispatch<React.SetStateAction<string | null>>;
    getSelectedRoom: any;
    setCartItemCount: any;
    cartItemCount: any;
    cartRef: React.RefObject<HTMLDivElement>;
    handleDialogOpen: any;
}

const HDFilterMenuMobile: React.FC<Props> = ({
    keywork,
    setKeywork,
    getSelectedRoom,
    cartItemCount,
    cartRef,
    handleDialogOpen,
    setCartItemCount
}) => {
    const { user } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleClearSearch = () => {
        setKeywork('');
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        // window.location.reload();
    };

    useEffect(() => {
        getSelectedRoom();
    }, []);

    return (
        <Box sx={{ px: 2, zIndex: 650 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#EAEEF2',
                        borderRadius: '42px',
                        my: 3,
                        mr: 1,
                        opacity: '75%'
                    }}
                    onChange={(e) => setKeywork((e.target as HTMLInputElement).value)}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Tìm kiếm"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={keywork || ''}
                        onChange={(e) => setKeywork(e.target.value)}
                    />
                    {keywork && (
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="clear search" onClick={handleClearSearch}>
                            <Cancel />
                        </IconButton>
                    )}
                    {!keywork && (
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    )}
                </Paper>
                <NotificationSection />
                <IconButton
                    sx={{
                        my: 1,
                        ml: 1,
                        color: '#464646',
                        backgroundColor: '#ffd643',
                        borderRadius: '50%',
                        p: 1.5,
                        '&:hover': {
                            backgroundColor: '#ffd643' // Bảo đảm rằng màu nền không thay đổi khi hover
                        },
                        '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem' // Tăng kích thước icon
                        }
                    }}
                    onClick={handleDialogOpen}
                >
                    <LocalMallOutlined />
                    {cartItemCount > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: '#D12421',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#FFFFFF',
                                fontSize: 13,
                                fontWeight: '500'
                            }}
                            ref={cartRef}
                        >
                            {cartItemCount}
                        </Box>
                    )}
                </IconButton>
            </Box>
        </Box>
    );
};

export default HDFilterMenuMobile;
