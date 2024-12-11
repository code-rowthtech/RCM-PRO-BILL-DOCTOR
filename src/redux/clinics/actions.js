// @flow
import { ClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.CREATE_CLINIC,
    data
});
export const getClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC,
    data
});

export const updateClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.UPDATE_CLINIC,
    data
});

export const getClinicById = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC_BY_ID,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,

});