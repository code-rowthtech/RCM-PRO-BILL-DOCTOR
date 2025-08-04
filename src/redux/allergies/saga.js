import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { AllergiesActionTypes } from './constants';
import {
    createAllergiesApi,
    updateAllergiesApi,
    getAllergiesApi,
    deleteAllergiesApi,
    getAllergyDetailsApi,
    getFoodAllergiesApi
} from './api';
import ToastHandle from '../../helpers/ToastMessage';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createAllergiesFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.CREATE_ALLERGIES_LOADING,
            payload: {},
        });
        const response = yield call(createAllergiesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergiesActionTypes.CREATE_ALLERGIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergiesActionTypes.CREATE_ALLERGIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergiesActionTypes.CREATE_ALLERGIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergiesActionTypes.CREATE_ALLERGIES_ERROR,
            payload: error,
        });
    }
}


function* updateAllergiesFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.UPDATE_ALLERGIES_LOADING,
            payload: {},
        });
        const response = yield call(updateAllergiesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergiesActionTypes.UPDATE_ALLERGIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergiesActionTypes.UPDATE_ALLERGIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergiesActionTypes.UPDATE_ALLERGIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AllergiesActionTypes.UPDATE_ALLERGIES_ERROR,
            payload: error,
        });
    }
}

function* deleteAllergiesFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.DELETE_ALLERGIES_LOADING,
            payload: {},
        });
        const response = yield call(deleteAllergiesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergiesActionTypes.DELETE_ALLERGIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergiesActionTypes.DELETE_ALLERGIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergiesActionTypes.DELETE_ALLERGIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AllergiesActionTypes.DELETE_ALLERGIES_ERROR,
            payload: error,
        });
    }
}

function* getAllergiesFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.GET_ALLERGIES_LOADING,
            payload: {},
        });
        const response = yield call(getAllergiesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: AllergiesActionTypes.GET_ALLERGIES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AllergiesActionTypes.GET_ALLERGIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AllergiesActionTypes.GET_ALLERGIES_ERROR,
            payload: error,
        });
    }
}

function* getAllergyDetailsFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.GET_ALLERGY_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getAllergyDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: AllergiesActionTypes.GET_ALLERGY_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AllergiesActionTypes.GET_ALLERGY_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AllergiesActionTypes.GET_ALLERGY_BY_ID_ERROR,
            payload: error,
        });
    }
}

function* getFoodAllergyFunction(data) {
    try {
        yield put({
            type: AllergiesActionTypes.GET_FOOD_ALLERGIES_LOADING,
            payload: {},
        });
        const response = yield call(getFoodAllergiesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: AllergiesActionTypes.GET_FOOD_ALLERGIES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AllergiesActionTypes.GET_FOOD_ALLERGIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AllergiesActionTypes.GET_FOOD_ALLERGIES_ERROR,
            payload: error,
        });
    }
}



export function* watchCreateAllergies() {
    yield takeEvery(AllergiesActionTypes.CREATE_ALLERGIES, createAllergiesFunction);
}

export function* watchUpdateAllergies() {
    yield takeEvery(AllergiesActionTypes.UPDATE_ALLERGIES, updateAllergiesFunction);
}
export function* watchDeleteAllergies() {
    yield takeEvery(AllergiesActionTypes.DELETE_ALLERGIES, deleteAllergiesFunction);
}

export function* watchGetAllergies() {
    yield takeEvery(AllergiesActionTypes.GET_ALLERGIES, getAllergiesFunction);
}
export function* watchGetAllergyById() {
    yield takeEvery(AllergiesActionTypes.GET_ALLERGY_BY_ID, getAllergyDetailsFunction);
}

export function* watchGetFoodAllergy() {
    yield takeEvery(AllergiesActionTypes.GET_FOOD_ALLERGIES, getFoodAllergyFunction);
}

function* allergiesSaga() {
    yield all([
        fork(watchCreateAllergies),
        fork(watchUpdateAllergies),
        fork(watchGetAllergies),
        fork(watchDeleteAllergies),
        fork(watchGetAllergyById),
        fork(watchGetFoodAllergy)
    ]);
}
export default allergiesSaga;