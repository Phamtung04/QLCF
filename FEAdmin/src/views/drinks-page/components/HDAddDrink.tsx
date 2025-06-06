import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Autocomplete
} from '@mui/material';
import toastService from 'services/core/toast.service';
import drinkService from 'services/drink-service/drink.service';
import { LoadingButton } from '@mui/lab';
import IcDrink from 'assets/images/soda.png';
import { uploadToCloudinary } from 'utils/uploadImage';

interface DrinkInfo {
    rid: string;
    categoryId: number;
    branchId: number; // Đổi từ brandId thành branchId
    name: string;
    price: number;
    description: string;
    image: string;
    disabled: boolean;
}

interface Category {
    id: number;
    name: string;
    image: string;
}

interface Branch {
    rid: string;
    name: string;
    description: string;
    id: number;
    branchId: number;
}

interface Props {
    open: boolean;
    onClose: (value: boolean) => void;
    fetchData: () => Promise<void>;
    categories: Category[];
    listBranch: Branch[]; // Đổi từ listBrand thành listBranch
}

const HDAddDrink: React.FC<Props> = ({ open, onClose, fetchData, categories, listBranch }) => {
    const [drinkInfo, setDrinkInfo] = useState<DrinkInfo>({
        rid: '',
        categoryId: 0,
        branchId: 0, // Đổi từ brandId thành branchId
        name: '',
        price: 0,
        description: '',
        image: '',
        disabled: false
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleClose = () => {
        onClose(false);
        setDrinkInfo({
            rid: '',
            categoryId: 0,
            branchId: 0, // Đổi từ brandId thành branchId
            name: '',
            price: 0,
            description: '',
            image: '',
            disabled: false
        });
        setSelectedFile(null);
    };

    const handleChange = (name: string, value: any) => {
        setDrinkInfo((prevInfo) => ({
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
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleChange('image', reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        handleChange(name as keyof DrinkInfo, checked);
    };

    const handleSubmit = async () => {
        try {
            if (!drinkInfo.name || !drinkInfo.description || !drinkInfo.categoryId || !drinkInfo.price || !selectedFile) {
                toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin!');
                return;
            }
            setLoading(true);

            // Upload ảnh lên Cloudinary và lấy URL
            const uploadedImageUrl = await uploadToCloudinary(selectedFile);
            setDrinkInfo((prevInfo) => ({ ...prevInfo, image: uploadedImageUrl }));

            // Sau khi có URL ảnh, gọi API thêm đồ uống
            await drinkService.addDrink({ ...drinkInfo, image: uploadedImageUrl });
            toastService.toast('success', 'Thành công', 'Thêm đồ uống thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi thêm đồ uống!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Thêm đồ uống mới</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Tên đồ uống"
                    name="name"
                    value={drinkInfo.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Giá"
                    name="price"
                    type="number"
                    value={drinkInfo.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                />
                <TextField
                    multiline
                    margin="normal"
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={drinkInfo.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={1.5}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {drinkInfo.image ? (
                        <img
                            src={drinkInfo.image}
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
                        Ảnh đồ uống
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                </div>
                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    value={categories.find((category) => category.id === drinkInfo.categoryId) || null}
                    onChange={(e, newValue) => handleChange('categoryId', newValue ? newValue.id : 0)}
                    renderInput={(params) => <TextField {...params} margin="normal" fullWidth label="Danh mục đồ uống" />}
                />
                <Autocomplete
                    options={listBranch} // Đổi listBrand thành listBranch
                    getOptionLabel={(option) => option.name}
                    value={listBranch.find((branch) => branch.id === drinkInfo.branchId) || null}
                    onChange={(e, newValue) => handleChange('branchId', newValue ? newValue.id : 0)} // Đổi brandId thành branchId
                    renderInput={(params) => <TextField {...params} label="Chi nhánh" margin="normal" />}
                />
                <FormControlLabel
                    control={<Checkbox checked={drinkInfo.disabled} onChange={handleCheckboxChange} name="disabled" />}
                    label="Hết món"
                />
                <Typography mt={1} sx={{ color: 'red', fontSize: '12px', fontStyle: 'italic' }}>
                    Lưu ý: Ảnh đồ uống có dung lượng dưới 500Kb!
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={handleClose} color="primary">
                    Hủy
                </Button>
                <LoadingButton onClick={handleSubmit} color="primary" variant="contained" loading={loading}>
                    Thêm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default HDAddDrink;
