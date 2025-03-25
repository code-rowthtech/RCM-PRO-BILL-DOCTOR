import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createAppointmentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createAppointments, data);
}

export function getAppointmentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.getAppointments, data);
}

export function getAllAppointmentsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getAllAppointments, data);
}