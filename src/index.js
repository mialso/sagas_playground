import printMe from './print.js';

import './style.css';
import MyImg from './me.jpg';

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

document.getElementById('app').appendChild(component());
document.getElementById('app').appendChild(btn());
