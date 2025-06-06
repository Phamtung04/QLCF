import axios from 'axios';
import React from 'react';

class HomeService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllFilterHome({ id, buildingId }: { id: number; buildingId: number }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const requestData = { id, buildingId };
            const result = await axios.post(`${this.apiName}/Home/GetAllFilterHome`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }
}

export default new HomeService();
