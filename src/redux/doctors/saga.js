import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { DoctorsActionTypes } from './constants';
import { getAllDoctorApi, getCityByStateApi, getDoctorsApi, getStateByCountry, updateDoctorApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { t } from 'i18next';
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

function* getAllDoctorsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_ALL_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(getAllDoctorApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_ALL_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_ALL_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_ALL_DOCTORS_ERROR,
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

function* getCities3Function(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_CITIES3_LOADING,
        });
        const response = yield call(getCityByStateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_CITIES3_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_CITIES3_ERROR,
                payload: decryptedData,
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_CITIES3_ERROR,
            payload: error,
        });
    }
}

function* getStatesFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_STATES_LOADING,
            payload: {},
        });
        const response = yield call(getStateByCountry, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_STATES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_STATES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_STATES_ERROR,
            payload: error,
        });
    }
}

function* updateDoctorsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.UPDATE_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(updateDoctorApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: DoctorsActionTypes.UPDATE_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.UPDATE_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.UPDATE_DOCTORS_ERROR,
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

export function* watchGetCities3() {
    yield takeEvery(DoctorsActionTypes.GET_CITIES3, getCities3Function);
}


export function* watchGetDoctors() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS, getDoctorsFunction);
}

export function* watchAllGetDoctors() {
    yield takeEvery(DoctorsActionTypes.GET_ALL_DOCTORS, getAllDoctorsFunction);
}


export function* watchGetStates() {
    yield takeEvery(DoctorsActionTypes.GET_STATES, getStatesFunction);
}

export function* watchUpdateDoctors() {
    yield takeEvery(DoctorsActionTypes.UPDATE_DOCTORS, updateDoctorsFunction);
}

export function* watchresetState() {
    yield takeEvery(DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* doctorsSaga() {
    yield all([
        fork(watchGetDoctors),
        fork(watchGetCities),
        fork(watchGetCities2),
        fork(watchGetCities3),
        fork(watchGetStates),
        fork(watchUpdateDoctors),
        fork(watchresetState),
        fork(watchAllGetDoctors),
    ]);
}
export default doctorsSaga;
