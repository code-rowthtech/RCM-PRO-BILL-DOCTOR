import { ClinicsActionTypes } from "./constants"

const CREATE_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CLINIC_BY_ID_INITIAL_STATE = {
    data: [],
    loading: false
}



export const createClinicsReducer = (state = CREATE_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.CREATE_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.CREATE_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.CREATE_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getClinicByIdReducer = (state = GET_CLINIC_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CLINIC_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CLINIC_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CLINIC_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
export const getClinicsReducer = (state = GET_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateClinicsReducer = (state = UPDATE_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.UPDATE_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.UPDATE_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.UPDATE_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

