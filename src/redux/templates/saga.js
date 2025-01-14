import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { TemplateActionTypes } from './constants';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { getTemplateApi } from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getTemplateFunction(data) {
    try {
        yield put({
            type: TemplateActionTypes.GET_TEMPLATE_LOADING,
            payload: {},
        });
        const response = yield call(getTemplateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: TemplateActionTypes.GET_TEMPLATE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: TemplateActionTypes.GET_TEMPLATE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TemplateActionTypes.GET_TEMPLATE_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: TemplateActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetPatients() {
    yield takeEvery(TemplateActionTypes.GET_TEMPLATE, getTemplateFunction);
}



export function* watchresetState() {
    yield takeEvery(TemplateActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* TemplateSaga() {
    yield all([
        fork(watchGetPatients),
        fork(watchresetState)
    ]);
}
export default TemplateSaga;
