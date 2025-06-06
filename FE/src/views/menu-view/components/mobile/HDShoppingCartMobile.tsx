import React from 'react';
import { Box, IconButton, Avatar } from '@mui/material';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import IcAvatar from 'assets/images/avatar.jpg';
import NotificationSection from 'layout/MainLayout/Header/NotificationSection';

interface Props {
    cartItemCount: any;
    setCartItemCount: any;
    handleDialogOpen: any;
    cartRef: React.RefObject<HTMLDivElement>;
}
const HDShoppingCartMobile: React.FC<Props> = ({ cartItemCount, setCartItemCount, handleDialogOpen, cartRef }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#464646',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
            }}
        >
            <IconButton
                sx={{
                    my: 1,
                    borderRadius: '50%',
                    '& .MuiSvgIcon-root': {
                        fontSize: '2.1rem' // Tăng kích thước icon
                    }
                }}
            >
                <Avatar
                    src={IcAvatar}
                    sx={{
                        width: '3.5rem',
                        height: '3.5rem',
                        bgcolor: '#ffd643',
                        color: '#464646'
                    }}
                />
            </IconButton>
            <NotificationSection />
            <IconButton
                sx={{
                    my: 1,
                    color: '#ffd643',
                    backgroundColor: '#464646',
                    borderRadius: '50%',
                    p: 1.5,
                    transition: 'background-color 0.3s, color 0.3s',
                    '&:hover': {
                        color: '#464646',
                        backgroundColor: '#ffd643'
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '2.1rem' // Tăng kích thước icon
                    }
                }}
                onClick={handleDialogOpen}
            >
                <LocalMallOutlinedIcon />
                {cartItemCount > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: '#D12421',
                            width: 25,
                            height: 25,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#FFFFFF',
                            fontSize: 15,
                            fontWeight: '500'
                        }}
                        ref={cartRef}
                    >
                        {cartItemCount}
                    </Box>
                )}
            </IconButton>
        </Box>
    );
};

export default HDShoppingCartMobile;
