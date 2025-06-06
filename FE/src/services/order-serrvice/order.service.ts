import axios from 'axios';

class OrderService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

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
        tableId: number; 
        status: string;
        orderId: number;
        branchId: number; 
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
                tableId,
                status,
                orderId,
                branchId, 
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
        clientId: string;
        tableId: number;
        branchId: number;
        status: string;
        note: string;
        paymentMethod: string;
        items: {
            id: number;
            quantity: number;
            price: number;
            note: string;
        }[];
    }) {
        try {
            const serviceToken = this.getServiceToken();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${serviceToken}`
                }
            };

            const result = await axios.post(`${this.apiName}/order/InsertOrder`, orderData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error creating order: ' + (error as Error).message);
        }
    }

    updateOrder = async ({ rid, orderStatus }: { rid: string; orderStatus: string }) => {
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
                orderStatus
            };
            const result = await axios.post(`${this.apiName}/Order/UpdOrder`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error adding data: ' + (error as Error).message);
        }
    };
}

export default new OrderService();
