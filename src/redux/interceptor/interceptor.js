import axios from "axios";
// const url_DEV = process.env.VITE_URL_API;

const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_API,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

AxiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config;
    },
    error => {
        Promise.reject(error.response || error.message)
    }
);

AxiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        let originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.removeItem('token');
            localStorage.removeItem('voluntaria');
            window.location.href = '/login';
        }
        return Promise.reject(error.response || error.message);
    })

export default AxiosInstance
