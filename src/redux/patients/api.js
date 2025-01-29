import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatients, data);
}

export function getPatientsByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatientsById, data);
}


export function createPatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createPatients, data);
}

export function updatePatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.updatePatients, data);
}