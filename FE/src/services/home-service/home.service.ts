import axios from 'axios';

class HomeService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllFilterHome({ branchId }: { branchId: number }) {
        try {
            const serviceToken = this.getServiceToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };
            const requestData = { branchId };
            const result = await axios.post(`${this.apiName}/home/GetAllFilterHome`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }
}

export default new HomeService();
