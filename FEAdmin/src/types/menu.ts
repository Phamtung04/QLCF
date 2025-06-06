// ==============================|| MENU TYPES  ||============================== //

export type MenuProps = {
    drawerOpen: boolean;
    activeItem: ItemMenuProps;
};

export type ItemMenuProps = {
    name?: string | number;
    normalizedName?: string;
    ghiChu?: string;
    isHeThong?: boolean;
    isYeuCauKhachHang?: boolean;
    stt?: number;
    icon?: string;
    trangThai?: string;
    useIframe?: boolean;
    linkView?: any;
    linkNew?: any;
    linkEdit?: any;
    linkUpdateFiles?: any;
    maLoaiYeuCau?: string;
    tokenEnpointUrl?: any;
    webHookAfterCreated?: any;
    webHookAfterUpdated?: any;
    entityGuid?: string;
    creationTime?: Date;
    lastModificationTime?: Date;
    id?: number | string;
};
