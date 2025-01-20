import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ScheduleActionTypes } from './constants';
import { createHolidayScheduleApi, getHolidayScheduleApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createHolidayScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(createHolidayScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE_ERROR,
            payload: error,
        });
    }
}
function* getHolidayScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(getHolidayScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ScheduleActionTypes.GET_HOLIDAY_SCHEDULE_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchCreateHolidaySchedule() {
    yield takeEvery(ScheduleActionTypes.CREATE_HOLIDAY_SCHEDULE, createHolidayScheduleFunction);
}

export function* watchGetHolidaySchedule() {
    yield takeEvery(ScheduleActionTypes.GET_HOLIDAY_SCHEDULE, getHolidayScheduleFunction);
}



export function* watchresetState() {
    yield takeEvery(ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* scheduleSaga() {
    yield all([
        fork(watchCreateHolidaySchedule),
        fork(watchGetHolidaySchedule),
        fork(watchresetState)
    ]);
}
export default scheduleSaga;
