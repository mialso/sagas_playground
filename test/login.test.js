import test from 'tape';

import { createMockTask, cloneableGenerator } from '@redux-saga/testing-utils';
import {
    call, fork, take, cancel,
} from 'redux-saga/effects';
import { loginSaga, authorize } from '../src/login';
import { clearToken } from '../src/user';

test('login saga: success case', (t) => {
    // migrate to cloneableGenerator
    // const iterator = loginSaga();
    const iterator = cloneableGenerator(loginSaga)();
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
    const mockTask = createMockTask();
    t.deepEqual(
        iterator.next(mockTask).value,
        take(['WHATCH_DOG', 'LOGIN_ERROR', 'LOGIN_SUCCESS']),
        'login saga should yield an Effect take(some actions)',
    );
    t.test('success login case: ', (tt) => {
        const restIterator = iterator.clone();
        const successLoginAction = { type: 'LOGIN_SUCCESS' };
        tt.deepEqual(
            restIterator.next(successLoginAction).value,
            take('LOGOUT'),
            'login saga should yield an Effect take(LOGOUT)',
        );
        const logoutAction = { type: 'LOGOUT' };
        tt.deepEqual(
            restIterator.next(logoutAction).value,
            call(clearToken),
            'login saga should yield an Effect call(clearToken)',
        );
        tt.equal(restIterator.next().done, false, 'should not finish generator');
        tt.end();
    });
    t.test('error login case: ', (tt) => {
        const restIterator = iterator.clone();
        const errorLoginAction = { type: 'LOGIN_ERROR' };
        tt.deepEqual(
            restIterator.next(errorLoginAction).value,
            cancel(mockTask),
            'login saga should yield an Effect cancel(loginTask)',
        );
        const logoutAction = { type: 'LOGOUT' };
        tt.deepEqual(
            restIterator.next(logoutAction).value,
            call(clearToken),
            'login saga should yield an Effect call(clearToken)',
        );
        tt.equal(restIterator.next().done, false, 'should not finish generator');
        tt.end();
    });
    t.end();
});
