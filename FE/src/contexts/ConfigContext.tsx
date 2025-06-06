import { createContext, ReactNode } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { PaletteMode } from '@mui/material';
import { CustomizationProps } from 'types/config';

// initial state
const initialState: CustomizationProps = {
    ...defaultConfig,
    onChangeMenuType: () => {},
    onChangePresetColor: () => {},
    onChangeLocale: () => {},
    onChangeRTL: () => {},
    onChangeContainer: () => {},
    onChangeFontFamily: () => {},
    onChangeBorderRadius: () => {},
    onChangeOutlinedField: () => {},
    onChangeUrlFaceService: () => {},
    onChangeUrlFingerService: () => {},
    onChangeUrlLoginBtUserService: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
    children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useLocalStorage('hd-config', {
        fontFamily: initialState.fontFamily,
        borderRadius: initialState.borderRadius,
        outlinedFilled: initialState.outlinedFilled,
        navType: initialState.navType,
        presetColor: initialState.presetColor,
        locale: initialState.locale,
        rtlLayout: initialState.rtlLayout,
        urlFaceService: initialState.urlFaceService,
        urlFingerService: initialState.urlFingerService,
        urlLoginBtUserService: initialState.urlLoginBtUserService
    });

    const onChangeMenuType = (navType: PaletteMode) => {
        setConfig({
            ...config,
            navType
        });
    };

    const onChangePresetColor = (presetColor: string) => {
        setConfig({
            ...config,
            presetColor
        });
    };

    const onChangeLocale = (locale: string) => {
        setConfig({
            ...config,
            locale
        });
    };

    const onChangeRTL = (rtlLayout: boolean) => {
        setConfig({
            ...config,
            rtlLayout
        });
    };

    const onChangeContainer = () => {
        setConfig({
            ...config,
            container: !config.container
        });
    };

    const onChangeFontFamily = (fontFamily: string) => {
        setConfig({
            ...config,
            fontFamily
        });
    };

    const onChangeBorderRadius = (event: Event, newValue: number | number[]) => {
        setConfig({
            ...config,
            borderRadius: newValue as number
        });
    };

    const onChangeOutlinedField = (outlinedFilled: boolean) => {
        setConfig({
            ...config,
            outlinedFilled
        });
    };

    const onChangeUrlFaceService = (urlFaceService: string) => {
        setConfig({
            ...config,
            urlFaceService
        });
    };
    const onChangeUrlFingerService = (urlFingerService: string) => {
        setConfig({
            ...config,
            urlFingerService
        });
    };
    const onChangeUrlLoginBtUserService = (urlLoginBtUserService: string) => {
        setConfig({
            ...config,
            urlLoginBtUserService
        });
    };

    return (
        <ConfigContext.Provider
            value={{
                ...config,
                onChangeMenuType,
                onChangePresetColor,
                onChangeLocale,
                onChangeRTL,
                onChangeContainer,
                onChangeFontFamily,
                onChangeBorderRadius,
                onChangeOutlinedField,
                onChangeUrlFaceService,
                onChangeUrlFingerService,
                onChangeUrlLoginBtUserService
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

export { ConfigProvider, ConfigContext };
