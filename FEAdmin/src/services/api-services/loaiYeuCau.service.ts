import { BaseApiService } from 'services/core/baseApi.service';
import { EnumYeuCauStatus } from 'store';
import axiosServices from 'utils/axios';

export interface IFilterLoaiYeuCau {
    trangThai?: EnumYeuCauStatus;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
}

export interface ILoaiYeuCau {
    name?: string;
    displayName?: string;
    normalizedName?: string;
    ghiChu?: string;
    isHeThong?: boolean;
    isYeuCauKhachHang?: boolean;
    stt?: number;
    icon?: string | any;
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
    nameDrawerOpen?: string;
}

class LoaiYeuCauApiService extends BaseApiService {
    constructor() {
        super('/api/w360cv/loai-yeu-cau');
    }

    uploadIcon(model: any) {
        const url = `${this.apiName}/${model.id}/icon`;
        const formData = new FormData();
        formData.append('file', model.iconFile[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return axiosServices.post(url, formData, config);
    }

    sort(body: any[]) {
        return axiosServices.patch(`${this.apiName}/sort`, body);
    }

    getReport() {
        return axiosServices.get(`${this.apiName}/overview-statistical`);
    }

    getReportDetail() {
        return axiosServices.get(`${this.apiName}/detail-statistical`);
    }
}

export default new LoaiYeuCauApiService();
