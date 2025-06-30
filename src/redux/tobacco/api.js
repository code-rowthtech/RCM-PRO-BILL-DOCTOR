import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createTobaccoApi(params: any): any {
    const { data } = params;
    return api.create(URL.tobaccoHistory, data);
}

export function updateTobaccoApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.tobaccoHistory}`, data);
}

export function getTobaccoApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.tobaccoHistory}?subject=${data?.patientId}&page=${data?.skip || 1}&limit=${data?.limit || 10}`);
}

export function deleteTobaccoApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.tobaccoHistory}?id=${data?.id}`);
}

