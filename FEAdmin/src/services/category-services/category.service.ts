import axios from 'axios';

class CategoryService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllMenuCategories({ limit = 0, page = 0, rid = '', name = '' }: { limit: number; page: number; rid: string; name: string }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const requestData = {
                limit,
                page,
                rid,
                name
            };
            const result = await axios.post(`${this.apiName}/menuCategories/GetAllMenuCategories`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    addCategory = async (data: { name: string; image: string }) => {
        const serviceToken = this.getServiceToken();
        try {
            const requestData = {
                rid: '', // Thêm trường rid với giá trị chuỗi rỗng
                name: data.name,
                image: data.image // Assuming `image` is a base64 string or image URL
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const result = await axios.post(`${this.apiName}/menuCategories/InsOrUpdMenuCategorie`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
        }
    };

    editCategory = async (data: { name: string; image: string; rid: string }) => {
        const serviceToken = this.getServiceToken();
        try {
            const requestData = {
                name: data.name,
                image: data.image,
                rid: data.rid
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const result = await axios.post(`${this.apiName}/menuCategories/InsOrUpdMenuCategorie`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error editing data: ' + (error as Error).message);
        }
    };

    async deleteCategory({ rid }: { rid: string }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid };

            const result = await axios.post(`${this.apiName}/menuCategories/DelMenuCategories`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new CategoryService();
