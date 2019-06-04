import test from 'tape';
import { call, put } from 'redux-saga/effects';
import { dataSaga } from '../src/store';
import { getData } from '../src/data';

test('dataSaga: success case', (t) => {
    const iterator = dataSaga();
    t.deepEqual(
        iterator.next().value,
        call(getData, 3000),
        'data saga should yield an Effect call(getData, 3000)',
    );
    const testData = {};
    const testAction = { type: 'DATA_FETCH_SUCCESS', payload: { data: testData } };
    t.deepEqual(
        iterator.next(testData).value,
        put(testAction),
        'data saga should yield an Effect put with correct SUCCESS action',
    );
    t.end();
});

test('dataSaga: error case', (t) => {
    const iterator = dataSaga();
    t.deepEqual(
        iterator.next().value,
        call(getData, 3000),
        'data saga should yield an Effect call(getData, 3000)',
    );
    const error = { message: 'test error message' };
    const testAction = { type: 'DATA_FETCH_FAIL', payload: { message: error.message } };
    t.deepEqual(
        iterator.throw(error).value,
        put(testAction),
        'data saga should yield an Effect put with correct FAIL action',
    );
    t.end();
});
