import api from './api'

export const createUser = async (user) => {
    try {
        const response = await api.post('/user', user);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}

export const findAllUsers = async (limit, offset) => {
    try {
        const response = await api.get(`/users?limit=${limit}&offset=${offset}`);
        return response.data; 
    } catch(error) {
        console.error(error.message);
        throw error; 
    }
}


export const findUserById = async (id) => {
    try {
        const response = await api.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    } 
}


export const updateUser = async (id, user) => {
    try {
        const response = await api.put(`/user/${id}`, user);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}