import test from 'tape';

import { createMockTask } from '@redux-saga/testing-utils';
import { call, put, fork, take, cancel } from 'redux-saga/effects';
import { loginSaga, authorize } from '../src/login.js';
import { login, logout, saveToken, clearToken } from '../src/user.js';

test('login saga: success case', (t) => {
    const iterator = loginSaga();
    t.deepEqual(
        iterator.next().value,
        take('LOGIN_REQUEST'),
        'login saga should yield an Effect take(LOGIN_REQUEST)',
    );
    const loginRequestAction = {
        type: 'LOGIN_REQUEST',
        payload: { user: 'test', password: '123' },
    };
    t.deepEqual(
        iterator.next(loginRequestAction).value,
        fork(authorize, 'test', '123'),
        'login saga should yield an Effect fork(authorize)',
    );
    t.deepEqual(
        iterator.next().value,
        take(['WHATCH_DOG', 'LOGIN_ERROR', 'LOGIN_SUCCESS']),
        'login saga should yield an Effect take(some actions)',
    );
    const successLoginAction = { type: 'LOGIN_SUCCESS' };
    t.deepEqual(
        iterator.next(successLoginAction).value,
        take('LOGOUT'),
        'login saga should yield an Effect take(LOGOUT)',
    );
    const logoutAction = { type: 'LOGOUT' };
    t.deepEqual(
        iterator.next(logout).value,
        call(clearToken),
        'login saga should yield an Effect call(clearToken)',
    );
    t.equal(iterator.next().done, false, 'should not finish generator');
    t.end();
});

test('login saga: error case', (t) => {
    const iterator = loginSaga();
    t.deepEqual(
        iterator.next().value,
        take('LOGIN_REQUEST'),
        'login saga should yield an Effect take(LOGIN_REQUEST)',
    );
    const loginRequestAction = {
        type: 'LOGIN_REQUEST',
        payload: { user: 'test', password: '123' },
    };
    const loginTask = fork(authorize, 'test', '123');
    t.deepEqual(
        iterator.next(loginRequestAction).value,
        loginTask,
        'login saga should yield an Effect fork(authorize)',
    );
    const mockTask = createMockTask();
    t.deepEqual(
        iterator.next(mockTask).value,
        take(['WHATCH_DOG', 'LOGIN_ERROR', 'LOGIN_SUCCESS']),
        'login saga should yield an Effect take(some actions)',
    );
    const errorLoginAction = { type: 'LOGIN_ERROR' };
    t.deepEqual(
        iterator.next(errorLoginAction).value,
        cancel(mockTask),
        'login saga should yield an Effect cancel(loginTask)',
    );
    const logoutAction = { type: 'LOGOUT' };
    t.deepEqual(
        iterator.next(logout).value,
        call(clearToken),
        'login saga should yield an Effect call(clearToken)',
    );
    t.equal(iterator.next().done, false, 'should not finish generator');
    t.end();
});
