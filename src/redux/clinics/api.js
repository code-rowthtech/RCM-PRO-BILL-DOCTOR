import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.createClinic, data);
}

export function updateClinicApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateClinic, data);
}

export function getClinicByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinicById, data);
}

export function getClinicApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getClinic}?name=${data?.payload?.name}&page=${data?.payload?.skip}&limit=${data?.payload?.limit}`);
}

