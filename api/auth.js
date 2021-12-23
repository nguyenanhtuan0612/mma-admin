import axios from 'axios';

async function login(email, password) {
    try {
        console.log(process.env.BACKEND_URL);
        const url = `${process.env.BACKEND_URL}/auth`;
        const data = await axios.post(url, {
            email,
            password,
        });
        if (!data) return;
        return data;
    } catch (error) {
        return error.response;
    }
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
        const url = `${process.env.BACKEND_URL}/auth/jwt`;
        const data = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        if (!data) return;
        return data;
    } catch (error) {
        return error.response;
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
        return error.response;
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
        return error.response;
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
        return error.response;
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
        return error.response;
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
        const data = await axios.post(url, body, {
            headers: {
                Authorization: token,
            },
        });
        return data;
    } catch (error) {
        return error.response;
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
        return error.response;
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
        return error.response;
    }
}

export default { login, checkToken, getListData, updateData, detailData, deleteData, uploadFile, createData, exportData };
