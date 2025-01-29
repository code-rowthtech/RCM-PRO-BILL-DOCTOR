// @flow
import { DoctorsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getDoctorsAction = (data): AuthAction => ({
    type: DoctorsActionTypes.GET_DOCTORS,
    data
});


export const getCitiesAction = (data) => ({
    type: DoctorsActionTypes.GET_CITIES,
    data
});

export const getCities2Action = (data) => ({
    type: DoctorsActionTypes.GET_CITIES2,
    data
});
export const getCities3Action = (data) => ({
    type: DoctorsActionTypes.GET_CITIES3,
    data
});
export const getStatesByCountryAction = (data): AuthAction => ({
    type: DoctorsActionTypes.GET_STATES,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE,

});