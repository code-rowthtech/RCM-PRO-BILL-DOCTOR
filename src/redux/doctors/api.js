import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getDoctorsApi(params: any): any {
    const { data } = params;
    return api.create(`${URL.getPractitioner}`);
}
export function getCityByStateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getCityByState}${data?.state_code}?name=${data?.name}&page=${data?.skip}&limit=${data?.limit}`);
}
export function getStateByCountry(params: any): any {
    return api.get(URL.getStatedByCountry);
}
export function updateDoctorApi(params) {
    const { data } = params
    return api.create(URL.updatePractitioner, data);
}
export function getAllDoctorApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAllDoctor}?status=${data?.status}&search=${data?.search}&page=${data?.page}&limit=${data?.limit}`);
}