import axios from 'axios';

class RoomService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllRooms({
        limit,
        page,
        rid,
        name,
        buildingId,
        userID
    }: {
        limit: number;
        page: number;
        rid: string;
        name: string;
        buildingId: number;
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
                buildingId,
                userID
            };
            const result = await axios.post(`${this.apiName}/Rooms/GetAllRooms`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async addRoom({ rid, name, description, buildingId }: { rid: string; name: string; description: string; buildingId: number }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + serviceToken
                }
            };

            const requestData = { rid, name, description, buildingId };

            const result = await axios.post(`${this.apiName}/Rooms/InsOrUpdRooms`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding room: ' + (error as Error).message);
        }
    }

    async deleteRoom({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/Rooms/DelRooms`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting room: ' + (error as Error).message);
        }
    }
}

export default new RoomService();
