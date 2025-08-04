import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { PatientDocumentsActionTypes } from './constants';

import ToastHandle from '../../helpers/ToastMessage';
import { decryptMessage } from '../../cryptoUtils';
import { deleteDocumentsApi, getDocumentsApi, getDocumentsByIdApi, updateDocumentsApi, uploadDocumentsApi } from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* uploadDocumentsFunction(data) {
    try {
        yield put({
            type: PatientDocumentsActionTypes.UPLOAD_DOCUMENTS_LOADING,
            payload: {},
        });
        const response = yield call(uploadDocumentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientDocumentsActionTypes.UPLOAD_DOCUMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: PatientDocumentsActionTypes.UPLOAD_DOCUMENTS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: PatientDocumentsActionTypes.UPLOAD_DOCUMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientDocumentsActionTypes.CREATE_DOCUMENTS_ERROR,
            payload: error,
        });
    }
}


function* updateDocumentsFunction(data) {
    try {
        yield put({
            type: PatientDocumentsActionTypes.UPDATE_DOCUMENTS_LOADING,
            payload: {},
        });
        const response = yield call(updateDocumentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientDocumentsActionTypes.UPDATE_DOCUMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: PatientDocumentsActionTypes.UPDATE_DOCUMENTS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: PatientDocumentsActionTypes.UPDATE_DOCUMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientDocumentsActionTypes.UPDATE_DOCUMENTS_ERROR,
            payload: error,
        });
    }
}

function* deleteDocumentsFunction(data) {
    try {
        yield put({
            type: PatientDocumentsActionTypes.DELETE_DOCUMENTS_LOADING,
            payload: {},
        });
        const response = yield call(deleteDocumentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientDocumentsActionTypes.DELETE_DOCUMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: PatientDocumentsActionTypes.DELETE_DOCUMENTS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: PatientDocumentsActionTypes.DELETE_DOCUMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientDocumentsActionTypes.DELETE_DOCUMENTS_ERROR,
            payload: error,
        });
    }
}

function* getDocumentsFunction(data) {
    try {
        yield put({
            type: PatientDocumentsActionTypes.GET_DOCUMENTS_LOADING,
            payload: {},
        });
        const response = yield call(getDocumentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientDocumentsActionTypes.GET_DOCUMENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientDocumentsActionTypes.GET_DOCUMENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientDocumentsActionTypes.GET_DOCUMENTS_ERROR,
            payload: error,
        });
    }
}
function* getDocumentsByIdFunction(data) {
    try {
        yield put({
            type: PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getDocumentsByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID_ERROR,
            payload: error,
        });
    }
}




export function* watchUploadDocuments() {
    yield takeEvery(PatientDocumentsActionTypes.UPLOAD_DOCUMENTS, uploadDocumentsFunction);
}

export function* watchUpdateDocuments() {
    yield takeEvery(PatientDocumentsActionTypes.UPDATE_DOCUMENTS, updateDocumentsFunction);
}
export function* watchDeleteDocuments() {
    yield takeEvery(PatientDocumentsActionTypes.DELETE_DOCUMENTS, deleteDocumentsFunction);
}

export function* watchGetDocuments() {
    yield takeEvery(PatientDocumentsActionTypes.GET_DOCUMENTS, getDocumentsFunction);
}

export function* watchGetDocumentsById() {
    yield takeEvery(PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID, getDocumentsByIdFunction);
}

function* patientDocumentsSaga() {
    yield all([
        fork(watchUploadDocuments),
        fork(watchUpdateDocuments),
        fork(watchGetDocuments),
        fork(watchGetDocumentsById),
        fork(watchDeleteDocuments),
    ]);
}
export default patientDocumentsSaga;