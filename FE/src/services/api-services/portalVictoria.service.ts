import axiosServices from 'utils/axios';

class PortalVictoriaApiService {
    baseApi = `https://aa67-183-91-30-70.ngrok-free.app/api/`;

    async searchDataCustomer(data: any) {
        return axiosServices.post(`KhachHang/GetDataKhachHang`, data);
    }

    listProfile(data: any) {
        return axiosServices.post(`KhachHang/SendGETRequest`, data);
    }

    insertLog(data: any) {
        return axiosServices.post(`${process.env.REACT_APP_BASE_API_INSERTLOG_URL}User/InsertLog`, data);
    }

    listLogs(data: any) {
        return axiosServices.post(`${process.env.REACT_APP_BASE_API_INSERTLOG_URL}User/GetLog`, data);
    }
}
export default new PortalVictoriaApiService();
