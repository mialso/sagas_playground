import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { login, logout, saveToken, clearToken } from './user.js';

export function* authorize(user, password) {
    try {
        const token = yield call(login, user, password);
        yield put({ type: 'LOGIN_SUCCESS', payload: { token } });
        yield call(saveToken, token);
    } catch (e) {
        yield put({ type: 'LOGIN_ERROR', error });
    } finally {
        if (yield cancelled()) {
            // do smth on cancell
        }
    }
}

export function* loginSaga() {
    while (true) {
        const { payload: { user, password } } = yield take('LOGIN_REQUEST');
        const loginTask = yield fork(authorize, user, password);
        const action = yield take(['WHATCH_DOG', 'LOGIN_ERROR', 'LOGIN_SUCCESS']);
        if (action.type !== 'LOGIN_SUCCESS') {
            yield cancel(loginTask);
            yield call(clearToken);
        }
        yield take('LOGOUT');
        yield call(clearToken);
    }
}
