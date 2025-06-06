import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useRef } from 'react';
import QRCode from 'react-qr-code';

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    table_id?: number; // Optional table_id for flexibility
    branch_id?: number; // Optional branch_id for flexibility
}

const ShowQrDialog = ({ open, onClose, table_id, branch_id }: Props) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        onClose(false);
    };

    const handlePrintQR = () => {
        if (qrCodeRef.current) {
            const qrCodeHtml = qrCodeRef.current.innerHTML;
            const printContent = `
                <html>
                    <head>
                        <title>Print</title>
                        <style>
                            @media print {
                                body {
                                    margin: 0;
                                    width: 100vw;
                                    height: 100vh;
                                }
                                .print-content {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        </style>
                    </head>
                    <body class="print-content">${qrCodeHtml}</body>
                </html>
            `;

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            document.body.appendChild(iframe);

            if (iframe.contentWindow) {
                const iframeDoc = iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(printContent);
                iframeDoc.close();

                iframe.contentWindow.print();

                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            } else {
                console.error('iframe.contentWindow is null');
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <div ref={qrCodeRef}>
                    <QRCode
                        value={
                            branch_id && table_id
                                ? `http://localhost:8000?table_id=${table_id}&branch_id=${branch_id}`
                                : 'http://localhost:8000'
                        }
                        size={256}
                        style={{ height: '150px', width: '150px', marginTop: '17px' }}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleClose} variant="contained" sx={{ mr: 2 }}>
                    Đóng
                </Button>
                <Button onClick={handlePrintQR} variant="contained" color="secondary">
                    In QR
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShowQrDialog;
