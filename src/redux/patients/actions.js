// @flow
import { PatientsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS,
    data
});

export const getPatientsByIdAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS_BY_ID,
    data
});

export const createPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.CREATE_PATIENTS,
    data
});

export const updatePatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.UPDATE_PATIENTS,
    data
});

export const resetUpdateAction = (): LayoutAction => ({
    type: PatientsActionTypes.RESET_UPDATE_STATUS,
});