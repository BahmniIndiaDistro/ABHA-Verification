import axios from "axios";
import { useState, useEffect } from "react";
import axiosConfig from "../api/AxiosConfig";

const useAxiosLoader = () => {
  const [requestCounter, setRequestCounter] = useState(0);

  useEffect(() => {
    const updateRequestCounter = (config, value) =>
      config.supressLoader ||
      setRequestCounter((requestCounter) => requestCounter + value);

    const incrementCounter = (config) => updateRequestCounter(config, 1);
    const decrementCounter = (config) => updateRequestCounter(config, -1);

    const reqInterceptor = axiosConfig.interceptors.request.use((config) => {
      incrementCounter(config);
      return config;
    });
    const resInterceptor = axiosConfig.interceptors.response.use(
      (response) => {
        decrementCounter(response.config);
        return response;
      },
      (error) => {
        decrementCounter(error.config);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return requestCounter > 0;
};

export default useAxiosLoader;
