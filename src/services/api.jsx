import axios from 'axios';

const api = axios.create({
    baseURL: 'https://eventos-app-dev.kdore.com.br/api'
});

export default api;