import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createMedicationApi(params: any): any {
    const { data } = params;
    return api.create(URL.medication, data);
}

export function updateMedicationApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.medication}/${data?.medicationId}`, data);
}

export function deleteMedicationApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.medication}/${data?.medicationId}`);
}

export function getMedicationDrugsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getMedicationDrugs}?page=${data?.skip}&query=${data?.search}`);
}

export function getMedicationApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.medication}?patientId=${data?.patientId}&page=${data?.skip || 1}&limit=${data?.limit || 10}`);
}