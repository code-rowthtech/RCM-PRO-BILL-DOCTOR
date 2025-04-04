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

export const getPractitionerAvailabilityAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.GET_PRACTITIONER_AVAILABILITY,
    data
});

export const getAppointmentDetailsAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.GET_APPOINTMENT_DETAILS,
    data
});

export const updateAppointmentDetailsAction = (data): AuthAction => ({
    type: AppointmentsActionTypes.UPDATE_APPOINTMENT_DETAILS,
    data
});