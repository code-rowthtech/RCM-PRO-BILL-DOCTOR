import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createHolidayScheduleApi(params: any): any {
    const { data } = params;
    return api.create(URL.createHoliday,data);
}
export function getHolidayScheduleApi(params: any): any {
    const { data } = params;
    return api.create(`${URL.getHoliday}?startDate=${data?.startDate}&endDate=${data?.endDate}&search=${data?.search}&type=${data?.type}&doctorId=${data?.doctorId}`);
}

