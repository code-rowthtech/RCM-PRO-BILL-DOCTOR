import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
import { loggedInUser } from '../../helpers/loggedInUser';
const api = new APICore();

export function uploadDocumentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.patientDocuments, data);
}

export function updateDocumentsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.patientDocuments}/${data?.id}`, { key: data?.body });
}

export function deleteDocumentsApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.patientDocuments}/${data?.id}`);

}
export function getDocumentsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.patientDocuments}?subject=${data?.patientId}`);
}

export function getDocumentsByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.patientDocuments}/${data?.docId}`);
}
