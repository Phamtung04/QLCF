import axios from 'axios';
import React from 'react';

class NotiService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllNoti({ limit = 0, page = 0, statusAdmin = -1, userId = 0, clientId = '', rid = '' }: { limit: number; page: number; statusAdmin: number; userId:number; clientId: String; rid: String }) {
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
                statusAdmin,
                userId,
                clientId,
                rid
            };
            const result = await axios.post(`${this.apiName}/notifications/GetAllNotifications`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    editNoti = async ({ rid, statusAdmin }: { rid: string; statusAdmin: number }) => {
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
                rid,
                statusAdmin
            };
            const result = await axios.post(`${this.apiName}/notifications/UpNotifications`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
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

            const result = await axios.post(`${this.apiName}/notifications/DelMenuCategories`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new NotiService();
