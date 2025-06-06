import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Divider, Grid, Slide, ButtonBase } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Logo from 'assets/images/logo_mail.jpg';
import Success from 'assets/images/sucess.png';

interface CheckoutDialogProps {
    open: boolean;
    handleClose: () => void;
}

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SuccessDialog: React.FC<CheckoutDialogProps> = ({ open, handleClose }) => {
    return (
        <>
            <Dialog
                sx={{ top: '0%', height: 'calc(100%)', width: 'calc(91%)', borderRadius: '20px 20px 0 0' }}
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h2" component="div" mt={3} sx={{ fontWeight: 'bold' }}>
                            PVT EAUT
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <img src={Success} alt={'Success'} style={{ width: '100px', height: '100px' }} />
                        <Typography sx={{ fontWeight: '700', fontSize: '86px', color: '#292929' }}>Yeah!!!</Typography>
                        <Typography sx={{ fontWeight: '400', fontSize: '30px', color: '#292929' }}>
                            Đơn hàng của bạn đã đặt thành công.
                        </Typography>
                        <Typography sx={{ fontWeight: '400', fontSize: '30px', color: '#292929' }}>Vui lòng chờ lấy nước.</Typography>
                        <ButtonBase
                            onClick={handleClose}
                            sx={{
                                mt: 2,
                                borderRadius: '50px',
                                backgroundColor: '#FFD643',
                                color: '#464646',
                                width: '330px',
                                height: '56px',
                                p: '8px 16px',
                                '&:hover': {
                                    backgroundColor: '#FFD654'
                                }
                            }}
                        >
                            <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>Quay về menu</Typography>
                        </ButtonBase>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SuccessDialog;
