import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://socialx-vm8q.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized – please login again");
    }
    return Promise.reject(err);
  }
);

export default API;
