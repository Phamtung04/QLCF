import axios from 'axios';
import { refLoading } from 'components/Loading';
import { useNavigate } from 'react-router-dom';
import { getState } from 'store';

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL! // => Product
});

axiosServices.interceptors.request.use((config: any) => {
    if (config.url?.includes('w360cv')) {
        const newUrlHasVersion = _.replace(config.url, 'w360cv', `w360cv/${process.env.REACT_APP_API_VERSION}`);
        _.set(config, 'url', newUrlHasVersion);
    }

    if (config.data?.currentStep) {
        config.data.currentStepId = config.data.currentStep.id;
        if (!_.has(config, 'data.nextStepId')) config.data.nextStepId = config.data.currentStep.nextStepId;
        if (!_.has(config, 'data.workflowId')) config.data.workflowId = config.data.currentStep.workflowId;
    }
    return config;
});

axiosServices.interceptors.response.use(
    (response) => {
        refLoading.current?.handleClose();
        return response;
    },
    (error) => {
        refLoading.current?.handleClose();
        if (_.get(error, 'response.status') === 401) {
            localStorage.removeItem('serviceToken');
            window?.location.reload();
        }

        let errorObj = { message: 'Something went wrong !', statusCode: _.get(error, 'response.status') };
        if (error.response) {
            errorObj = { ...error.response.data, statusCode: _.get(error, 'response.status') };
            return Promise.reject(errorObj);
        }

        return Promise.reject(errorObj);
    }
);

export default axiosServices;
