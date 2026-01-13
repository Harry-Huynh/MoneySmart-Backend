import axios from 'axios';

const API = 'http://localhost:8080/api/auth';

export const signup = (data) => axios.post(`${API}/signup`, data);
export const login = (data) => axios.post(`${API}/login`, data);

export const saveToken = (token) => localStorage.setItem('token', token);
