/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
import axiosServices from 'utils/axios';

export abstract class BaseApiService {
    // eslint-disable-next-line prettier/prettier
    constructor(protected apiName: string) {}

    getAll(filter?: any) {
        return axiosServices.get(`${this.apiName}`, { params: filter });
    }

    getById(id: string | any) {
        return axiosServices.get(`${this.apiName}/${id}/detail`);
    }

    getByGuid(id: string | any) {
        return axiosServices.get(`${this.apiName}/${id}/detail-by-entity-guid`);
    }

    delete(id: any) {
        return axiosServices.delete(`${this.apiName}/${id}`);
    }

    updatePatch(model: any) {
        return axiosServices.patch(`${this.apiName}/${model.id}`, model);
    }

    updatePut(model: any) {
        return axiosServices.put(`${this.apiName}/${model.id}`, model);
    }

    insert(model: any) {
        model = _.omit(model, ['id']);
        return axiosServices.post(`${this.apiName}`, model);
    }

    convertDateStringsToDates(payload: any) {
        // Ignore things that aren't objects.
        if (typeof payload !== 'object') return payload;

        for (const key in payload) {
            if (!payload.hasOwnProperty(key)) continue;
            const value = payload[key];
            // Check for string properties which look like dates.
            if (moment(value, moment.ISO_8601).isValid() && !/^\d+$/.test(value)) {
                payload[key] = moment(value).format('yyyy-MM-DD').toString();
            } else if (typeof value === 'object') {
                // Recurse into object
                this.convertDateStringsToDates(value);
            }
        }
        return payload;
    }
}
