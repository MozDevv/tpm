/* eslint-disable no-useless-catch */
import axios from "axios";

export const API_BASE_URL = "https://www.ai-tool.fixedassetsystem.com/";

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

const endpoints = {
  //auth
  activationSetup: (uidb64, token) =>
    `/auth/activation-set-up/${uidb64}/${token}/`,

  login: "/auth/login/",
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

export default endpoints;
