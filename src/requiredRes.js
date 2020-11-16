import { fork, put, delay, cancelled, cancel } from 'redux-saga/effects';
import { getResource } from './data';

function taskStartAction(id) {
    return {
        type: `${id}_START`,
    };
}
function taskErrorAction(id, message = 'error') {
    return {
        type: `${id}_ERROR`,
        payload: { message },
    };
}

function taskCancelAction(id, message = 'cancelled') {
    return {
        type: `${id}_CANCEL`,
        payload: { message },
    };
}

function taskSuccessAction(id, data = '') {
    return {
        type: `${id}_SUCCESS`,
        payload: { data },
    };
}

function* resource(id, timeout) {
    try {
        yield put(taskStartAction(id));
        const data = yield getResource(id, timeout);
        yield put(taskSuccessAction(id, data));
    } catch(e) {
        console.info(`ERROR: ${e.message}`)
        yield put(taskErrorAction(id));
    } finally {
        if (yield cancelled()) {
            yield put(taskCancelAction(id));
        }
    }
}

export function* forkComposer() {
    yield fork(resource, 'RES_ONE', 900);
    yield fork(resource, 'RES_TWO', 1900);
    const t3 = yield fork(resource, 'RES_THREE', 2900);
    yield delay(2000);
    // throw new Error('awesome');
    // yield put({ type: 'COMPOSER_DONE' });
    yield cancel(t3);
}

export function* composerWrapper() {
    try {
        yield forkComposer();
    } catch (e) {
        yield put({ type: 'FORK_COMPOSER_DOWN', payload: { message: e.message } });
    } finally {
        yield put({ type: 'FORK_COMPOSER_FIN' });
    }
}
