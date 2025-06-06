import React from 'react';
import { Stepper, Step, StepLabel, styled, Button, Typography, Box } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import toastService from 'services/core/toast.service';

interface OrderStepperProps {
    initialStep: string;
    orderRid: string;
    handleClick: (step: string, rid: string) => void;
    rejectionReason?: string;
}

const steps = [
    { label: 'Chờ xác nhận', icon: <VerifiedIcon /> },
    { label: 'Xác nhận', icon: <LocalShippingIcon /> },
    { label: 'Đã hoàn thành', icon: <CheckCircleIcon /> }
];

const CustomStepIcon = styled(Button)<{
    active?: boolean;
    completed?: boolean;
    matched?: boolean;
}>(({ theme, active, completed, matched }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: completed ? theme.palette.success.main : matched || active ? theme.palette.primary.main : theme.palette.grey[400],
    '& .MuiSvgIcon-root': {
        fontSize: active ? 30 : 24,
        transition: '0.3s'
    },
    minWidth: 0,
    padding: theme.spacing(1)
}));

const HDOrderStepper: React.FC<OrderStepperProps> = ({ initialStep, orderRid, handleClick, rejectionReason }) => {
    const cleanInitialStep = initialStep.toLowerCase().replace(/[\W_]+/g, '');
    const initialStepIndex = steps.findIndex((step) => {
        const cleanStepLabel = step.label.toLowerCase().replace(/[\W_]+/g, '');
        return cleanStepLabel === cleanInitialStep;
    });
    const [activeStep, setActiveStep] = React.useState(initialStepIndex);

    const handleAlert = () => {
        toastService.toast('info', 'Thông báo', 'Bạn không thể thay đổi trạng thái!');
    };

    const handleStepClick = (step: string, index: number) => {
        if (initialStep === 'Đã hoàn thành' || initialStep === 'Từ chối') {
            handleAlert();
        } else if (index > activeStep) {
            setActiveStep(index); // Update the active step state
            handleClick(step, orderRid);
        } else {
            handleAlert();
        }
    };

    return (
        <>
            {initialStep === 'Từ chối' ? (
                <>
                    {/* <Box mt={2} p={2} bgcolor="error.main" color="error.contrastText" borderRadius={2}>
                        <Typography variant="body1">Đơn hàng đã bị từ chối</Typography>
                        {rejectionReason && <Typography variant="body1">Lý do: {rejectionReason}</Typography>}
                    </Box> */}
                    {/* Add icon and hide "Trạng thái đơn hàng" */}
                    <Box mt={2} p={2} display="flex" alignItems="center">
                        <ErrorIcon color="error" />
                        <Typography variant="subtitle1" ml={1}>
                            Đơn hàng đã bị từ chối - Lý do: {rejectionReason}
                        </Typography>
                    </Box>
                </>
            ) : (
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel
                                StepIconComponent={(props) => (
                                    <CustomStepIcon
                                        active={props.active}
                                        completed={index <= activeStep}
                                        matched={index === activeStep}
                                        onClick={() => handleStepClick(step.label, index)}
                                    >
                                        {step.icon}
                                    </CustomStepIcon>
                                )}
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}
        </>
    );
};

export default HDOrderStepper;
