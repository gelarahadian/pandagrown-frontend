import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import { config } from "config";

const baseUrl = config.api.API_URL;

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

  // Add an interceptor to modify the response
  instance.interceptors.request.use(config => {
        const token = localStorage?.getItem('token') || '';
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token
        }
        // config.headers['Content-Type'] = 'application/json';
        return config
      },
      error => {
        Promise.reject(error)
      });

  instance.interceptors.response.use(
    (response) => {
      // Modify the response data as needed
      // For example, add a custom property to the response
      response.data.customProperty = 'Custom value';
      return response;
    },
    (error) => {
      if(error.response.status == "401"){
        navigateToLogoutPage();
      }
      
      if(error.response.data.detail == "Token not provided" || error.response.data.detail == "Token has expired"){
        navigateToLogoutPage();
      }
      // Handle request errors here
      throw error;
    }
  );
  
  return instance as CustomAxios;
}

// Function to navigate to the "\logout" page
function navigateToLogoutPage() {
  window.location.href = '/logout';
}

// Function to add JWT token to Axios headers
export const setAuthToken = () => {
  const token = localStorage?.getItem('token') || '';
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Usage
const api = createCustomAxios(baseUrl);

// Automatically set the JWT token for each request


export default api;