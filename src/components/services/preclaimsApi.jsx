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

// Axios interceptor to set the Authorization header for every request
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
    if (error.response.status === 401) {
      console.log('Token expired. Refreshing token...');
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        // Refresh token
        try {
          const response = await axios.post(
            `${BASE_CORE_API}api/Auth/RefreshToken`,
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

const preClaimsEndpoints = {
  createPreclaim: '/api/ProspectivePensioners/CreateProspectivePensioner',

  getPreclaims: '/api/ProspectivePensioners/getProspectivePensioners',

  getProspectivePensioner: (id) =>
    `/api/ProspectivePensioners/getProspectivePensioners?id=${id}`,

  sendNotifications:
    '/api/ProspectivePensioners/CreateProspectivePensionerNotificationSchedule',

  //Work History

  createWorkHistory: '/api/ProspectivePensioners/CreateWorkHistory',

  submitForApproval: '/api/ProspectivePensioners/SendPreClaimForApproval',

  //workHistory
  getPostandNatureofSalaries: (id) =>
    `/api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalaries?prospective_pensioner_id=${id}`,
  createPostAndNatureOfService:
    '/api/ProspectivePensioners/CreateProspectivePensionerPostAndNatureofSalary',
  getPensionableSalary: (id) =>
    `/api/ProspectivePensioners/GetProspectivePensionerPensionableSalary/?prospective_pensioner_id=${id}`,
  createPensionableSalary:
    '/api/ProspectivePensioners/CreateProspectivePensionerPensionableSalary',
  getPeriodsOfAbsence: (id) =>
    `/api/ProspectivePensioners/GetProspectivePensionerPeriodsOfAbsenceWithoutSalary/?prospective_pensioner_id=${id}`,

  createPeriodsOfAbsence:
    'api/ProspectivePensioners/CreateProspectivePensionerPeriodsOfAbsenceWithoutSalary',

  deletePostAndNature: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPostAndNatureofSalary?id=${id}`,

  updatePostAndNature:
    'api/ProspectivePensioners/UpdateProspectivePensionerPostAndNatureofSalary',

  deletePensionableSalary: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPensionableSalary?id=${id}`,

  updatePensionableSalary:
    '/api/ProspectivePensioners/UpdateProspectivePensionerPensionableSalary',

  deletePeriodsOfAbsence: (id) =>
    `api/ProspectivePensioners/DeleteProspectivePensionerPeriodsOfAbsenceWithoutSalary/?id=${id}`,

  UpdatePeriodsOfAbsence:
    '/api/ProspectivePensioners/UpdateProspectivePensionerPeriodsOfAbsenceWithoutSalary',

  //Documents
  getAwardDocuments: (id) =>
    `/api/ProspectivePensioners/getProspectivePensioners?id=${id}`,

  //Documents
  submitProspectivePensionerDocs: `/api/MDAReceiveProspectivePensionerDocuments`,

  //GetBeneficiaries
  getBeneficiaries: (id) =>
    `/api/Claims/getBeneficiaries?prospective_pensioner_id=${id}`,

  getBeneficiariesPortal: (id) => `/api/Claims/getBeneficiaries?id=${id}`,

  getProspectivePensionerReviewPeriods: (id) =>
    `api/ProspectivePensioners/GetProspectivePensionerReviewPeriods?prospective_pensioner_id=${id}`,
  getNextOfKin: (id) =>
    `/api/Claims/getNextOfkin?prospective_pensioner_id=${id}`,

  updateSalaryReview: '/api/ProspectivePensioners/UpdateSalaryReview',

  getPostFiscalRecords: (id) =>
    `api/ProspectivePensioners/GetPostAndNatureInFiscal?id=${id}&paging.pageNumber=1&paging.pageSize=100`,
};

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

export default preClaimsEndpoints;
