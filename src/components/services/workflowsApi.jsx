/* eslint-disable no-useless-catch */
"use client";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";

import { BASE_CORE_API } from "@/utils/constants";
import { Update } from "@mui/icons-material";

export const API_BASE_URL = `${BASE_CORE_API}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const workflowsEndpoints = {
  createApprovalRequest: "api/Approvals/SendForApproval",
  cancelApprovalRequest: "api/Approvals/CancelApprovalRequest",
  approve: "/api/Approvals/Approve",
  reject: "/api/Approvals/Reject",
  delegate: "/api/Approvals/Delegate",
  getDocumentStatus: "/api/Approvals/GetDocumentStatus",
  getApprovalEntries: "/api/Approvals/GetApprovalEntries",
  getApprovalActions: "/api/Approvals/GetApproverActions",
};

export const workflowsApiService = {
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

export default workflowsEndpoints;
