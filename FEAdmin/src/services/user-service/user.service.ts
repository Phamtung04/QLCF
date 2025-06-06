import axios from 'axios';

class UserService {
    apiName = `${process.env.REACT_APP_BASE_API_URL}`;

    // Method to get service token from localStorage
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }

    async getMe() {
        const serviceToken = this.getServiceToken();
        if (!serviceToken) {
            throw new Error('Service token not found');
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${serviceToken}`
                }
            };

            const result = await axios.get(`${this.apiName}/auth/me`, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching user info: ' + (error as Error).message);
        }
    }

    async getAllUser({
        limit,
        page,
        rid,
        name,
        branchId // Changed from buildingId to branchId
    }: {
        limit: number;
        page: number;
        rid: string;
        name: string;
        branchId: number; // Changed from buildingId to branchId
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
                branchId // Changed from buildingId to branchId
            };
            const result = await axios.post(`${this.apiName}/users/GetAllUsers`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async addUser({
        rid,
        userName, // Changed to userName
        permission,
        lockUp,
        email,
        branchId,
        password // Added password field
    }: {
        rid: string;
        userName: string; // Updated to userName
        permission: string;
        lockUp: boolean;
        email: string;
        branchId: number; // Changed type to number for branchId
        password: string; // New password field
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

            const requestData = { rid, userName, permission, lockUp, branchId, email, password };

            const result = await axios.post(`${this.apiName}/users/InsOrUpdUsers`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding user: ' + (error as Error).message);
        }
    }

    async updateUser({
        rid,
        userName,
        permission,
        lockUp,
        email,
        branchId // Changed from buildingId to branchId
    }: {
        rid: string;
        userName: string;
        permission: string;
        lockUp: boolean;
        email: string;
        branchId: number; // Changed from buildingId to branchId
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

            const requestData = { rid, userName, permission, lockUp, branchId, email };

            const result = await axios.post(`${this.apiName}/users/InsOrUpdUsers`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error adding user: ' + (error as Error).message);
        }
    }
    async deleteUser({ rid }: { rid: string }) {
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

            const result = await axios.post(`${this.apiName}/users/DelUsers`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error deleting user: ' + (error as Error).message);
        }
    }

    async getAllUserBranch({ limit, page, rid }: { limit: number; page: number; rid: string }) {
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
                rid
            };
            const result = await axios.post(`${this.apiName}/userBranches/GetAllUserBranches`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }

    async updateManageBranch({ rid, listBranch }: { rid: string; listBranch: string }) {
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
                listBranch, // Changed from listBuilding to listBranch
                rid
            };
            const result = await axios.post(`${this.apiName}/userBranches/InsOrUpdUserBranch`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error updating manage branch: ' + (error as Error).message);
        }
    }
    async updateTTUser({ rid, lockUp }: { rid: string; lockUp: boolean }) {
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
                lockUp, // Changed from listBuilding to listBranch
                rid
            };
            const result = await axios.post(`${this.apiName}/users/UpTTUser`, requestData, config);
            return result.data;
        } catch (error) {
            throw new Error('Error updating manage branch: ' + (error as Error).message);
        }
    }
}

export default new UserService();
