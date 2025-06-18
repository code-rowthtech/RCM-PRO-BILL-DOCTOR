import { ScheduleActionTypes } from "./constants"


const GET_HOLIDAY_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createHolidayScheduleReducer = (state = GET_HOLIDAY_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const FETCH_HOLIDAY_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getHolidayScheduleReducer = (state = FETCH_HOLIDAY_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const DELETE_HOLIDAY_INITIAL_STATE = {
    data: [],
    loading: false
}

export const deleteHolidayScheduleReducer = (state = DELETE_HOLIDAY_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.DELETE_HOLIDAY_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.DELETE_HOLIDAY_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
            case ScheduleActionTypes.DELETE_HOLIDAY_SCHEDULE_RESET:
                return {
                    data: [],
                    loading: false,
                };
        case ScheduleActionTypes.DELETE_HOLIDAY_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

const CREATE_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createScheduleReducer = (state = CREATE_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.CREATE_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.CREATE_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.CREATE_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const UPDATE_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const updateScheduleReducer = (state = UPDATE_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.UPDATE_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.UPDATE_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.UPDATE_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

const GET_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getScheduleReducer = (state = GET_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.GET_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.GET_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.GET_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
