import { STORAGE_KEYS } from '@/constants/storage';
import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000/api' // when opened in browser via localhost
  : 'http://backend:3000/api'; // when running in internal Docker network (CI, staging, etc.)

console.log('🛰️ Using API base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
  else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

export const getProfile = async (id: number) => {
  const res = await api.get(`/profile/${id}`);
  return res.data;
};

export const updateProfile = async (id: number, data: any) => {
  const res = await api.patch(`/profile/${id}`, data);
  return res.data;
};

export const postFeedback = async (toUserId: number, content: string) => {
  const res = await api.post('/feedback', { toUserId, content });
  return res.data;
};

export const requestAbsence = async (data: {reason: string, start_date: string, end_date: string}) => {
  const res = await api.post('/absence', data);
  return res.data;
};

export const getAbsences = async (all = false) => {
  const { data } = await api.get(all ? "/absence" : "/absence/me");
  return data;
};

export const updateAbsenceStatus = async (id: number, status: "approved" | "rejected") => {
  const { data } = await api.patch(`/absence/${id}`, { status });
  return data;
};

// export const getCurrentUserAbsences = async () => {
//   const { data } = await api.get('/absence/me');
//   return data;
// };



export const getReceivedFeedback = async (userId: number) => {
  const res = await api.get(`/feedback/${userId}`);
  return res.data;
};

export const getGivenFeedback = async () => {
  const res = await api.get('/feedback/mine/list');
  return res.data;
};

export const updateFeedback = async (id: number, data: { content?: string; repolish?: boolean }) => {
  const res = await api.patch(`/feedback/${id}`, data);
  return res.data;
};

export const deleteFeedback = async (id: number) => {
  const res = await api.delete(`/feedback/${id}`);
  return res.data;
};