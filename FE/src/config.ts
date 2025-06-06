// types

export const BASE_PATH = process.env.REACT_APP_BASE_PATH ?? '';

export const DASHBOARD_PATH = '/react-order/order';

const config: any = {
    fontFamily: `'Be VietNam Pro', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    navType: 'light', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'vi', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: false
};

export default config;
