import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getTemplateApi(params: any): any {
    const { data } = params;
    // console.log(data)
    return api.get(`${URL.getTemplate}?clinicId=${data?.clinicId}&flag=${data?.flag}&associatedDepartment=${data?.associatedDepartment}&search=${data?.search}&favoriteStatus=${data?.favoriteStatus}`);
}

