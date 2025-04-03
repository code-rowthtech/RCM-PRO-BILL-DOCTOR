import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getPatients, data);
}

export function getPatientsByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPatientsById}?id=${data.id}`);
}


export function createPatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createPatients, data);
}

export function updatePatientsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updatePatients, data);
}

export function createReferringDoctorApi(params: any): any {
    const { data } = params;
    return api.create(URL.createReferringDoctor, data);
}

export function createResponsiblePartyApi(params: any): any {
    const { data } = params;
    return api.create(URL.createResponsibleParty, data);
}