// @flow
import { ScheduleActionTypes } from "./constants";

type AuthAction = { type: string, payload: {} | string };


export const createHolidayScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE,
    data
});
export const getHolidayScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.GET_HOLIDAY_SCHEDULE,
    data
});

export const deleteHolidayScheduleAction =(data): AuthAction=>({
    type: ScheduleActionTypes.DELETE_HOLIDAY_SCHEDULE,
    data
})

export const stateEmptydAction = (): LayoutAction => ({
    type: ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE,

});

export const createScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.CREATE_SCHEDULE,
    data
});

export const updateScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.UPDATE_SCHEDULE,
    data
});

export const getScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.GET_SCHEDULE,
    data
});
