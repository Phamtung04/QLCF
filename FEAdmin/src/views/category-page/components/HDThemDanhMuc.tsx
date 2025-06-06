import React, { useState } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid } from '@mui/material';
import toastService from 'services/core/toast.service';
import categoryService from 'services/category-services/category.service';
import IcDrink from 'assets/images/soda.png';
import { LoadingButton } from '@mui/lab';
import { uploadToCloudinary } from 'utils/uploadImage'; // Import hàm upload ảnh lên Cloudinary

interface CategoryProps {
    rid: string;
    name: string;
    image: string; // Chuyển `image` thành `string`
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
}

const HDThemMoiDanhMuc: React.FC<Props> = ({ open, onClose, fetchData }) => {
    const [categoryInfo, setCategoryInfo] = useState<CategoryProps>({
        rid: '',
        name: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu trữ file ảnh đã chọn

    const handleClose = () => {
        setCategoryInfo({ rid: '', name: '', image: '' });
        setSelectedFile(null);
        onClose(false);
    };

    const handleChange = (name: string, value: any) => {
        setCategoryInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileSizeInMB = file.size / 1024 / 1024;

            if (fileSizeInMB > 0.5) {
                toastService.toast('info', 'Thông báo', 'Vui lòng chọn ảnh có dung lượng dưới 500Kb');
            } else {
                setSelectedFile(file); // Lưu file đã chọn vào `selectedFile`
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleChange('image', reader.result as string); // Xem trước ảnh bằng Base64
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (!categoryInfo.name || !selectedFile) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }
            setLoading(true);

            // Gọi API upload ảnh lên Cloudinary
            const uploadedImageUrl = await uploadToCloudinary(selectedFile);
            setCategoryInfo((prevInfo) => ({ ...prevInfo, image: uploadedImageUrl })); // Lưu URL vào image

            // Sau khi có URL ảnh, gọi API addCategory
            await categoryService.addCategory({ ...categoryInfo, image: uploadedImageUrl });
            toastService.toast('success', 'Thành công', 'Thêm danh mục thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi thêm danh mục!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5
                }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Thêm danh mục mới</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Tên danh mục"
                    name="name"
                    value={categoryInfo.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    {categoryInfo.image ? (
                        <img
                            src={categoryInfo.image}
                            alt="drink"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '20px' }}
                        />
                    ) : (
                        <img
                            src={IcDrink}
                            alt="drink"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '20px' }}
                        />
                    )}
                    <Button variant="contained" component="label" style={{ marginLeft: '8px' }}>
                        Ảnh danh mục
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                </div>
                <Typography mb={1} sx={{ color: 'red', fontSize: '12px', fontStyle: 'italic' }}>
                    Lưu ý: Ảnh danh mục có dung lượng dưới 500Kb!
                </Typography>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleClose}>
                            Hủy
                        </Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton onClick={handleSubmit} color="primary" variant="contained" loading={loading}>
                            Thêm
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default HDThemMoiDanhMuc;
