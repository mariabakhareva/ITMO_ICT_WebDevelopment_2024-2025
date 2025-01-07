import axios from "axios";
import TokenStore from "./TokenStore";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
});

// Интерцептор для добавления токена
axiosInstance.interceptors.request.use(
    (config) => {
        const token = TokenStore.getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
