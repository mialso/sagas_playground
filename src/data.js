export function getData(timeout = 1000) {
    return new Promise(resolve => setTimeout(() => resolve('some data'), timeout));
}

export function getResource(id, timeout = 1000) {
    return new Promise(resolve => setTimeout(() => resolve(`${id} data`), timeout));
}
