import { PatientsActionTypes } from "./constants"


const GET_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getPatientsReducer = (state = GET_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const GET_PATIENTS_BY_ID_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getPatientsByIdReducer = (state = GET_PATIENTS_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

const CREATE_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const createPatientsReducer = (state = CREATE_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_PATIENTS_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const UPDATE_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const updatePatientsReducer = (state = UPDATE_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPDATE_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.UPDATE_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.UPDATE_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.UPDATE_PATIENTS_RESET:
            return {
                ...state,
                data: [],
            };
        default: return state
    }
}

const CREATE_REFERRING_DOCTOR_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const createReferringDoctorReducer = (state = CREATE_REFERRING_DOCTOR_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_REFERRING_DOCTOR_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_REFERRING_DOCTOR_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_REFERRING_DOCTOR_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_REFERRING_DOCTOR_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const CREATE_RESPONSIBLE_PARTY_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const createResponsiblePartyReducer = (state = CREATE_RESPONSIBLE_PARTY_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const GET_PATIENT_CONSENT_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getPatientConsentReducer = (state = GET_PATIENT_CONSENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENT_CONSENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENT_CONSENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENT_CONSENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        // case PatientsActionTypes.STATE_EMPTY_INTIAL_STATE:
        //     return {
        //         data: [],
        //         loading: false
        //     }
        default: return state
    }
}