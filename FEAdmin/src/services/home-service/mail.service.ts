import axios, { AxiosResponse } from 'axios';

interface EmailDetails {
    rebno?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    message?: string;
}

class EmailService {
    private apiEndpoint: string;
    private defaultFromEmail: string;
    getServiceToken() {
        return localStorage.getItem('serviceToken');
    }
    constructor() {
        this.apiEndpoint = 'https://uatqlyc.hdbank.com.vn/publicgateway/autosendmail/api/AutoSendMail/insautosendmail';
        this.defaultFromEmail = 'newmis1@hdbank.com.vn';
    }

    public async sendEmail(emailDetails: EmailDetails): Promise<AxiosResponse> {
        const serviceToken = this.getServiceToken();
        const payload = {
            idsendmail: 0,
            mailtype: 'ORDER',
            rebno: emailDetails.rebno || '',
            from: this.defaultFromEmail,
            to: emailDetails.to || '',
            cc: emailDetails.cc || '',
            bcc: emailDetails.bcc || '',
            subject: emailDetails.subject || '',
            body: emailDetails.body || '',
            message: emailDetails.message || emailDetails.subject || '',
            filepath: '',
            sent: false
        };

        const headers = {
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8,en-GB;q=0.7',
            authorization: `Bearer ${serviceToken}`,
            'content-type': 'application/json'
            // dnt: '1',
            // origin: 'https://uatqlyc.hdbank.com.vn',
            // referer: 'https://uatqlyc.hdbank.com.vn/order/drinks'
            // 'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-ch-ua-platform': '"Windows"',
            // 'sec-fetch-dest': 'empty',
            // 'sec-fetch-mode': 'cors',
            // 'sec-fetch-site': 'same-origin',
            // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        };

        try {
            const response = await axios.post(this.apiEndpoint, payload, { headers });
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export default new EmailService();
