// src/api/request.ts
import axios,{type AxiosResponse} from "axios";

// 创建 axios 实例
const request = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  config => {
      // 可以在这里添加请求头，比如 token
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
    (res:AxiosResponse) => res.data,
    (error) => Promise.reject(error)
);

export default request as {
    get<T = any>(url: string, config?: object): Promise<T>;
    post<T = any>(url: string, data?: object, config?: object): Promise<T>;
};
