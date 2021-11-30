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
                message: 'Token not found',
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
    try {
        const token = window.localStorage.getItem('accessToken');
        if (!sort) {
            sort = `[{"property":"createdAt","direction":"DESC"}]`;
        }
        if (!token) {
            return {
                data: {
                    statusCode: 404,
                    message: 'Invalid Token',
                },
            };
        }
        let url = `${process.env.BACKEND_URL}/${path}?start=${start}&limit=${limit}&sort=${sort}`;
        if (filter) {
            url = `${process.env.BACKEND_URL}/${path}?start=${start}&limit=${limit}&filter=${filter}&sort=${sort}`;
        }
        return axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
    } catch (error) {
        return error;
    }
}

async function detailData(path, id) {
    try {
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
            return {
                data: {
                    statusCode: 404,
                    message: 'Invalid Token',
                },
            };
        }
        const url = `${process.env.BACKEND_URL}/${path}/${id}`;
        const data = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return data;
    } catch (error) {
        return error;
    }
}

async function updateData(path, id, body) {
    try {
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
            return {
                data: {
                    statusCode: 404,
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
    } catch (error) {
        return error;
    }
}

async function deleteData(path, id) {
    try {
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
            return {
                data: {
                    statusCode: 404,
                    message: 'Invalid Token',
                },
            };
        }
        const url = `${process.env.BACKEND_URL}/${path}/${id}`;
        const data = await axios.delete(url, {
            headers: {
                Authorization: token,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default { login, checkToken, getListData, updateData, detailData, deleteData };
