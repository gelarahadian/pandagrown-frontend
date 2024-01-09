import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/';

// Create an interface that extends AxiosInstance
interface CustomAxios extends AxiosInstance {
  post<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

// Create a wrapper function that configures Axios with the base URL
function createCustomAxios(baseURL: string): CustomAxios {
  const instance = axios.create({
    baseURL,
  });

  // Define any additional configurations or interceptors if needed

  return instance as CustomAxios;
}

// Function to add JWT token to Axios headers
export const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Usage
const api = createCustomAxios(baseUrl);

// Automatically set the JWT token for each request
api.interceptors.request.use((config) => {
  setAuthToken();
  return config;
});

export default api;