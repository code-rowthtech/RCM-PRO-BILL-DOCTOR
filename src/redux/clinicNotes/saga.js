import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ClinicNotesActionTypes } from './constants';
import {  createAllergyApi, createProblemApi, createTaskApi, getAllergiesOfAPatientApi, getAllergyDetailsApi, getClinicEmployeesApi, getPatientAppointmentsApi, getPatientProblemsApi, getProblemDetailsApi, getSearchCodesApi, getTaskApi, getTaskDetailsApi, updateAllergyApi, updateProblemsApi, updateTaskApi,  } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getClinicEmployeesFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_LOADING,
            payload: {},
        });
        const response = yield call(getClinicEmployeesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR,
            payload: error,
        });
    }
}

function* createTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.CREATE_TASK_LOADING,
            payload: {},
        });
        const response = yield call(createTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.CREATE_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.CREATE_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.CREATE_TASK_ERROR,
            payload: error,
        });
    }
}

function* getTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_LOADING,
            payload: {},
        });
        const response = yield call(getTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_ERROR,
            payload: error,
        });
    }
}

function* updateTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.UPDATE_TASK_LOADING,
            payload: {},
        });
        const response = yield call(updateTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.UPDATE_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.UPDATE_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.UPDATE_TASK_ERROR,
            payload: error,
        });
    }
}

function* getTaskDetailsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getTaskDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR,
            payload: error,
        });
    }
}

function* createProblemFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.CREATE_PROBLEM_LOADING,
            payload: {},
        });
        const response = yield call(createProblemApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.CREATE_PROBLEM_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.CREATE_PROBLEM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.CREATE_PROBLEM_ERROR,
            payload: error,
        });
    }
}

function*getPatientProblemsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_ERROR,
            payload: error,
        });
    }
}

function* updateProblemsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.UPDATE_PROBLEM_LOADING,
            payload: {},
        });
        const response = yield call(updateProblemsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.UPDATE_PROBLEM_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.UPDATE_PROBLEM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.UPDATE_PROBLEM_ERROR,
            payload: error,
        });
    }
}

function* getProblemDetailsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_PROBLEM_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getProblemDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_PROBLEM_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_PROBLEM_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_PROBLEM_DETAILS_ERROR,
            payload: error,
        });
    }
}

function* getSearchCodesFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_SEARCH_CODES_LOADING,
            payload: {},
        });
        const response = yield call(getSearchCodesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_SEARCH_CODES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_SEARCH_CODES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_SEARCH_CODES_ERROR,
            payload: error,
        });
    }
}

function* getPatientAppointmentsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_ERROR,
            payload: error,
        });
    }
}

function* createAllergyFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.CREATE_ALLERGY_LOADING,
            payload: {},
        });
        const response = yield call(createAllergyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.CREATE_ALLERGY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.CREATE_ALLERGY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.CREATE_ALLERGY_ERROR,
            payload: error,
        });
    }
}

function* getAllergyDetailsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_ALLERGY_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getAllergyDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_ALLERGY_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_ALLERGY_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_ALLERGY_DETAILS_ERROR,
            payload: error,
        });
    }
}

function* getAllergiesOfAPatientFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING,
            payload: {},
        });
        const response = yield call(getAllergiesOfAPatientApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
            payload: error,
        });
    }
}

function* updateAllergyFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.UPDATE_ALLERGY_LOADING,
            payload: {},
        });
        const response = yield call(updateAllergyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.UPDATE_ALLERGY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.UPDATE_ALLERGY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.UPDATE_ALLERGY_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: ClinicNotesActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });

}


export function* watchClinicEmployees() {
    yield takeEvery(ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES, getClinicEmployeesFunction);
}

export function* watchCreateTask() {
    yield takeEvery(ClinicNotesActionTypes.CREATE_TASK, createTaskFunction);
}

export function* watchGetTask() {
    yield takeEvery(ClinicNotesActionTypes.GET_TASK, getTaskFunction);
}

export function* watchUpdateTask() {
    yield takeEvery(ClinicNotesActionTypes.UPDATE_TASK, updateTaskFunction);
}

export function* watchGetTaskDetails() {
    yield takeEvery(ClinicNotesActionTypes.GET_TASK_DETAILS, getTaskDetailsFunction);
}

export function* watchCreateProblem() {
    yield takeEvery(ClinicNotesActionTypes.CREATE_PROBLEM, createProblemFunction);
}

export function* watchGetPatientProblems() {
    yield takeEvery(ClinicNotesActionTypes.GET_PATIENT_PROBLEMS, getPatientProblemsFunction);
}

export function* watchUpdateProblems() {
    yield takeEvery(ClinicNotesActionTypes.UPDATE_PROBLEM, updateProblemsFunction);
}

export function* watchGetProblemDetails() {
    yield takeEvery(ClinicNotesActionTypes.GET_PROBLEM_DETAILS, getProblemDetailsFunction);
}

export function* watchGetSearchCodes() {
    yield takeEvery(ClinicNotesActionTypes.GET_SEARCH_CODES, getSearchCodesFunction);
}

export function* watchGetPatientAppointments() {
    yield takeEvery(ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS, getPatientAppointmentsFunction);
}

export function* watchCreateAllergy() {
    yield takeEvery(ClinicNotesActionTypes.CREATE_ALLERGY, createAllergyFunction);
}

export function* watchGetAllergyDetails() {
    yield takeEvery(ClinicNotesActionTypes.GET_ALLERGY_DETAILS, getAllergyDetailsFunction);
}

export function* watchGetAllergiesOfAPatient() {
    yield takeEvery(ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT, getAllergiesOfAPatientFunction);
}

export function* watchUpdateAllergy() {
    yield takeEvery(ClinicNotesActionTypes.UPDATE_ALLERGY, updateAllergyFunction);
}

function* clinicNotesSaga() {
    yield all([
        fork(watchClinicEmployees),
        fork(watchCreateTask),
        fork(watchGetTask),
        fork(watchUpdateTask),
        fork(watchGetTaskDetails),
        fork(watchCreateProblem),
        fork(watchGetPatientProblems),
        fork(watchUpdateProblems),
        fork(watchGetProblemDetails),
        fork(watchGetSearchCodes),
        fork(watchGetPatientAppointments),
        fork(watchCreateAllergy),
        fork(watchGetAllergyDetails),
        fork(watchGetAllergiesOfAPatient),
        fork(watchUpdateAllergy),

    ]);
}
export default clinicNotesSaga;