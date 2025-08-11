// @flow
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';

import {
    login as loginApi,
    logout as logoutApi,
    signup as signupApi,
    forgotPassword as forgotPasswordApi,
    forgotPasswordConfirm,
} from '../../helpers/';

import { APICore, setAuthorization } from '../../helpers/api/apiCore';
import { authApiResponseSuccess, authApiResponseError } from './actions';
import { AuthActionTypes } from './constants';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload }) {
    try {
        const encryptedPayload = {
            key: encryptMessage(payload)
        }
        const response = yield call(loginApi, encryptedPayload);

        if (!response?.data?.data) {
            throw new Error('Invalid response data');
        }

        const decryptedData = decryptMessage(response.data.data);
        if (!decryptedData) {
            throw new Error('Failed to decrypt response data');
        }

        const user = JSON.parse(decryptedData);
        if (!user) {
            throw new Error('Invalid user data');
        }

        const userData = {
            name: user?.name || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            token: user?.accessToken || '',
            role: user?.role || '',
            userId: user?.userId || '',
            doctorId: user?.doctorId || '',
            logo: user?.photo || '',
            clinicId: user?.clinicId || ''
        }

        api.setLoggedInUser(userData);
        setAuthorization(userData.token);

        yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, userData));
    } catch (error) {
        const errorMessage = error?.message || 'Login failed';
        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, errorMessage));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

/**
 * Logout the user
 */
function* logout() {
    try {
        yield call(logoutApi);
        api.setLoggedInUser(null);
        setAuthorization(null);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    }
}

function* signup({ payload: { fullname, email, password } }) {
    try {
        const response = yield call(signupApi, { fullname, email, password });
        const user = response.data;
        // api.setLoggedInUser(user);
        // setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* forgotPassword({ payload }) {
    try {
        const encryptedPayload = {
            key: encryptMessage(payload)
        }
        const response = yield call(forgotPasswordApi, encryptedPayload);
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, decryptMessage(response?.data?.data)));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}

function* forgotPasswordChange({ payload }) {
    const { token, newPassword } = payload;

    const passwordPayload = {
        newPassword: newPassword
    }
    const encryptedNewPassword = {
        key: encryptMessage(passwordPayload)
    }

    try {
        setAuthorization(token)
        const response = yield call(forgotPasswordConfirm, encryptedNewPassword);
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD_CHANGE, response.data));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD_CHANGE, error));
    }
}

export function* watchLoginUser(): any {
    yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout(): any {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

export function* watchForgotPasswordChange(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD_CHANGE, forgotPasswordChange);
}

function* authSaga(): any {
    yield all([
        fork(watchLoginUser),
        fork(watchLogout),
        fork(watchSignup),
        fork(watchForgotPassword),
        fork(watchForgotPasswordChange),
    ]);
}

export default authSaga;
