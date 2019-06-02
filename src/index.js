import printMe from './print';
import { initStore } from './store';

import './style.css';
import MyImg from './me.jpg';

const store = initStore();

function component() {
    const element = document.createElement('div');

    element.innerHTML = "some sample text";
    element.classList.add('red');

    const myImg = new Image();
    myImg.src = MyImg;
    element.appendChild(myImg);

    return element;
}

function btn() {
    const element = document.createElement('button');
    element.innerHTML = 'print button';
    element.onclick = printMe;
    return element;
}

function btn2() {
    const element = document.createElement('button');
    element.innerHTML = 'data button';
    element.onclick = () => store.dispatch({ type: 'DATA_FETCH_REQUEST'});
    return element;
}

function btn3() {
    const element = document.createElement('button');
    element.innerHTML = 'increment button';
    element.onclick = () => store.dispatch({ type: 'COUNTER_UP'});
    return element;
}

function dataComponent() {
    const element = document.createElement('div');
    element.innerHTML = 'no data available';
    return element;
}

function counterComponent(num) {
    const element = document.createElement('div');
    element.innerHTML = `current num: ${num}`;
    return element;
}

const dataChangeHandler = element => () => {
    const state = store.getState();
    if (state.data) {
        element.innerHTML = state.data;
    }
    if (state.error) {
        element.innerHTML = state.error;
    }
}

const counterChangeHandler = element => () => {
    const state = store.getState();
    element.innerHTML = `current num: ${state.counter}`;
}

const dataRenderer = dataComponent();
const counterRenderer = counterComponent(store.getState().counter);

document.getElementById('app').appendChild(component());
document.getElementById('app').appendChild(btn());
document.getElementById('app').appendChild(btn2());
document.getElementById('app').appendChild(btn3());
document.getElementById('app').appendChild(dataRenderer);
document.getElementById('app').appendChild(counterRenderer);

store.subscribe(dataChangeHandler(dataRenderer));
store.subscribe(counterChangeHandler(counterRenderer));
