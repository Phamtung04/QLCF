import axios from 'axios';

class DrinkService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllFilterCategory() {
        try {
            const serviceToken = this.getServiceToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const requestData = {};
            const result = await axios.post(`${this.apiName}/MenuItems/GetAllFilterMenuItems`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async getAllDrink({
        limit,
        page,
        rid,
        name,
        categoryId,
        branchId,
        isDisabled
    }: {
        limit: number;
        page: number;
        rid: string;
        name: string;
        categoryId: number;
        branchId: number;
        isDisabled: number;
    }) {
        try {
            const serviceToken = this.getServiceToken();
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
                name,
                categoryId,
                branchId,
                isDisabled
            };
            const result = await axios.post(`${this.apiName}/menuItems/GetAllMenuItems`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    addDrink = async (drinkInfo) => {
        try {
            const serviceToken = this.getServiceToken();
            const formData = new FormData();
            formData.append('categoryId', drinkInfo.categoryId);
            formData.append('name', drinkInfo.name);
            formData.append('description', drinkInfo.description);
            formData.append('image', drinkInfo.image);
            formData.append('isDisabled', drinkInfo.isDisabled);
            formData.append('buildingId', drinkInfo.buildingId);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const result = await axios.post(`${this.apiName}/MenuItems/InsOrUpdMenuItems`, formData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding drink: ' + error);
        }
    };

    editDrink = async (drinkInfo) => {
        try {
            const serviceToken = this.getServiceToken();
            const formData = new FormData();
            formData.append('rid', drinkInfo.rid);
            formData.append('categoryId', drinkInfo.categoryId);
            formData.append('buildingId', drinkInfo.buildingId);
            formData.append('name', drinkInfo.name);
            formData.append('description', drinkInfo.description);
            formData.append('image', drinkInfo.image);
            formData.append('isDisabled', drinkInfo.isDisabled);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const result = await axios.post(`${this.apiName}/MenuItems/InsOrUpdMenuItems`, formData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding drink: ' + error);
        }
    };

    async deleteDrink({ rid }: { rid: string }) {
        try {
            const serviceToken = this.getServiceToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid };

            const result = await axios.post(`${this.apiName}/MenuItems/DelMenuItems`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new DrinkService();
