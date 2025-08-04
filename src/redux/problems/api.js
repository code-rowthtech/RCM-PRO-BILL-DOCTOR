import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function getProblemsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.problem}?patientId=${data?.patientId}&limit=${data?.limit || 10}&page=${data?.skip || 1}`);
}

export function createProblemsApi(params: any): any {
    const { data } = params;
    return api.create(URL.problem, data);
}
export function updateProblemsApi(params: any): any {
    const { data } = params;
    return api.update(URL.problem, data);
}
export function deleteProblemsApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.problem}?id=${data?.id}`);
}

export function getAllCodeApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.allCodes}?query=${data.search}`);
}

export function getProblemsByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.problem}/${data?.id}`);
}

// export function getPatientAppointmentsAllApi(params: any): any {
//     const { data } = params;
//     return api.get(`${URL.getPatientAppointmentAll}?patientId=${data?.patientId}`,);
// }