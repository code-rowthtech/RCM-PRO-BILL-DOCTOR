import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PatientsActionTypes } from './constants';
import { createPatientsApi, getPatientsApi, getPatientsByIdApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* getPatientsByIdFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getPatientsByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
            payload: error,
        });
    }
}
function* createPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(createPatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: PatientsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetPatients() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS, getPatientsFunction);
}
export function* watchGetPatientsById() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS_BY_ID, getPatientsByIdFunction);
}
export function* watchCreatePatients() {
    yield takeEvery(PatientsActionTypes.CREATE_PATIENTS, createPatientsFunction);
}


export function* watchresetState() {
    yield takeEvery(PatientsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* patientsSaga() {
    yield all([
        fork(watchGetPatients),
        fork(watchGetPatientsById),
        fork(watchresetState),
        fork(watchCreatePatients),
    ]);
}
export default patientsSaga;
