import { AppointmentsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createAppointmentsAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.CREATE_APPOINTMENTS,
    data
});

export const getAppointmentsAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.GET_APPOINTMENTS,
    data
});

export const getAllAppointmentsAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.GET_ALL_APPOINTMENTS,
    data
});