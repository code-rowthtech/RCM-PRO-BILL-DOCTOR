import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { DoctorsActionTypes } from './constants';
import { getCityByStateApi, getDoctorsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getDoctorsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(getDoctorsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_ERROR,
            payload: error,
        });
    }
}

function* getCitiesFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_CITIES_LOADING,
        });
        const response = yield call(getCityByStateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_CITIES_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_CITIES_ERROR,
                payload: decryptedData,
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_CITIES_ERROR,
            payload: error,
        });
    }
}

function* getCities2Function(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_CITIES2_LOADING,
        });
        const response = yield call(getCityByStateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_CITIES2_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_CITIES2_ERROR,
                payload: decryptedData,
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_CITIES2_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchGetCities() {
    yield takeEvery(DoctorsActionTypes.GET_CITIES, getCitiesFunction);
}

export function* watchGetCities2() {
    yield takeEvery(DoctorsActionTypes.GET_CITIES2, getCities2Function);
}


export function* watchGetDoctors() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS, getDoctorsFunction);
}



export function* watchresetState() {
    yield takeEvery(DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* doctorsSaga() {
    yield all([
        fork(watchGetDoctors),
        fork(watchGetCities),fork(watchGetCities2),
        fork(watchresetState)
    ]);
}
export default doctorsSaga;
