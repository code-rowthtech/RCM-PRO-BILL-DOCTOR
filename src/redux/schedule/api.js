import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createHolidayScheduleApi(params: any): any {
    const { data } = params;
    return api.create(URL.createHoliday, data);
}
export function getHolidayScheduleApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getHoliday}?fromDate=${data?.startDate}&toDate=${data?.endDate}&search=${data?.search}&clinicId=${data?.clinicId}&doctorId=${data?.doctorId}&forAppiontment=${data?.forAppiontment}`);
}
export function deleteHolidayScheduleApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.deleteHoliday}/${data}`);
}
