import api from './api'
import apiCep from './apiCep';

export const findLocalCep = async (cep) => {
    try {
        const response = await apiCep.get(`/${cep}/json/`);
        return response.data; 
    } catch (error) {
        console.error(error.message);
        throw error; 
    }
} 

export const createLocal = async (local) => {
    try {
        const response = await api.post('/local', local);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}


export const findAllLocals = async (limit, offset) => {
    try {
        const response = await api.get(`/locals?${limit}&offset=${offset}`);
        return response.data; 
    } catch(error) {
        console.error(error.message);
        throw error; 
    }
}

export const findLocalById = async (id) => {
    try {
        const response = await api.get(`/local/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    } 
}


export const updateLocal = async (id, local) => {
    try {
        const response = await api.put(`/local/${id}`, local);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}

export const deleteLocal = async (id) => {
    try {
        const response = await api.delete(`/local/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}