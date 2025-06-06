import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, Box, Typography, Grid } from '@mui/material';
import toastService from 'services/core/toast.service';
import IcDrink from 'assets/images/soda.png';
import { LoadingButton } from '@mui/lab';
import categoryService from 'services/category-services/category.service';
import { uploadToCloudinary } from 'utils/uploadImage';

interface CategoryProps {
    rid: string;
    name: string;
    image: string;
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    selectedValue: CategoryProps;
    fetchData: () => Promise<void>;
}

const HDChinhSuaDanhMuc: React.FC<Props> = ({ open, onClose, selectedValue, fetchData }) => {
    const [categoryInfo, setCategoryInfo] = useState(selectedValue);
    const [loading, setLoading] = useState(false);
    const [imageUpdated, setImageUpdated] = useState(false); // Track if image has been updated
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store selected image file

    useEffect(() => {
        setCategoryInfo(selectedValue);
        setImageUpdated(false); // Reset image update state when the modal is reopened
        setSelectedFile(null); // Reset selected file
    }, [selectedValue]);

    const handleClose = () => {
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
                setImageUpdated(true);
                setSelectedFile(file); // Save selected file for upload
                handleChange('image', URL.createObjectURL(file)); // Update preview with selected file
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (!categoryInfo.name) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }

            setLoading(true);

            // Nếu ảnh đã được cập nhật, upload lên Cloudinary trước
            let imageUrl = categoryInfo.image;
            if (imageUpdated && selectedFile) {
                imageUrl = await uploadToCloudinary(selectedFile);
                setCategoryInfo((prevInfo) => ({ ...prevInfo, image: imageUrl }));
            }

            // Gọi API cập nhật danh mục
            await categoryService.editCategory({ ...categoryInfo, image: imageUrl });
            toastService.toast('success', 'Thành công', 'Cập nhật danh mục thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật danh mục!');
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
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Cập nhật danh mục</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Tên danh mục"
                    name="name"
                    value={categoryInfo?.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    {categoryInfo.image ? (
                        <img
                            src={
                                typeof categoryInfo.image === 'string'
                                    ? categoryInfo.image // URL image from Cloudinary or Base64
                                    : URL.createObjectURL(categoryInfo.image)
                            }
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
                            Cập nhật
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default HDChinhSuaDanhMuc;
