import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { TobaccoActionTypes } from './constants';
import { createTobaccoApi, deleteTobaccoApi, getTobaccoApi, updateTobaccoApi } from './api';
import ToastHandle from '../../helpers/ToastMessage';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createTobaccoHistoryFunction(data) {
    try {
        yield put({
            type: TobaccoActionTypes.CREATE_TOBACCO_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(createTobaccoApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccoActionTypes.CREATE_TOBACCO_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccoActionTypes.CREATE_TOBACCO_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccoActionTypes.CREATE_TOBACCO_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccoActionTypes.CREATE_ALLERGIES_ERROR,
            payload: error,
        });
    }
}


function* updateTobaccoFunction(data) {
    try {
        yield put({
            type: TobaccoActionTypes.UPDATE_TOBACCO_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(updateTobaccoApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccoActionTypes.UPDATE_TOBACCO_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccoActionTypes.UPDATE_TOBACCO_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccoActionTypes.UPDATE_TOBACCO_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccoActionTypes.UPDATE_TOBACCO_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* deleteTobaccoFunction(data) {
    try {
        yield put({
            type: TobaccoActionTypes.DELETE_TOBACCO_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(deleteTobaccoApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccoActionTypes.DELETE_TOBACCO_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccoActionTypes.DELETE_TOBACCO_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccoActionTypes.DELETE_TOBACCO_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccoActionTypes.DELETE_TOBACCO_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* getTobaccoFunction(data) {
    try {
        yield put({
            type: TobaccoActionTypes.GET_TOBACCO_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(getTobaccoApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: TobaccoActionTypes.GET_TOBACCO_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: TobaccoActionTypes.GET_TOBACCO_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccoActionTypes.GET_TOBACCO_HISTORY_ERROR,
            payload: error,
        });
    }
}




export function* watchCreateTobaccoHistory() {
    yield takeEvery(TobaccoActionTypes.CREATE_TOBACCO_HISTORY, createTobaccoHistoryFunction);
}

export function* watchUpdateTobaccoHistory() {
    yield takeEvery(TobaccoActionTypes.UPDATE_TOBACCO_HISTORY, updateTobaccoFunction);
}

export function* watchDeleteTobaccoHistory() {
    yield takeEvery(TobaccoActionTypes.DELETE_TOBACCO_HISTORY, deleteTobaccoFunction);
}

export function* watchGetTobaccoHistory() {
    yield takeEvery(TobaccoActionTypes.GET_TOBACCO_HISTORY, getTobaccoFunction);
}


function* tobaccoSaga() {
    yield all([
        fork(watchCreateTobaccoHistory),
        fork(watchUpdateTobaccoHistory),
        fork(watchGetTobaccoHistory),
        fork(watchDeleteTobaccoHistory),
    ]);
}
export default tobaccoSaga;