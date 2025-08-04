import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createAppointmentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createAppointments, data);
}

export function getAppointmentsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getAppointments, data);
}

export function getAllAppointmentsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getAllAppointments, data);
}

export function getPractitionerAvailabilityApi(params: any): any {
    const { data } = params;
    return api.get(URL.getPractitionerAvailability, data);
}

export function getAppointmentDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAppointmentDetails}/${data?.id}`);
}

export function updateAppointmentDetailsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateAppointmentDetails, data);
}

export function getAppointmentByPateintProviderApi(parmas: any): any {
    const { data } = parmas;
    return api.get(URL.getAppointmentByPateintProvider, data);
}

export function getAppointmentByPateintIdApi(parmas: any): any {
    const { data } = parmas;
    return api.get(URL.getAppointmentByPateintId, data);
}