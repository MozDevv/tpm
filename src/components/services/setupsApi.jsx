/* eslint-disable no-useless-catch */
"use client";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";
import { BASE_CORE_API } from "@/utils/constants";

export const API_BASE_URL = `${BASE_CORE_API}`;

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

  createBankforPensioner:
    "/api/ProspectivePensioners/CreateProspectivePensionerBankDetail",

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

  //GET COUNTIES
  getCounties: "/api/Setups/GetCounties",

  createCounty: "/api/Setups/CreateCounty",

  createConstituency: "/api/Setups/CreateConstituency",
  //Get Countries
  getCountries: "/api/Setups/GetCountries",

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

  getMenus: "/GetMenuJSON",

  //Get Menu Items
  getMenuItems: "/GetMenuItems",

  //Get MenuRole
  getMenuRole: (roleId) => `/GetMenuJSON?Role=${roleId}`,

  //updateMenuRole
  updateMenuRole: "/CreatePermissionRole",

  //getPro
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
