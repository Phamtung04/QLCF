import axios from 'axios';

class OrderService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getAllOrder({
        limit,
        page,
        rid,
        tableId,
        status,
        orderId,
        branchId,
        userId,
        date
    }: {
        limit: number;
        page: number;
        rid: string;
        tableId: number; // Đổi từ room_id
        status: string;
        orderId: number;
        branchId: number; // Đổi từ building_id
        userId: number;
        date: string;
    }) {
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
                limit,
                page,
                rid,
                tableId, // Sử dụng table_id thay vì room_id
                status,
                orderId,
                branchId, // Sử dụng branch_id thay vì building_id
                userId,
                date
            };
            const result = await axios.post(`${this.apiName}/order/GetAllOrder`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error getting orders: ' + (error as Error).message);
        }
    }

    async postOrder(orderData: {
        rid: string;
        clientId: string;
        tableId: number; // Đổi từ roomId
        branchId: number; // Đổi từ buildingId
        orderStatus: string;
        orderTime: string;
        items: {
            rid: string;
            itemId: number;
            quantity: number;
            dateCreate: string;
            note: string;
        }[];
    }) {
        const serviceToken = this.getServiceToken();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${serviceToken}`
                }
            };

            const result = await axios.post(`${this.apiName}/order/InserOrder`, orderData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error creating order: ' + (error as Error).message);
        }
    }

    updateOrder = async ({ rid, status, message }: { rid: string; status: string; message: string }) => {
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
                status,
                message
            };
            const result = await axios.post(`${this.apiName}/order/UpdOrder`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error updating order: ' + (error as Error).message);
        }
    };
    updatePaymentMethod = async ({ rid, paymentMethod }: { rid: string; paymentMethod: string }) => {
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
                paymentMethod
            };
            const result = await axios.post(`${this.apiName}/order/UpdPaymentOrder`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error updating order: ' + (error as Error).message);
        }
    };
}

export default new OrderService();
