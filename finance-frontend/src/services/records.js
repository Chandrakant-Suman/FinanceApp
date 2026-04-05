import api from './api';

export const getRecords = (params) => api.get('/records', { params });
export const createRecord = (data) => api.post('/records', data);
export const updateRecord = (id, data) => api.patch(`/records/${id}`, data);
export const deleteRecord = (id) => api.delete(`/records/${id}`);
