import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
import { loggedInUser } from '../../helpers/loggedInUser';
const api = new APICore();

export function createAllergiesApi(params: any): any {
    const { data } = params;
    return api.create(URL.allergy, data);
}

export function updateAllergiesApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.allergy}`, data);
}

export function deleteAllergiesApi(params: any): any {
    const { data } = params;
        return api.delete(`${URL.allergy}?id=${data?.id}`);

}
export function getAllergiesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.allergy}?patientId=${data?.patientId}&limit=${data?.limit || 10}&page=${data?.skip || 1}`);
}

export function getAllergyDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.allergy}/${data?.id}`);
}
export function getFoodAllergiesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.foodAllergy}?query=${data?.query}&page=${data?.skip}`);
}