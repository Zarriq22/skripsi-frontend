import axios from 'axios';

// GET
const getRequest = async (baseUrl, url) => {
    try {
        const response = await axios.get(baseUrl + url, {
            withCredentials: true
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e
    }
};

// POST
const postRequest = async (baseUrl, url, data) => {
    try {
        const response = await axios.post(baseUrl + url, data, {
            withCredentials: true
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e
    }
};

// PUT
const putRequest = async (baseUrl, url, data) => {
    try {
        const response = await axios.put(baseUrl + url, data, {
            withCredentials: true
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e
    }
};

// DELETE
const deleteRequest = async (baseUrl, url) => {
    try {
        const response = await axios.delete(baseUrl + url, {
            withCredentials: true
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e
    }
};

export function httpRequest(baseUrl, endpoint, method, options = {}, data = {}) {
    let url = endpoint;

    // Tambahkan key/id jika ada
    if (options.key) {
        url = `${endpoint}/${options.key}`;
    }

    if (method === 'GET') {
        return getRequest(baseUrl, url);
    }

    if (method === 'POST') {
        return postRequest(baseUrl, url, options.values);
    }

    if (method === 'PUT') {
        return putRequest(baseUrl, url, options.values || data);
    }

    if (method === 'DELETE') {
        return deleteRequest(baseUrl, url);
    }

    console.warn('Method tidak dikenali:', method);
}

export default httpRequest