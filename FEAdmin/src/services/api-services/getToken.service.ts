import axios from 'axios';
import React from 'react';

class GetTokenService {
    apiName = `${process.env.REACT_APP_BASE_API_TOKEN_URL}`;
    // serviceToken = localStorage.getItem('serviceToken');

    async getToken({ ClientId, ClientSecret, Scope }: { ClientId: string; ClientSecret: string; Scope: string }) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            };
            const requestData = {
                ClientId,
                ClientSecret,
                Scope
            };
            const result = await axios.post(`${this.apiName}`, requestData, config);

            return result.data;
        } catch (error) {
            throw new Error('Error fetching data: ' + (error as Error).message);
        }
    }
}

export default new GetTokenService();
