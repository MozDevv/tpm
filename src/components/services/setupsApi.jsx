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

  getExitGrounds: "/api/Setups/GetExitGround",

  editExitReason: "/api/Setups/EditExitReason",

  //getGrades
  getGrades: (id) => `/api/Setups/GetGradeSetups?designationId=${id}`,

  getAllGrades: "/api/Setups/GetGradeSetups?paging.pageSize=1000",

  getGradesByDesignation: (id) =>
    `api/Setups/GetGradeSetups?paging.pageSize=1000&filterCriterion.criterions[0].propertyValue=${id}&filterCriterion.criterions[0].propertyName=designation_id`,

  getAllGrades: "/api/Setups/GetGradeSetups",

  //createGrade
  createGrade: "/api/Setups/CreateGradeSetup",

  //assignCaptermsOfservice
  assignCaptermsOfservice: "/api/Setups/AssignDeassignCapTermsOfService",

  //get Number Series
  getNumberSeries: "/api/setups/GetNumberSeries",

  //create Number Series
  createNumberSeries: "/api/setups/CreateNumberSeries",

  //create Number Series Line
  createNumberSeriesLine: "/api/setups/CreateNumberSeriesLine",

  editNumberSeriesLine: "/api/setups/EditNumberSeriesLineLine",

  deleteNumberSeriesLine: (id) => `/api/setups/DeleteNumberSeriesLine/${id}`,

  //get Number Series Line
  getNumberSeriesLine: "/api/setups/GetNumberSeriesLine",

  //get Number Series Line by code
  getNumberSeriesLineByCode: (code) =>
    `api/setups/GetNumberSeriesLines?filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyName=code&filterCriterion.criterions[0].propertyValue=${code}`,

  //Get Numbering sections
  getNumberingSections: "/api/Setups/GetNumberingSections",

  //edit Numbering Section
  editNumberingSection: "/api/Setups/EditNumberingSection",

  //BANKS
  getBankBranches: (id) => `/api/setups/GetBankBranches?id=${id}`,

  getAllBranchesByBankId: (id) =>
    `/api/setups/GetBankBranches?filterCriterion.criterions[0].propertyName=bank_id&filterCriterion.criterions[0].propertyValue=${id}&paging.pageSize=200`,

  deleteBankBranch: (id) => `/api/Setups/DeleteBankBranch/${id}`,
  //get Banks
  getBanks: "/api/setups/GetBanks",

  //getBankById
  getBankById: (id) => `/api/Setups/GetBanks?id=${id}`,

  //delete Bank

  deleteBank: (id) => `/api/Setups/DeleteBank/${id}`,

  //create Bank

  createBank: "/api/Setups/CreateBank",

  //Create Bank Branch
  createBankBranch: "/api/Setups/CreateBankBranch",

  //getBank Types

  getBankTypes: "/api/Setups/GetBankTypes",

  //createBankType
  createBankType: "/api/Setups/CreateBankType",

  createBankforPensioner:
    "/api/ProspectivePensioners/CreateProspectivePensionerBankDetail",

  //PENSION-AWARDS
  pensionAwards: "/api/Setups/GetPensionAwards",

  //MAP PENSIONER AWARDS
  mapPensionerAwards: "/api/Setups/MapDocumentTypesPensionAward",

  editPensionAwards: "/api/Setups/EditPensionAward",

  //MDAs
  mdas: "/api/Setups/Getmdas",
  createMDA: "/api/Setups/Createmda",
  updateMDA: "/api/Setups/EditMDA",
  deleteMDA: (id) => `/api/Setups/DeleteMDA/${id}`,

  //TERMS OF SERVICE
  termsOfService: "/api/Setups/GetTermsOfServiceSetups",

  //DOCUMENT TYPES
  documentTypes: "/api/setups/GetDocumentTypeSetups",

  //designation & grades
  getDesignations: "/api/Setups/GetDesignationSetups",

  //editDesignation
  editDesignation: "/api/Setups/EditDesignationSetup",

  //createDesignation
  createDesignation: "/api/Setups/CreateDesignationSetup",

  //editDesignation
  editDesignation: "/api/Setups/EditDesignationSetup",

  //deleteDesignation
  deleteDesignation: (id) => `/api/Setups/DeleteDesignationSetup/${id}`,

  //GET COUNTIES
  getCounties: "/api/Setups/GetCounties",

  createCounty: "/api/Setups/CreateCounty",

  //getConstituencies
  getConstituencies: "/api/Setups/GetConstituencies",

  getConstituenciesByCounty: (id) =>
    `api/Setups/GetConstituencies?filterCriterion.criterions[0].propertyName=county_id&filterCriterion.criterions[0].propertyValue=${id}&paging.pageSize=200`,

  createConstituency: "/api/Setups/CreateConstituency",
  //Get Countries
  getCountries: "/api/Setups/GetCountries",

  //getPostal codes
  getPostalCodes: "/api/Setups/GetPostalCodes",

  //createPostalCode
  createPostalCode: "/api/Setups/CreatePostalCodeDTO",

  //editPostalCode
  editPostalCode: "/api/Setups/EditPostalCode",

  //deletePostalCode
  deletePostalCode: (id) => `/api/Setups/DeletePostalCode/${id}`,

  //GET MENUS
  getMenus: "/api/MenuItemsSetup/GetMenuJSON",

  createDocumentType: "/api/Setups/CreateDocumentTypeSetup",

  //Departments setups
  getDepartments: "/api/DepartmentsSetup/GetDepartments",

  //Create Department
  createDepartment: "/api/DepartmentsSetup/CreateDepartment",

  //update Department
  updateDepartment: (id) => `/api/DepartmentsSetup/UpdateDepartments/${id}`,

  //delete Department
  deleteDepartment: (id) => `/api/DepartmentsSetup/DeleteDepartments/${id}`,

  //createRole
  createRole: "/api/RolesSetUp/CreateRole",

  //Get Roles

  getRoles: "/api/RolesSetUp/GetRoles",

  //updateRole
  updateRole: (id) => `/api/RolesSetUp/UpdateRole/${id}`,

  //deleteRole
  deleteRole: (id) => `/api/RolesSetUp/DeleteRoles/${id}`,

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

  getMenus: "/api/MenuItemsSetup/GetMenuJSON",

  //Get Menu Items
  getMenuItems: "/api/MenuItemsSetup/GetMenuItems",

  //Get MenuRole
  getMenuRole: (roleId) => `/api/MenuItemsSetup/GetMenuJSON/${roleId}`,

  //updateMenuRole
  updateMenuRole: "/api/RoleMenuItemSetup/CreatePermissionRole",

  //getMaintennace\
  maintenanceCase: "/api/ProspectivePensioners/GetPensionerMaintenances",

  getMaintenance: (id) =>
    `/api/ProspectivePensioners/GetPensionerMaintenances?prospective_pensioner_id=${id}`,

  createMaintenance: "/api/ProspectivePensioners/CreatePensionerMaintenance",

  updateMaintenance: "/api/ProspectivePensioners/UpdatePensionerMaintenance",

  deleteMaintenance: (id) =>
    `/api/ProspectivePensioners/DeletePensionerMaintenance/${id}`,

  deletePensionableSalary: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPensionableSalary?id=${id}`,

  //MixedServiceWorkHistory

  getMixedServiceWorkHistory: (id) =>
    `/api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalariesSalaryMixedService?prospective_pensioner_id=${id}`,

  createMixedServiceWorkHistory:
    "/api/ProspectivePensioners/CreateProspectivePensionerPostAndNatureofSalaryMixedService",

  updateMixedServiceWorkHistory:
    "/api/ProspectivePensioners/UpdateProspectivePensionerPostAndNatureofSalarySalaryMixedService",
  deleteMixedServiceWorkHistory: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPostAndNatureofSalarySalaryMixedService/${id}`,

  getDeductions: (id) =>
    `/api/ProspectivePensioners/GetPensionerDeductions?prospective_pensioner_id=${id}`,

  createDeductions: "/api/ProspectivePensioners/CreatePensionerDeduction",

  createParliamentContributions:
    "/api/ProspectivePensioners/CreateParliamentaryContributions",
  getParliamentaryContributions: (id) =>
    `/api/ProspectivePensioners/GetParliamentaryContributions?prospective_pensioner_id=${id}`,
  deleteContributions: (id) =>
    `/api/ProspectivePensioners/DeleteParliamentaryContributions?id=${id}`,
  updateContributions:
    "/api/ProspectivePensioners/UpdateParliamentaryContributions",

  createParliamentContributionsLine:
    "/api/ProspectivePensioners/CreateParliamentaryContributionLines",
  getParliamentaryContributionsLine: (id) =>
    `/api/ProspectivePensioners/GetParliamentaryContributionLines?paliamentary_contribution_id=${id}`,
  deleteContributionsLine: (id) =>
    `/api/ProspectivePensioners/DeleteParliamentaryContributionLines?id=${id}`,
  updateContributionsLine:
    "/api/ProspectivePensioners/UpdateParliamentaryContributionLines",

  getWcps: (id) =>
    `/api/ProspectivePensioners/GetWCPSContributions?prospective_pensioner_id=${id}`,
  createWcps: "/api/ProspectivePensioners/CreateWCPSContribution",
  updateWcps: "/api/ProspectivePensioners/UpdateWCPSContribution",
  deleteWcps: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSContribution?id=${id}`,

  getWcpsLine: (id) =>
    `/api/ProspectivePensioners/GetWCPSContributionLines?prospective_pensioner_id=${id}`,
  createWcpsLine: "/api/ProspectivePensioners/CreateWCPSContributionLine",
  updateWcpsLine: "/api/ProspectivePensioners/UpdateWCPSContributionLine",
  deleteWcpsLine: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSContributionLine?id=${id}`,

  getLiabilities: (id) =>
    `/api/ProspectivePensioners/GetLiabilties?prospective_pensioner_id=${id}`,
  createLiabilities: "/api/ProspectivePensioners/CreateLiabilities",
  updateLiabilities:
    "/api/ProspectivePensioners/UpdateProspectivePensionerLiabilities",

  mapExitGroundAwards: "/api/Setups/MapExitReasonAward",

  previewBirthCertificate: (prospectiveId, birthCertNo) =>
    `/birthCert/${prospectiveId}/${birthCertNo}`,

  createPasswordRules: "/api/PasswordRulesSetUp/CreatePasswordRules",
  getPasswordRules: "/api/PasswordRulesSetUp/GetPasswordRules",
  updatePasswordRules: (id) =>
    `/api/PasswordRulesSetUp/UpdatePasswordRule/${id}`,
  deletePasswordRules: (id) =>
    `/api/PasswordRulesSetUp/DeletePasswordRule/${id}`,

  createCity: "/api/Setups/CreateCity",
  getCities: "/api/Setups/GetCity",
  updateCity: "/api/Setups/UpdateCity",
  deleteCity: (id) => `/api/Setups/DeleteCity?id=${id}`,

  createGovernmentSalary: "/api/ProspectivePensioners/CreateGovernmentSalary",
  getGovernmentSalary: (id) =>
    `/api/ProspectivePensioners/GetGovernmentSalary?prospective_pensioner_id=${id}`,
  updateGovernmentSalary: "/api/ProspectivePensioners/UpdateGovernmentSalary",
  deleteGovernmentSalary: (id) =>
    `/api/ProspectivePensioners/DeleteGovenrmentSalary?id=${id}`,
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
