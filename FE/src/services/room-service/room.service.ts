import axios from 'axios';

class RoomService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllRooms({ limit, page, rid, name }: { limit: number; page: number; rid: string; name: string }) {
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
                name
            };
            const result = await axios.post(`${this.apiName}/Rooms/GetAllRooms`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async addRoom({ rid, name, description }: { rid: string; name: string; description: string }) {
        try {
            const serviceToken = this.getServiceToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid, name, description };

            const result = await axios.post(`${this.apiName}/Rooms/InsOrUpdRooms`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding room: ' + (error as Error).message);
        }
    }

    async deleteRoom({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/Rooms/DelRooms`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting room: ' + (error as Error).message);
        }
    }
}

export default new RoomService();
