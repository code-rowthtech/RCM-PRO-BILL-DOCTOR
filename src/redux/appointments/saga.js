import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { AppointmentsActionTypes } from './constants';
import { createAppointmentsApi, getAllAppointmentsApi, getAppointmentsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createAppointmentsFunction(data) {
    try {
        yield put({
            type: AppointmentsActionTypes.CREATE_APPOINTMENTS_LOADING,
            payload: {},
        });
        const response = yield call(createAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AppointmentsActionTypes.CREATE_APPOINTMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentsActionTypes.CREATE_APPOINTMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AppointmentsActionTypes.CREATE_APPOINTMENTS_ERROR,
            payload: error,
        });
    }
}

function* getAppointmentsFunction(data) {
    try {
        yield put({
            type: AppointmentsActionTypes.GET_APPOINTMENTS_LOADING,
            payload: {},
        });
        const response = yield call(getAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AppointmentsActionTypes.GET_APPOINTMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentsActionTypes.GET_APPOINTMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AppointmentsActionTypes.GET_APPOINTMENTS_ERROR,
            payload: error,
        });
    }
}

function* getAllAppointmentsFunction(data) {
    try {
        yield put({
            type: AppointmentsActionTypes.GET_ALL_APPOINTMENTS_LOADING,
            payload: {},
        });
        const response = yield call(getAllAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AppointmentsActionTypes.GET_ALL_APPOINTMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentsActionTypes.GET_ALL_APPOINTMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
        yield put({
            type: AppointmentsActionTypes.GET_ALL_APPOINTMENTS_ERROR,
            payload: error,
        });
    }
}

export function* watchCreateAppointments() {
    yield takeEvery(AppointmentsActionTypes.CREATE_APPOINTMENTS, createAppointmentsFunction);
}

export function* watchGetAppointments() {
    yield takeEvery(AppointmentsActionTypes.GET_APPOINTMENTS, getAppointmentsFunction);
}

export function* watchGetAllAppointments() {
    yield takeEvery(AppointmentsActionTypes.GET_ALL_APPOINTMENTS, getAllAppointmentsFunction);
}

function* appointmentsSaga() {
    yield all([
        fork(watchCreateAppointments),
        fork(watchGetAppointments),
        fork(watchGetAllAppointments),
       
    ]);
}
export default appointmentsSaga;