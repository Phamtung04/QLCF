import { matchPath, NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import queryString from 'query-string';

const useCustomNavigate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [returnUrl, setReturnUrl] = useLocalStorage<string | null>('returnUrl', '');

    const navigateToReturnUrl = () => {
        if (!returnUrl) return;
        navigate(returnUrl);
        setReturnUrl(null);
    };

    const navigateAndCurrentPath = (path: string, option?: NavigateOptions) => {
        setReturnUrl(queryString.stringifyUrl({ url: location.pathname }));
        navigate(path, option);
    };

    return {
        navigateToReturnUrl,
        navigateAndCurrentPath,
        returnUrl
    };
};

export default useCustomNavigate;
