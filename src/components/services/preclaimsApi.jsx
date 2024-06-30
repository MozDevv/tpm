/* eslint-disable no-useless-catch */
"use client";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";

export const API_BASE_URL = "https://pmis.agilebiz.co.ke";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const preClaimsEndpoints = {
  createPreclaim: "/api/ProspectivePensioners/CreateProspectivePensioner",

  getPreclaims: "/api/ProspectivePensioners/getProspectivePensioners",

  sendNotifications:
    "/api/ProspectivePensioners/CreateProspectivePensionerNotificationSchedule",

  //Work History

  createWorkHistory: "/api/ProspectivePensioners/CreateWorkHistory",

  submitForApproval: "/api/ProspectivePensioners/SendPreClaimForApproval",
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
