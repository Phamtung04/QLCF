import axios from 'axios';

class NotiService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllNoti({ clientId, tableId, branchId, limit = 0, page = 0, statusClient = -1, rid =''}: { rid: string;clientId: string; tableId: number; branchId: number; limit: number; page: number; statusClient: number }) {
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
                rid,
                clientId,
                tableId,
                branchId,
                limit,
                page,
                statusClient
            };
            const result = await axios.post(`${this.apiName}/notifications/GetAllNotifications`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    editNoti = async ({ rid, statusClient }: { rid: string; statusClient: number }) => {
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
                rid,
                statusClient
            };
            const result = await axios.post(`${this.apiName}/notifications/UpNotifications`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
        }
    };
}

export default new NotiService();
