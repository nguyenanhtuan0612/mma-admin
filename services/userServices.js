import axios from 'axios';

function login(phone, password) {
    const url = `${process.env.BACKEND_URL}/auth`;
    return axios.post(url, {
        phone,
        password,
    });
}

async function checkToken() {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
        return {
            data: {
                statusCode: 400,
                message: 'Invalid Token',
            },
        };
    }
    const url = `${process.env.BACKEND_URL}/users/jwt`;
    return axios.get(url, {
        headers: {
            Authorization: token,
        },
    });
}

async function getData() {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
        return {
            data: {
                statusCode: 400,
                message: 'Invalid Token',
            },
        };
    }
    const url = `${process.env.BACKEND_URL}/users`;
    return axios.get(url, {
        headers: {
            Authorization: token,
        },
    });
}

export default { login, checkToken, getData };
