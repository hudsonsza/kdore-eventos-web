import api from "./api";

export const login = async (user) => {
    try {
        const response = await api.post('/login', user);
        return response.data;
        } catch (error) {
            console.error(error.message)
            throw error;
        }
}