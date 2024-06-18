import api from "./api"


export const createCategory = async (data) => {
    try {
        const response = await api.post("/category", data);
        return response.data;
    } catch (error) {
        console.log("Error save category")
        console.error(error.message);
        throw error;
    }
}

export const getCategories = async (nome) => {
    try {
        const response = await api.get(`/categories?name=${nome}`);
        return response.data;
    } catch (error) {
        console.log("Error get categories")
        console.error(error.message);
        throw error;
    }
}

export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`/category/${id}`);
        return response.data;
    } catch (error) {
        console.log("Error get category by id")
        console.error(error.message);
        throw error;
    }
}


export const deleteCategoryById = async (id) => {
    try {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    } catch (error) {
        console.log("Esta categoria está associada a eventos e não pode ser excluída.")
        console.error(error.message);
        throw error;
    }
}

export const updateCategory = async (id, data) => {
    try {
        const response = await api.put(`/category/${id}`, data);
        return response.data;
    } catch (error) {
        console.log("Error update category")
        console.error(error.message);
        throw error;
    }
}

