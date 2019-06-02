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

function dataComponent() {
    const element = document.createElement('div');
    element.innerHTML = 'no data available';
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

const dataRenderer = dataComponent();

document.getElementById('app').appendChild(component());
document.getElementById('app').appendChild(btn());
document.getElementById('app').appendChild(btn2());
document.getElementById('app').appendChild(dataRenderer);

store.subscribe(dataChangeHandler(dataRenderer));
