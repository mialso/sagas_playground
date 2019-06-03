export function login(user, password, timeout = 1000) {
    if (password !== '123') {
        return new Promise((resolve, reject) => setTimeout(() => reject('invalid password'), timeout));
    }
    return new Promise(resolve => setTimeout(() => resolve(`${user}token`), timeout));
}

export function logout() {
    return new Promise(resolve => setTimeout(() => resolve('OK'), 1000));
}

export function saveToken(token) {
    return sessionStorage.setItem('token', JSON.stringify(token));
}

export function clearToken() {
    return sessionStorage.removeItem('token');
}
