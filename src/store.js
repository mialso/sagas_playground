import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { getData } from './data';

const initialState = {
    data: '',
    error: '',
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
    }
    return state;
}

function* dataSaga(action) {
    try {
        const data = yield call(getData, 3000);
        yield put({ type: 'DATA_FETCH_SUCCESS', payload: { data } });
    } catch (e) {
        yield put({ type: 'DATA_FETCH_FAIL', payload: { message: e.message } });
    }
}

function* rootSaga() {
    yield takeEvery('DATA_FETCH_REQUEST', dataSaga);
}

export function initStore() {
    const sagaMiddleware = createSagaMiddleware();

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

    sagaMiddleware.run(rootSaga);

    return store;
}
