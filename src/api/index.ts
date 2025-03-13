import axios from 'axios';
import { Event, Expense } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const eventApi = {
  getAll: () => api.get<Event[]>('/events'),
  getById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (data: Partial<Event>) => api.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) => api.put<Event>(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  getTotal: (id: string) => api.get<{ total: number }>(`/events/${id}/total`),
};

export const expenseApi = {
  create: (data: Partial<Expense>) => api.post<Expense>('/expenses', data),
  getByDateRange: (start: string, end: string) => 
    api.get<{ expenses: Expense[]; total: number }>(`/expenses/by-date?start=${start}&end=${end}`),
  update: (id: string, data: Partial<Expense>) => api.put<Expense>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};