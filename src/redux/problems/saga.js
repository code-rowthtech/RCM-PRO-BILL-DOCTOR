import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { ProblemsActionTypes } from './constants';
import { createProblemsApi, deleteProblemsApi, getAllCodeApi, getPatientAppointmentsAllApi, getProblemsApi, getProblemsByIdApi, updateProblemsApi } from './api';

/**
 * Login the user
 * @param {*} payload - username and password
 */

function* getProblemsFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.GET_PROBLEMS_LOADING,
            payload: {},
        });
        const response = yield call(getProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ProblemsActionTypes.GET_PROBLEMS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemsActionTypes.GET_PROBLEMS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ProblemsActionTypes.GET_PROBLEMS_ERROR,
            payload: error,
        });
    }
}

function* createProblemsFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.CREATE_PROBLEMS_LOADING,
            payload: {},
        });
        const response = yield call(createProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemsActionTypes.CREATE_PROBLEMS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemsActionTypes.CREATE_PROBLEMS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemsActionTypes.CREATE_PROBLEMS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemsActionTypes.CREATE_PROBLEMS_ERROR,
            payload: error,
        });
    }
}

function* deleteProblemsFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.DELETE_PROBLEMS_LOADING,
            payload: {},
        });
        const response = yield call(deleteProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response?.status === 200) {
            ToastHandle(decryptedData?.message, 'danger');
            yield put({
                type: ProblemsActionTypes.DELETE_PROBLEMS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemsActionTypes.DELETE_PROBLEMS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemsActionTypes.DELETE_PROBLEMS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemsActionTypes.DELETE_PROBLEMS_ERROR,
            payload: error,
        });
    }
}
function* updateProblemsFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.UPDATE_PROBLEMS_LOADING,
            payload: {},
        });
        const response = yield call(updateProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemsActionTypes.UPDATE_PROBLEMS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemsActionTypes.UPDATE_PROBLEMS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemsActionTypes.UPDATE_PROBLEMS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemsActionTypes.UPDATE_PROBLEMS_ERROR,
            payload: error,
        });
    }
}

function* getAllCodesFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.ALL_CODES_LOADING,
            payload: {},
        });
        const response = yield call(getAllCodeApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ProblemsActionTypes.ALL_CODES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemsActionTypes.ALL_CODES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ProblemsActionTypes.ALL_CODES_ERROR,
            payload: error,
        });
    }
}

function* getPatientAppointmentFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.GET_PATIENT_APPOINTMENTS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientAppointmentsAllApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: ProblemsActionTypes.GET_PATIENT_APPOINTMENTS_SUCCESS,
                payload: decryptedData, // ✅ FIXED
            });
        } else {
            yield put({
                type: ProblemsActionTypes.GET_PATIENT_APPOINTMENTS_ERROR,
                payload: decryptedData,
            });
        }
    } catch (error) {
        yield put({
            type: ProblemsActionTypes.GET_PATIENT_APPOINTMENTS_ERROR,
            payload: error,
        });
    }
}

function* getProblemByIdFunction(data) {
    try {
        yield put({
            type: ProblemsActionTypes.GET_PROBLEM_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getProblemsByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemsActionTypes.GET_PROBLEM_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemsActionTypes.GET_PROBLEM_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemsActionTypes.GET_PROBLEM_BY_ID_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: ProblemsActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchGetProblems() {
    yield takeEvery(ProblemsActionTypes.GET_PROBLEMS, getProblemsFunction);
}

export function* watchCreateProblems() {
    yield takeEvery(ProblemsActionTypes.CREATE_PROBLEMS, createProblemsFunction);
}

export function* watchDeleteProblems() {
    yield takeEvery(ProblemsActionTypes.DELETE_PROBLEMS, deleteProblemsFunction);
}

export function* watchUpdateProblems() {
    yield takeEvery(ProblemsActionTypes.UPDATE_PROBLEMS, updateProblemsFunction);
}

export function* watchAllCode() {
    yield takeEvery(ProblemsActionTypes.ALL_CODES, getAllCodesFunction);
}

export function* watchPatientAppointment() {
    yield takeEvery(ProblemsActionTypes.GET_PATIENT_APPOINTMENTS, getPatientAppointmentFunction);
}

export function* watchProblemById() {
    yield takeEvery(ProblemsActionTypes.GET_PROBLEM_BY_ID, getProblemByIdFunction);
}
function* problemsSaga() {
    yield all([
        fork(watchGetProblems),
        fork(watchCreateProblems),
        fork(watchDeleteProblems),
        fork(watchUpdateProblems),
        fork(watchAllCode),
        fork(watchProblemById),
        fork(watchPatientAppointment),
    ]);
}
export default problemsSaga;
