import axios from 'axios';
import { refLoading } from 'components/Loading';
import { getState } from 'store';

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL! // => Product
});

axiosServices.interceptors.response.use(
    (response) => {
        refLoading.current?.handleClose();
        return _.get(response, 'data', {});
    },
    (error) => {
        refLoading.current?.handleClose();
        if (_.has(error, 'response.data')) {
            // toastService.toastError(_.get(error, 'response.data'));
            return Promise.reject(error.response.data);
        }
        return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
    }
);

export default axiosServices;
