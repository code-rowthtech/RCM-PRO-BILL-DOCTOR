import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getClinicEmployeesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getClinicEmployees}?clinicId=${data?.clinicId}`);
}

export function createTaskApi(params: any): any {
    const { data } = params;
    return api.create(URL.createTask, data);
}

export function getTaskApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAllTasks}?assignedToId=${data?.assignedToId}&taskStatus=${data?.taskStatus}&priority=${data?.priority}&sortBy=${data?.sortBy}`);
}

export function updateTaskApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateTask, data);
}

export function getTaskDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getTaskDetails}?id=${data?.id}`);
}

export function createProblemApi(params: any): any {
    const { data } = params;
    return api.create(URL.createProblem, data);
}

export function getPatientProblemsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPatientProblems}?patientId=${data?.patientId}`);
}

export function updateProblemsApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateProblems, data);
}

export function getProblemDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getProblemDetails}?id=${data?.id}`);
}

export function getSearchCodesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getSearchCodes}?query=${data?.query}`);
}

export function getPatientAppointmentsApi(params: any): any {
    const { payload } = params;
   
    return api.create(`${URL.getPatientAppointments}`,payload);
}
