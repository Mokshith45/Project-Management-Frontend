import axios from './axios';

export const login = (data) => axios.post('/api/auth/login', data);
export const register = (data) => axios.post('/api/auth/register', data);
