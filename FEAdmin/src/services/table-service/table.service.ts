import axios from 'axios';

class TableService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllTables({
        limit,
        page,
        rid,
        name,
        branchId,
        userID
    }: {
        limit: number;
        page: number;
        rid: string;
        name: string;
        branchId: number;
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
                branchId,
                userID
            };
            const result = await axios.post(`${this.apiName}/tables/GetAllTables`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching tables: ' + (error as Error).message);
        }
    }

    async addTable({ rid, name, description, branchId }: { rid: string; name: string; description: string; branchId: number }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid, name, description, branchId };

            const result = await axios.post(`${this.apiName}/tables/InsOrUpdTables`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding table: ' + (error as Error).message);
        }
    }

    async deleteTable({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/tables/DelTables`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting table: ' + (error as Error).message);
        }
    }
}

export default new TableService();
