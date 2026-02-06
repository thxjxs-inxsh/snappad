import axios from "axios";

const api = axios.create({
  baseURL: "http://172.16.61.79:8080/api",
});

export default api;
