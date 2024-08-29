/* eslint-disable no-useless-catch */
import axios from "axios";
import { BASE_CORE_API } from "@/utils/constants";
import { create } from "@mui/material/styles/createTransitions";

export const API_BASE_URL = `${BASE_CORE_API}api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthorizationHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

const financeEndpoints = {
  fetchGlAccounts: "/Accounts/GetGLAccounts",
  fetchGlAccountTypes: "/AccountsSetup/GetGLAccountTypes",
  createGlAccount: "/Accounts/AddGLAccount",
  getAccountGroupTypes: "/AccountsSetup/GetAccountGroups",
  updateGlAccount: `/Accounts/UpdateGLAccount/`,
  deleteGlAccount: (id) => `/Accounts/DeleteGLAccount?id=${id}`,

  createBudget: "/Accounts/AddBudget",
  getBudget: "/Accounts/GetBudget",

  addBudgetLines: "/Accounts/AddBudgetLines",
  updateBudget: "Accounts/UpdateBudget",
};

export const apiService = {
  get: async (endpoint, params) => {
    try {
      setAuthorizationHeader(); // Set Authorization header before making the request
      const response = await api.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      setAuthorizationHeader();
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      setAuthorizationHeader();
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint) => {
    try {
      setAuthorizationHeader();
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default financeEndpoints;
