import React, { useState, useEffect, ChangeEvent } from 'react';
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
    branchId: number;
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
    selectedDrink: DrinkInfo;
    fetchData: () => Promise<void>;
    categories: Category[];
    listBranch: Branch[];
}

const HDEditDrink: React.FC<Props> = ({ open, onClose, selectedDrink, fetchData, categories, listBranch }) => {
    const [loading, setLoading] = useState(false);
    const [drinkInfo, setDrinkInfo] = useState<DrinkInfo>({ ...selectedDrink });
    const [previewImage, setPreviewImage] = useState<string>(selectedDrink.image || IcDrink);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        setDrinkInfo(selectedDrink);
        setPreviewImage(selectedDrink.image || IcDrink);
        setSelectedFile(null);
    }, [selectedDrink]);

    const handleClose = () => {
        onClose(false);
    };

    const handleChange = (name: string, value: any) => {
        setDrinkInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileSizeInMB = file.size / 1024 / 1024;

            if (fileSizeInMB > 0.5) {
                toastService.toast('info', 'Thông báo', 'Vui lòng chọn ảnh có dung lượng dưới 500Kb');
            } else {
                setSelectedFile(file);
                const imageUrl = URL.createObjectURL(file);
                setPreviewImage(imageUrl);
            }
        }
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        handleChange(name, checked);
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= 0) {
            handleChange('price', value);
        } else {
            toastService.toast('error', 'Lỗi', 'Giá tiền phải là số dương');
        }
    };

    const handleSubmit = async () => {
        if (!drinkInfo.name || !drinkInfo.description || !drinkInfo.categoryId || !drinkInfo.branchId || drinkInfo.price <= 0) {
            toastService.toast('warning', 'Cảnh báo', 'Nhập đầy đủ thông tin và đảm bảo giá tiền hợp lệ!');
            return;
        }

        try {
            setLoading(true);

            if (selectedFile) {
                const uploadedImageUrl = await uploadToCloudinary(selectedFile);
                handleChange('image', uploadedImageUrl);
            }

            await drinkService.editDrink(drinkInfo);
            toastService.toast('success', 'Thành công', 'Cập nhật đồ uống thành công!');
            handleClose();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toastService.toast('error', 'Lỗi', 'Đã có lỗi xảy ra khi cập nhật đồ uống!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontSize: '24px', textAlign: 'center' }}>Chỉnh sửa đồ uống</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Tên đồ uống"
                    name="name"
                    value={drinkInfo?.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Giá"
                    name="price"
                    type="number"
                    value={drinkInfo.price}
                    onChange={handlePriceChange}
                    InputProps={{ inputProps: { min: 0 } }}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <img
                        src={previewImage}
                        alt="drink"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '20px' }}
                    />
                    <Button variant="contained" component="label" style={{ marginLeft: '8px' }}>
                        Ảnh đồ uống
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
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
                    options={listBranch}
                    getOptionLabel={(option) => option.name}
                    value={listBranch.find((branch) => branch.id === drinkInfo.branchId) || null}
                    onChange={(e, newValue) => handleChange('branchId', newValue ? newValue.id : 0)}
                    renderInput={(params) => <TextField {...params} fullWidth label="Chi nhánh" margin="normal" />}
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
                    Cập nhật
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default HDEditDrink;
