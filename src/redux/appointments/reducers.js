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