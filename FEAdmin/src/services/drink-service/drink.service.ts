import axios from 'axios';
import React from 'react';

class DrinkService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllFilterCategory({ id }: { id: number }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const requestData = { id };
            const result = await axios.post(`${this.apiName}/menuItems/GetAllFilterMenuItems`, requestData, config);

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
        isDisabled,
        userID
    }: {
        limit: number;
        page: number;
        rid: string;
        name: string;
        categoryId: number;
        branchId: number;
        isDisabled: number;
        userID: number;
    }) {
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
                name,
                categoryId,
                branchId,
                isDisabled,
                userID
            };
            const result = await axios.post(`${this.apiName}/menuItems/GetAllMenuItems`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    addDrink = async (drinkInfo: {
        categoryId: number;
        name: string;
        description: string;
        image: string; // Assuming `image` is a base64 string or image URL
        disabled: boolean;
        branchId: number;
        price: number;
    }) => {
        const serviceToken = this.getServiceToken();
        try {
            const requestData = {
                rid: '',
                categoryId: drinkInfo.categoryId,
                name: drinkInfo.name,
                description: drinkInfo.description,
                image: drinkInfo.image,
                disabled: drinkInfo.disabled,
                branchId: drinkInfo.branchId,
                price: drinkInfo.price
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const result = await axios.post(`${this.apiName}/menuItems/InsOrUpdMenuItems`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error adding drink: ' + (error as Error).message);
        }
    };

    editDrink = async (drinkInfo: {
        categoryId: number;
        name: string;
        description: string;
        image: string; // Assuming `image` is a base64 string or image URL
        disabled: boolean;
        branchId: number;
        price: number;
        rid: string;
    }) => {
        const serviceToken = this.getServiceToken();
        try {
            const requestData = {
                rid: drinkInfo.rid,
                categoryId: drinkInfo.categoryId,
                branchId: drinkInfo.branchId,
                name: drinkInfo.name,
                description: drinkInfo.description,
                image: drinkInfo.image,
                disabled: drinkInfo.disabled,
                price: drinkInfo.price
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const result = await axios.post(`${this.apiName}/menuItems/InsOrUpdMenuItems`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error editing drink: ' + (error as Error).message);
        }
    };

    async deleteDrink({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/menuItems/DelMenuItems`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new DrinkService();
