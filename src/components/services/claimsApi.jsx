/* eslint-disable no-useless-catch */
"use client";
import axios from "axios";

export const API_BASE_URL = "https://tntportalapi.agilebiz.co.ke";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const claimsEndpoints = {
  createProspectivePensionerClaim:
    "/api/claims/CreateProspectivePensionerClaim",

  getClaims: "/api/Claims/getClaims",
  moveClaimStatus: "/api/claims/MoveClaimStatus",
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

export default claimsEndpoints;
