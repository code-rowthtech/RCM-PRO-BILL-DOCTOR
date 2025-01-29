import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getDoctorsApi(params: any): any {
    const { data } = params;
    return api.create(`${URL.getDoctor}`);
}
export function getCityByStateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getCityByState}${data?.state_code}?name=${data?.name}&page=${data?.skip}&limit=${data?.limit}`);
}
export function getStateByCountry(params: any): any {
    return api.get(URL.getStatedByCountry);
}
