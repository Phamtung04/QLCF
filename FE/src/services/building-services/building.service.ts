import axios from 'axios';
import React from 'react';

class BuildingService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllBuilding({ limit, page, rid, name, userID }: { limit: number; page: number; rid: string; name: string; userID: number }) {
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
                userID
            };
            const result = await axios.post(`${this.apiName}/Buildings/GetAllBuildings`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async addBuilding({ rid, name, description }: { rid: string; name: string; description: string }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid, name, description };

            const result = await axios.post(`${this.apiName}/Buildings/InsOrUpdBuildings`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
        }
    }

    async deleteBuilding({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/Buildings/DelBuildings`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new BuildingService();
