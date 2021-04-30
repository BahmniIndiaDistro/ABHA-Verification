import axios from "axios";
import Config from "../config/config";

let axiosConfig = axios.create({
  baseURL: Config.BASE_URL,
  timeout: Config.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;
