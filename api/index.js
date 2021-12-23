import Axios from "axios";
import { API_SERVER } from "../config/constant";

const axios = Axios.create({
  baseURL: `${API_SERVER}`,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use(
  (config) => {
    return Promise.resolve(config);
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    console.log(response);
    if (response.statusCode === 401) {
      return history.push("/logout");
    }
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
