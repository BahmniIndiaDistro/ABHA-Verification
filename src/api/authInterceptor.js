import axiosConfig from "./AxiosConfig";

export const authInterceptor = (accessToken) => {
  axiosConfig.interceptors.request.use((conf) => {
    conf.headers.Authorization = `Bearer ${accessToken}`;
    return conf;
  });
};
