import axios from "axios";

const API = axios.create({
    baseURL: "https://freelancer-backend-theta.vercel.app/api/auth/login"
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;