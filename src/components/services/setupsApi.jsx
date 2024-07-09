/* eslint-disable no-useless-catch */
"use client";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";

export const API_BASE_URL = "https://pmis.agilebiz.co.ke";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const endpoints = {
  //PENSION-CAPS
  pensionCaps: "/api/Setups/GetPensionCaps",

  //BANKS
  getBankBranches: "/api/setups/GetBankBranches",

  //get Banks

  getBanks: "/api/setups/GetBanks",

  //PENSION-AWARDS
  pensionAwards:
    "/api/Setups/GetPensionAwards?paging.pageNumber=1&paging.pageSize=30",

  //MAP PENSIONER AWARDS
  mapPensionerAwards: "/api/Setups/MapDocumentTypesPensionAward",

  //MDAs
  mdas: "/api/Setups/Getmdas",
  createMDA: "/api/Setups/Createmda",
  updateMDA: "/api/Setups/EditMDA",

  //TERMS OF SERVICE
  termsOfService: "/api/Setups/GetTermsOfServiceSetups",

  //DOCUMENT TYPES
  documentTypes: "/api/setups/GetDocumentTypeSetups",

  //GET MENUS
  getMenus: "/GetMenuJSON",

  createDocumentType: "/api/Setups/CreateDocumentTypeSetup",

  //Departments setups
  getDepartments: "/api/DepartmentsSetup/GetDepartments",

  //Create Department
  createDepartment: "/api/DepartmentsSetup/CreateDepartment",

  //createRole
  createRole: "/CreateRole",

  //Get Roles

  getRoles: "/GetRoles",

  //Get Tables
  getTables: "/api/TableSetup/GetTables",

  //Get Permissions
  getPermissions: "/api/PermissionsSetup/GetPermissions",

  //Create Permissions
  createPermissions: "/api/PermissionsSetup/CreatePermission",

  //PermissionRoles
  permissionRoles: "/api/PermissionRoleSetup/CreatePermissionRole",

  //Get Permission Roles
  getPermissionRoles: "/api/PermissionRoleSetup/GetPermissionsRole",

  //create permission user
  createPermissionsUser: "/api/PermissionUserSetUp/CreatePermissionsUser",

  //getUserPermissions
  getUserPermissions: "/api/PermissionUserSetUp/GetPermissionsUser",
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

export default endpoints;
