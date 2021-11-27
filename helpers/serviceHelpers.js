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

async function getListData(path, filter = null, sort = null, start = 0, limit = 10) {
    const token = window.localStorage.getItem('accessToken');
    if (!sort) {
        sort = `[{"property":"createdAt","direction":"DESC"}]`;
    }
    if (!token) {
        return {
            data: {
                statusCode: 400,
                message: 'Invalid Token',
            },
        };
    }
    let url = `${process.env.BACKEND_URL}/${path}?start=${start}&limit=${limit}&sort=${sort}`;
    if (filter) {
        url = `${process.env.BACKEND_URL}/${path}?start=${start}&limit=${limit}&filter=${filter}&sort=${sort}`;
        console.log(url);
    }
    return axios.get(url, {
        headers: {
            Authorization: token,
        },
    });
}

async function updateData(path, id, body) {
    const token = window.localStorage.getItem('accessToken');
    if (!token) {
        return {
            data: {
                statusCode: 400,
                message: 'Invalid Token',
            },
        };
    }
    const url = `${process.env.BACKEND_URL}/${path}/${id}`;
    return axios.patch(url, body, {
        headers: {
            Authorization: token,
        },
    });
}

export default { login, checkToken, getListData, updateData };
