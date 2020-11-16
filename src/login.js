import {
    take, call, put, fork, cancel, race, cancelled,
} from 'redux-saga/effects';
import {
    login, logout, saveToken, clearToken,
} from './user';

export function* authorize(user, password) {
    try {
        const token = yield call(login, user, password);
        yield put({ type: 'LOGIN_SUCCESS', payload: { token } });
        yield call(saveToken, token);
    } catch (e) {
        yield put({ type: 'LOGIN_ERROR', error: e.message });
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

export function* loginRaceSaga() {
    while (true) {
        const { payload: { user, password } } = yield take('LOGIN_REQUEST');
        const loginTask = yield fork(authorize, user, password);
        const { success, abort } = yield race({
            success: take('LOGIN_SUCCESS'),
            abort: take(['WHATCH_DOG', 'LOGIN_ERROR', 'LOGIN_SUCCESS']),
        });
        if (abort) {
            yield cancel(loginTask);
            yield call(clearToken);
        }
        yield take('LOGOUT');
        yield call(clearToken);
    }
}
