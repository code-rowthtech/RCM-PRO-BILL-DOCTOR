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


