/* eslint-disable no-useless-catch */
'use client';
import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';

import { BASE_CORE_API } from '@/utils/constants';
import { Update } from '@mui/icons-material';

export const API_BASE_URL = `${BASE_CORE_API}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert('Session Expired. You will be redirected to the login page.');
      // Redirect to the login page
      window.location.href = '/'; // Update with your login route
    }
    return Promise.reject(error);
  }
);
const assessEndpoints = {
  getAssessmentClaims: '/api/Assessment/getclaims',
  calculateAndAward: (id) => `/api/Assessment/CalculateAndAward?claim_id=${id}`,
  getClaimQualyfyingService: (id) =>
    `/api/Assessment/GetClaimQualifyingService?claim_id=${id}`,
  getClaimPensionableService: (id) =>
    `/api/Assessment/GetClaimPensionableService?claim_id=${id}`,
  getCalculationSummary: (id) =>
    `/api/Assessment/GetAwardCalcultionDetails?claim_id=${id}`,
};

export const assessApiService = {
  get: async (endpoint, params) => {
    try {
      //  // Set Authorization header before making the request
      const response = await api.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default assessEndpoints;
