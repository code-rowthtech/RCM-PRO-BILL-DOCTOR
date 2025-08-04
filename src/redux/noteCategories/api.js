import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.create(URL.createNoteCategories, data);
}

export function getNoteCategoriesApi(params: any): any {
    const { data } = params;
    
    // Build query parameters more efficiently
    const queryParams = new URLSearchParams();
    
    if (data?.clinicId) queryParams.append('clinicId', data.clinicId);
    if (data?.skip) queryParams.append('page', data.skip.toString());
    if (data?.limit) queryParams.append('limit', data.limit.toString());
    if (data?.search && data.search.trim()) queryParams.append('search', data.search.trim());
    if (data?.active !== undefined) queryParams.append('active', data.active.toString());
    if (data?.noteType) queryParams.append('noteType', data.noteType);
    
    return api.get(`${URL.getNoteCategories}?${queryParams.toString()}`);
}

export function updateNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.updateNoteCategories}${data?.id}`, data);
}

export function createNoteTypeSettingsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createNoteCategories, data);
}

export function getNoteTypeSettingsApi(params: any): any {
    return api.get(`${URL.getNoteCategories}`);
}

export function updateNoteTypeSettingsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.updateNoteCategories}${data?.id}`, data);
}

// settings tabs
export function createSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createnoteTypeSettings, data);
}
export function getSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.createnoteTypeSettings}?noteId=${data?.noteId}`);
}
export function updateSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.createnoteTypeSettings}`, data);
}