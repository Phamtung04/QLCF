import axios from 'axios';

// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET as string); // Lấy từ biến môi trường
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME as string); // Lấy từ biến môi trường

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.url; // Trả về URL của ảnh sau khi upload
    } catch (error) {
        throw new Error('Lỗi khi tải ảnh lên Cloudinary');
    }
};
