import api from "./api"

const findAllRoles = async () => {
    try {
        const response = await api.get(`/roles`)
        return response.data
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const createRole = async (data) => {
    try {
        const response = await api.post("/role", data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

const getRoleById = async (id) => {
    try {
        const response = await api.get(`/role/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

const deleteRoleById = async (id) => {
    try {
        const response = await api.delete(`/role/${id}`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

const updateRole = async (id, data) => {
    try {
        const response = await api.put(`/role/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export { findAllRoles, createRole, getRoleById, deleteRoleById, updateRole }
