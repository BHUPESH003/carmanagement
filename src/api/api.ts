import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // This allows the API to send cookies
});

export const setupApiInterceptors = (logout: () => void) => {
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          logout();
        }
        return Promise.reject(error);
      }
    );
  };
  
  export const registerUser = async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  };
  
  export const loginUser = async (username: string, email: string, password: string) => {
    const response = await api.post('/users/login', { username, email, password });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data.user;
  };
  
  export const logoutUser = async () => {
    const response = await api.post('/users/logout');
    localStorage.removeItem('accessToken');
    return response.data;
  };

export const refreshAccessToken = async () => {
  const response = await api.post('/users/refresh-token');
  localStorage.setItem('accessToken', response.data.data.accessToken);
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await api.post('/users/change-password', { oldPassword, newPassword });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/current-user');
  return response.data.data;
};

export const createCar = async (formData: FormData) => {
  const response = await api.post('/cars/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.car;
};

export const fetchCars = async () => {
  const response = await api.get('/cars/mycars');
  return response.data.cars;
};

export const searchCars = async (query: string) => {
  const response = await api.get(`/cars/search?keyword=${encodeURIComponent(query)}`);
  return response.data.cars;
};

export const fetchCarById = async (id: string) => {
  const response = await api.get(`/cars/${id}`);
  return response.data.car;
};

export const updateCar = async (id: string, formData: FormData) => {
  const response = await api.put(`/cars/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.car;
};

export const deleteCar = async (id: string) => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
};