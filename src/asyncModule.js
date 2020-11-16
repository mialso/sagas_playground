import { take, fork, spawn, put, call, cancelled } from 'redux-saga/effects';
import { getModule } from './data';

function myModule() {
    const element = document.createElement('div');
    element.innerHTML = '<h3>my module</h3>';
    element.onclick = () => store.dispatch({ type: 'START_MODULE', meta: { key: 'myModule' } });
    return element;
}

function myModuleButton() {
    const element = document.createElement('button');
    element.innerHTML = 'my module button';
    element.onclick = () => store.dispatch({ type: 'RES_FETCH_REQUEST' });
    return element;
}

const modules = {
    myModule: {
        key: 'myModule',
        actionSelector(action) {
            if (action.type === 'MY_MODULE_RUN') {
                return true;
            }
            return false;
        },
        run() {
            document.getElementById('app').appendChild(myModule());
            document.getElementById('app').appendChild(myModuleButton());
            console.info('MY_MODULE:[RUN]');
        },
        task: null,
    },
};

const moduleLoadSuccess = key => ({ type: 'MODULE_LOAD_SUCCESS', meta: { key } });
const moduleLoadFail = (key, message) => ({ type: 'MODULE_LOAD_FAIL', error: message, meta: { key } });
const moduleLoadCancell = key => ({ type: 'MODULE_LOAD_CANCELL', meta: { key } });

const moduleStarted = key => ({ type: 'MODULE_STARTED', meta: { key } });
const moduleDone = key => ({ type: 'MODULE_DONE', meta: { key } });
const moduleCancell = key => ({ type: 'MODULE_CANCELL', meta: { key } });

const moduleActionRunner = actionSelector => (action) => {
    const isModuleAction = actionSelector(action);
    return isModuleAction;
};

const isModuleLoadSuccess = moduleKey => (action) => {
    if (action.type === 'MODULE_LOAD_SUCCESS' && action.meta.key === moduleKey) {
        return true;
    }
    return false;
};

export function* getAsyncModule(moduleKey) {
    try {
        yield call(getModule, modules[moduleKey], 2000);
        yield put(moduleLoadSuccess(moduleKey));
    } catch (e) {
        yield put(moduleLoadFail(moduleKey, e.message));
    } finally {
        if (yield cancelled()) {
            yield put(moduleLoadCancell(moduleKey));
        }
    }
}

export function* runAsyncModule(module) {
    yield put(moduleStarted(module.key));
    while (true) {
        const action = yield take(moduleActionRunner(module.actionSelector));
        if (cancelled(action)) {
            yield put(moduleCancell(module.key));
            break;
        }
        module.run(action);
    }
}

export function* moduleSaga(action) {
    const moduleKey = action.meta.key;
    yield fork(getAsyncModule, moduleKey);
    const module = yield take(isModuleLoadSuccess(moduleKey));
    modules[moduleKey].task = yield spawn(runAsyncModule, module);
}
