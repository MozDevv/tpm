/* eslint-disable no-useless-catch */
'use client';
import { BASE_CORE_API } from '@/utils/constants';
import axios from 'axios';

export const API_BASE_URL = `${BASE_CORE_API}`;
const api = axios.create({
  baseURL: API_BASE_URL,
});

const claimsEndpoints = {
  createProspectivePensionerClaim:
    '/api/claims/CreateProspectivePensionerClaim',

  getClaims: '/api/Claims/getClaims',
  moveClaimStatus: '/api/claims/MoveClaimStatus',

  getClaimsByStatus: (status) =>
    `/api/Claims/getClaims?filterCriterion.criterions[0].propertyName=stage&filterCriterion.criterions[0].propertyValue=${status}&filterCriterion.criterions[0].criterionType=0`,

  mdas: '/api/Setups/Getmdas',
  createPayrollRecord: '/api/Payroll/CreatePayrollRecord',
};
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
  async (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        // Refresh token
        try {
          const response = await axios.post(
            `${BASE_CORE_API}/api/Auth/RefreshToken`,
            {
              jwtToken: token,
              refreshToken: refreshToken,
            }
          );
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          // Reload the page after successful token refresh
          window.location.reload();
        } catch (error_1) {
          console.log('error', error_1);
          alert('Session Expired. You will be redirected to the login page.');
          window.location.href = '/';
        }
      } else {
        alert('Session Expired. You will be redirected to the login page.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
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

export default claimsEndpoints;
