import { AppointmentsActionTypes } from "./constants"

const CREATE_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}
const GET_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}
const GET_ALL_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PRACTITIONER_AVAILABILITY_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const createAppointmentsReducer = (state = CREATE_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.CREATE_APPOINTMENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.CREATE_APPOINTMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.CREATE_APPOINTMENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getAppointmentsReducer = (state = GET_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.GET_APPOINTMENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.GET_APPOINTMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.GET_APPOINTMENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getAllAppointmentsReducer = (state = GET_ALL_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.GET_ALL_APPOINTMENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.GET_ALL_APPOINTMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.GET_ALL_APPOINTMENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getPractitionerAvailabilityReducer = (state = GET_PRACTITIONER_AVAILABILITY_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.GET_PRACTITIONER_AVAILABILITY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.GET_PRACTITIONER_AVAILABILITY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.GET_PRACTITIONER_AVAILABILITY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const GET_APPOINTMENT_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const getAppointmentDetailsReducer = (state = GET_APPOINTMENT_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.GET_APPOINTMENT_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.GET_APPOINTMENT_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.GET_APPOINTMENT_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const UPDATE_APPOINTMENT_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const updateAppointmentDetailsReducer = (state = UPDATE_APPOINTMENT_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentsActionTypes.UPDATE_APPOINTMENT_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentsActionTypes.UPDATE_APPOINTMENT_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.UPDATE_APPOINTMENT_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}