import axios from 'axios';

const getRequest = async (backendserver, url) => {
    try {
        let response = await axios.get(backendserver+url);
       
        return response.data
    } catch (e) {
        console.log(e);   
    }
}

export function httpRequest (backendserver, url, method, data) {
    if (method === 'GET') {
        return getRequest(backendserver, url)
    }
}

export default httpRequest