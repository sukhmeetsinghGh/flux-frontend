import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("token", token);
    console.log("Request sent with config:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
