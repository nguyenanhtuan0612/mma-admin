import axios from 'axios';

function login(phone, password) {
    const url = `${process.env.BACKEND_URL}/auth`;
    return axios.post(url, {
        phone,
        password,
    });
}

async function checkToken() {
    try {
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
        const data = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        if (!data) return;
        return data;
    } catch (error) {
        console.log(1);
        return error;
    }
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

async function exportData(path, filter = null, sort = null, start = 0, limit = 10) {
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
        let url = `${process.env.BACKEND_URL}/${path}/export?start=${start}&limit=${limit}&sort=${sort}`;
        if (filter) {
            url = `${process.env.BACKEND_URL}/${path}/export?start=${start}&limit=${limit}&filter=${filter}&sort=${sort}`;
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

async function createData(path, body) {
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
        const url = `${process.env.BACKEND_URL}/${path}`;
        return axios.post(url, body, {
            headers: {
                Authorization: token,
            },
        });
    } catch (error) {
        return error;
    }
}

async function uploadFile(path, file) {
    try {
        const token = window.localStorage.getItem('accessToken');
        const body = new FormData();
        body.append('file', file);
        const url = `${process.env.BACKEND_URL}/upload/${path}`;
        const data = await axios.post(url, body, {
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

export default { login, checkToken, getListData, updateData, detailData, deleteData, uploadFile, createData, exportData };
