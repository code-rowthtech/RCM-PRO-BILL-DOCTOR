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