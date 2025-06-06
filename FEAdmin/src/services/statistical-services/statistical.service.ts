import axios from 'axios';

class StatisticalService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    // Method to fetch statistics data
    async getStatistics({ startDate, endDate, branchId }: { startDate: string; endDate: string; branchId: number }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${serviceToken}`
                }
            };

            const requestData = {
                startDate,
                endDate,
                branchId
            };

            const result = await axios.post(`${this.apiName}/statistics/get`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching statistics data: ' + (error as Error).message);
        }
    }
}

export default new StatisticalService();
