/* eslint-disable no-useless-catch */
'use client';
import { BASE_CORE_API, PAYROLL_BASE_URL } from '@/utils/constants';
import axios from 'axios';

export const API_BASE_URL = `${PAYROLL_BASE_URL}`;
const api = axios.create({
  baseURL: API_BASE_URL,
});

const payrollEndpoints = {
  createPayrollRecord: '/api/Payroll/CreatePayrollRecord',

  /////// Payroll Periods
  getPayrollPeriods: '/api/Application/payroll-periods',
  createPayrollPeriod: '/api/PayrollPeriods',
  getPensionerIndex: '/api/Pensioner/Index',

  getPayrollSummaries: '/api/Application/payroll-summaries',

  getPayrollSummaryByStage: (type, stage) =>
    `/api/Application/payroll-summaries?type=${type}&Stage=${stage}`,
  getPayrollSummaryByStageOnly: (id) =>
    `/api/Application/payroll-summaries-pgd?type=${id}`,

  getPeriodSchedule: (periodId) =>
    `api/Application/schedule-pgd?periodId=${periodId}`,

  trialRun: (id) => '/api/Application/trial-run?periodTypeId=' + id,

  createIncreamentMaster: '/api/Setups/increment-masters',
  getIncreamentMasters: '/api/Setups/increment-masters',
  runPayrollIncrements: (id) => `/api/Application/run-increments/${id}`,
  getIncreamentMasterById: (id) =>
    `/api/Setups/increment-masters?masterId=${id}`,

  createPayrollTypes: '/api/Setups/payroll-types',
  getPayrollTypes: '/api/Setups/payroll-types',
  updatePayrollTypes: '/api/Setups/payroll-types',
  deletePayrollTypes: '/api/Setups/payroll-types',

  getSuspensionReasons: '/api/Setups/read',
  createSuspensionReasonsL: '/api/Setups/create',
  updateSuspensionReasons: (id) => '/api/Setups/update/' + id,
  deleteSuspensionReasons: (id) => '/api/Setups/delete/' + id,
  getSuspensions: '/api/Pensioner/Suspensions',

  stopPayroll: 'api/Pensioner/CreateSuspension/srr-stop',
  resumePayroll: '/api/Pensioner/ResumePensioner/srr-resume',

  approvePayroll: (id) => `/api/Application/approve-payroll/${id}`,
  sendPeriodForApproval: (id) =>
    `/api/Application/SendForApproval?periodId=${id}`,
  getAllPayrollPensinoers: '/api/Pensioner/All',
  getAllPayrollPensinoersPgd: '/api/Pensioner/AllPgd',
  admit: (id) => '/api/Pensioner/Admit?id=' + id,
  getEligiblePensioners: (id) =>
    `/api/Pensioner/PayrollEligiblePensioners?payrollTypeId=${id}`,

  getPayrollPeriodByDocNo: (docNo) =>
    `/api/Application/payroll-summaries-pgd?filterCriterion.compositionType=0&filterCriterion.criterions[0].criterionType=2&filterCriterion.criterions[0].propertyName=payrollPeriod.documentNo&filterCriterion.criterions[0].propertyValue=${docNo}`,
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

export const payrollApiService = {
  get: async (endpoint, params) => {
    try {
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

export default payrollEndpoints;
