import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {
    call, put, takeEvery, select,
} from 'redux-saga/effects';
import { getData } from './data';
import { forkComposer, composerWrapper } from './requiredRes';

const initialState = {
    data: '',
    error: '',
    counter: 0,
};

function reducer(state = initialState, action) {
    switch (action.type) {
    case 'DATA_FETCH_SUCCESS': return {
        ...state,
        data: action.payload.data,
    };
    case 'DATA_FETCH_FAIL': return {
        ...state,
        error: action.payload.message,
    };
    case 'COUNTER_UP': return {
        ...state,
        counter: ++state.counter,
    };
    }
    return state;
}

export function* dataSaga(action) {
    try {
        const data = yield call(getData, 3000);
        yield put({ type: 'DATA_FETCH_SUCCESS', payload: { data } });
    } catch (e) {
        yield put({ type: 'DATA_FETCH_FAIL', payload: { message: e.message } });
    }
}

export function* counterSaga(action) {
    const state = yield select();
    yield put({ type: 'COUNTER_UP_DONE', payload: state.counter });
}

function* rootSaga() {
    yield takeEvery('DATA_FETCH_REQUEST', dataSaga);
    yield takeEvery('COUNTER_UP', counterSaga);
    yield takeEvery('RES_FETCH_REQUEST', composerWrapper);
}

export function initStore() {
    const monitor = window["__SAGA_MONITOR_EXTENSION__"];
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor: monitor });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

    sagaMiddleware.run(rootSaga);

    return store;
}
