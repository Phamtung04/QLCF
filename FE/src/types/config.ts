import { PaletteMode } from '@mui/material';

export type ConfigProps = {
    [x: string]: any;
    fontFamily: string;
    borderRadius: number;
    outlinedFilled: boolean;
    navType: PaletteMode;
    presetColor: string;
    locale: string;
    rtlLayout: boolean;
    container: boolean;
    urlFingerService: string;
    urlFaceService: string;
    urlLoginBtUserService: string;
};

export type CustomizationProps = {
    fontFamily: string;
    borderRadius: number;
    outlinedFilled: boolean;
    navType: PaletteMode;
    presetColor: string;
    locale: string;
    rtlLayout: boolean;
    container: boolean;
    urlFingerService: string;
    urlFaceService: string;
    urlLoginBtUserService: string;
    onChangeMenuType: (navType: PaletteMode) => void;
    onChangePresetColor: (presetColor: string) => void;
    onChangeLocale: (locale: string) => void;
    onChangeRTL: (rtlLayout: boolean) => void;
    onChangeContainer: () => void;
    onChangeFontFamily: (fontFamily: string) => void;
    onChangeBorderRadius: (event: Event, newValue: number | number[]) => void;
    onChangeOutlinedField: (outlinedFilled: boolean) => void;
    onChangeUrlFaceService: (value: string) => void;
    onChangeUrlFingerService: (value: string) => void;
    onChangeUrlLoginBtUserService: (value: string) => void;
};
