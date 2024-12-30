// @flow
import { ScheduleActionTypes } from "./constants";

type AuthAction = { type: string, payload: {} | string };


export const createHolidayScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE,

});