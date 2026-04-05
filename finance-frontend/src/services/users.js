import api from './api';

export const getUsers = (params) => api.get('/users', { params });
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
