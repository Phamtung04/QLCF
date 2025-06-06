import axios from 'axios';
import React from 'react';

class BranchService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllBranches({ limit, page, rid, name, userID }: { limit: number; page: number; rid: string; name: string; userID: number }) {
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
            const result = await axios.post(`${this.apiName}/branches/GetAllBranches`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async addBranch({ rid, name, description }: { rid: string; name: string; description: string }) {
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

            const result = await axios.post(`${this.apiName}/branches/InsOrUpdBranches`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
        }
    }

    async deleteBranch({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/branches/DelBranches`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting data: ' + (error as Error).message);
        }
    }
}

export default new BranchService();
