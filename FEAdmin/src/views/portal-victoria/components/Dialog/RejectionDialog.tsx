import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, Button, TextField } from '@mui/material';

interface RejectionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const reasons = ['Đồ uống đã hết', 'Khách đơn hàng hủy', 'Lý do khác'];

const RejectionDialog: React.FC<RejectionDialogProps> = ({ open, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = React.useState<string>(reasons[0]);
    const [customReason, setCustomReason] = React.useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
        if (event.target.value !== 'Lý do khác') {
            setCustomReason(''); // Reset custom reason if another reason is selected
        }
    };

    const handleCustomReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomReason(event.target.value);
    };

    const handleConfirm = () => {
        if (selectedReason === 'Lý do khác') {
            onConfirm(customReason || 'Lý do khác'); // Use custom reason if provided
        } else {
            onConfirm(selectedReason);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Chọn lý do từ chối</DialogTitle>
            <DialogContent>
                <RadioGroup value={selectedReason} onChange={handleChange}>
                    {reasons.map((reason) => (
                        <FormControlLabel key={reason} value={reason} control={<Radio />} label={reason} />
                    ))}
                </RadioGroup>
                {selectedReason === 'Lý do khác' && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nhập lý do khác"
                        type="text"
                        fullWidth
                        value={customReason}
                        onChange={handleCustomReasonChange}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleConfirm} color="primary">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectionDialog;
