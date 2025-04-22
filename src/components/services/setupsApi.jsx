/* eslint-disable no-useless-catch */
'use client';
import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';
import { BASE_CORE_API } from '@/utils/constants';

export const API_BASE_URL = `${BASE_CORE_API}`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if the endpoint is '/api/Setups/Getmdas'
      if (error.config.url === '/api/Setups/Getmdas') {
        // Return the error without triggering the session expired logic
        return Promise.reject(error);
      }

      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        // Refresh token
        return axios
          .post(`${BASE_CORE_API}api/Auth/RefreshToken`, {
            jwtToken: token,
            refreshToken,
          })
          .then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            // Reload the page after successful token refresh
            window.location.reload();
          })
          .catch((error) => {
            console.log('error', error);
            alert('Session Expired. You will be redirected to the login page.');
            window.location.href = '/';
          });
      } else {
        alert('Session Expired. You will be redirected to the login page.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

const endpoints = {
  //PENSION-CAPS
  getUsers: '/api/UserManagement/GetUsers',
  getUserById: (id) => `/api/UserManagement/GetUsers?documentId=${id}`,
  pensionCaps: '/api/Setups/GetPensionCaps',

  getExitGrounds: '/api/Setups/GetExitGround',

  editExitReason: '/api/Setups/EditExitReason',

  //getGrades
  getGrades: (id) => `/api/Setups/GetGradeSetups?designationId=${id}`,

  getAllGrades: '/api/Setups/GetGradeSetups?paging.pageSize=1000',

  getGradesByDesignation: (id) =>
    `api/Setups/GetGradeSetups?paging.pageSize=1000&filterCriterion.criterions[0].propertyValue=${id}&filterCriterion.criterions[0].propertyName=designation_id`,

  getAllGrades: '/api/Setups/GetGradeSetups',

  //createGrade
  createGrade: '/api/Setups/CreateGradeSetup',

  //assignCaptermsOfservice
  assignCaptermsOfservice: '/api/Setups/AssignDeassignCapTermsOfService',

  //get Number Series
  getNumberSeries: '/api/setups/GetNumberSeries',

  //create Number Series
  createNumberSeries: '/api/setups/CreateNumberSeries',

  //create Number Series Line
  createNumberSeriesLine: '/api/setups/CreateNumberSeriesLine',

  editNumberSeriesLine: '/api/setups/EditNumberSeriesLineLine',

  deleteNumberSeriesLine: (id) => `/api/setups/DeleteNumberSeriesLine/${id}`,

  //get Number Series Line
  getNumberSeriesLine: '/api/setups/GetNumberSeriesLine',

  //get Number Series Line by code
  getNumberSeriesLineByCode: (code) =>
    `api/setups/GetNumberSeriesLines?filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyName=code&filterCriterion.criterions[0].propertyValue=${code}`,

  //Get Numbering sections
  getNumberingSections: '/api/Setups/GetNumberingSections',

  //edit Numbering Section
  editNumberingSection: '/api/Setups/EditNumberingSection',

  //BANKS
  getBankBranches: (id) => `/api/setups/GetBankBranches?id=${id}`,

  getAllBranchesByBankId: (id) =>
    `/api/setups/GetBankBranches?filterCriterion.criterions[0].propertyName=bank_id&filterCriterion.criterions[0].propertyValue=${id}&paging.pageSize=200`,

  deleteBankBranch: (id) => `/api/Setups/DeleteBankBranch/${id}`,
  //get Banks
  getBanks: '/api/setups/GetBanks',

  //getBankById
  getBankById: (id) => `/api/Setups/GetBanks?id=${id}`,

  //delete Bank

  deleteBank: (id) => `/api/Setups/DeleteBank/${id}`,

  //create Bank

  createBank: '/api/Setups/CreateBank',

  //Create Bank Branch
  createBankBranch: '/api/Setups/CreateBankBranch',

  //getBank Types

  getBankTypes: '/api/Setups/GetBankTypes',

  //createBankType
  createBankType: '/api/Setups/CreateBankType',

  createBankforPensioner:
    '/api/ProspectivePensioners/CreateProspectivePensionerBankDetail',

  //PENSION-AWARDS
  pensionAwards: '/api/Setups/GetPensionAwards',

  //MAP PENSIONER AWARDS
  mapPensionerAwards: '/api/Setups/MapDocumentTypesPensionAward',

  editPensionAwards: '/api/Setups/EditPensionAward',

  //MDAs
  mdas: '/api/Setups/Getmdas',
  createMDA: '/api/Setups/Createmda',
  updateMDA: '/api/Setups/EditMDA',
  deleteMDA: (id) => `/api/Setups/DeleteMDA/${id}`,

  //TERMS OF SERVICE
  termsOfService: '/api/Setups/GetTermsOfServiceSetups',

  //DOCUMENT TYPES
  documentTypes: '/api/setups/GetDocumentTypeSetups',

  //designation & grades
  getDesignations: '/api/Setups/GetDesignationSetups',

  //editDesignation
  editDesignation: '/api/Setups/EditDesignationSetup',

  //createDesignation
  createDesignation: '/api/Setups/CreateDesignationSetup',

  //editDesignation
  editDesignation: '/api/Setups/EditDesignationSetup',

  //deleteDesignation
  deleteDesignation: (id) => `/api/Setups/DeleteDesignationSetup/${id}`,

  //GET COUNTIES
  getCounties: '/api/Setups/GetCounties',

  createCounty: '/api/Setups/CreateCounty',

  //getConstituencies
  getConstituencies: '/api/Setups/GetConstituencies',

  getConstituenciesByCounty: (id) =>
    `api/Setups/GetConstituencies?filterCriterion.criterions[0].propertyName=county_id&filterCriterion.criterions[0].propertyValue=${id}&paging.pageSize=200`,

  createConstituency: '/api/Setups/CreateConstituency',
  //Get Countries
  getCountries: '/api/Setups/GetCountries',

  //getPostal codes
  getPostalCodes: '/api/Setups/GetPostalCodes',

  //createPostalCode
  createPostalCode: '/api/Setups/CreatePostalCodeDTO',

  //editPostalCode
  editPostalCode: '/api/Setups/EditPostalCode',

  //deletePostalCode
  deletePostalCode: (id) => `/api/Setups/DeletePostalCode/${id}`,

  //GET MENUS
  getMenus: '/api/MenuItemsSetup/GetMenuJSON',

  createDocumentType: '/api/Setups/CreateDocumentTypeSetup',

  //Departments setups
  getDepartments: '/api/DepartmentsSetup/GetDepartments',

  //Create Department
  createDepartment: '/api/DepartmentsSetup/CreateDepartment',

  //update Department
  updateDepartment: (id) => `/api/DepartmentsSetup/UpdateDepartments/${id}`,

  //delete Department
  deleteDepartment: (id) => `/api/DepartmentsSetup/DeleteDepartments/${id}`,

  //createRole
  createRole: '/api/RolesSetUp/CreateRole',

  //Get Roles

  getRoles: '/api/RolesSetUp/GetRoles',

  //updateRole
  updateRole: (id) => `/api/RolesSetUp/UpdateRole/${id}`,

  //deleteRole
  deleteRole: (id) => `/api/RolesSetUp/DeleteRoles/${id}`,

  //Get Tables
  getTables: '/api/TableSetup/GetTables',

  //Get Permissions
  getPermissions: '/api/PermissionsSetup/GetPermissions',

  //Create Permissions
  createPermissions: '/api/PermissionsSetup/CreatePermission',

  createGeneralSettings: '/api/Setups/CreateGeneralSettings',

  //PermissionRoles
  permissionRoles: '/api/PermissionRoleSetup/CreatePermissionRole',

  //Get Permission Roles
  getPermissionRoles: '/api/PermissionRoleSetup/GetPermissionsRole',

  //create permission user
  createPermissionsUser: '/api/PermissionUserSetUp/CreatePermissionsUser',

  //getUserPermissions
  getUserPermissions: '/api/PermissionUserSetUp/GetPermissionsUser',

  getMenus: '/api/MenuItemsSetup/GetMenuJSON',

  //Get Menu Items
  getMenuItems: 'api/MenuItemsSetup/GetMenuItems',

  //Get MenuRole
  getMenuRole: (roleId) => `/api/MenuItemsSetup/GetMenuJSON/${roleId}`,

  //updateMenuRole
  updateMenuRole: '/api/RoleMenuItemSetup/CreatePermissionRole',

  //getMaintennace\
  maintenanceCase: '/api/ProspectivePensioners/GetPensionerMaintenances',

  getMaintenance: (id) =>
    `/api/ProspectivePensioners/GetPensionerMaintenances?prospective_pensioner_id=${id}`,

  createMaintenance: '/api/ProspectivePensioners/CreatePensionerMaintenance',

  updateMaintenance: '/api/ProspectivePensioners/UpdatePensionerMaintenance',

  deleteMaintenance: (id) =>
    `/api/ProspectivePensioners/DeletePensionerMaintenance/${id}`,

  deletePensionableSalary: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPensionableSalary?id=${id}`,

  //MixedServiceWorkHistory

  getMixedServiceWorkHistory: (id) =>
    `/api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalariesSalaryMixedService?prospective_pensioner_id=${id}`,

  createMixedServiceWorkHistory:
    '/api/ProspectivePensioners/CreateProspectivePensionerPostAndNatureofSalaryMixedService',

  updateMixedServiceWorkHistory:
    '/api/ProspectivePensioners/UpdateProspectivePensionerPostAndNatureofSalarySalaryMixedService',
  deleteMixedServiceWorkHistory: (id) =>
    `/api/ProspectivePensioners/DeleteProspectivePensionerPostAndNatureofSalarySalaryMixedService/${id}`,

  getDeductions: (id) =>
    `/api/ProspectivePensioners/GetPensionerDeductions?prospective_pensioner_id=${id}`,

  createDeductions: '/api/ProspectivePensioners/CreatePensionerDeduction',

  createParliamentContributions:
    '/api/ProspectivePensioners/CreateParliamentaryContributions',
  updateParliamentContributions:
    '/api/ProspectivePensioners/UpdateParliamentaryContributions',
  deleteParliamentContributions: (id) =>
    `/api/ProspectivePensioners/DeleteParliamentaryContributions?id=${id}`,

  getParliamentContributionsById: (id, contId) =>
    `/api/ProspectivePensioners/GetParliamentaryContributions?filterCriterion.criterions[0].propertyName=id&filterCriterion.criterions[0].propertyValue=${contId}&prospective_pensioner_id=${id}`,

  uploadParliamentaryContributions:
    '/api/ProspectivePensioners/UploadParliamentaryContributions',

  previewParliamentaryContributions:
    '/api/ProspectivePensioners/PreviewParliamentaryContributions',
  getParliamentaryContributions: (id) =>
    `/api/ProspectivePensioners/GetParliamentaryContributions?prospective_pensioner_id=${id}`,
  deleteContributions: (id) =>
    `/api/ProspectivePensioners/DeleteParliamentaryContributions?id=${id}`,
  updateContributions:
    '/api/ProspectivePensioners/UpdateParliamentaryContributions',

  createParliamentContributionsLine:
    '/api/ProspectivePensioners/CreateParliamentaryContributionLines',
  getParliamentaryContributionsLine: (id) =>
    `/api/ProspectivePensioners/GetParliamentaryContributionLines?paliamentary_contribution_id=${id}`,
  deleteContributionsLine: (id) =>
    `/api/ProspectivePensioners/DeleteParliamentaryContributionLines?id=${id}`,
  updateContributionsLine:
    '/api/ProspectivePensioners/UpdateParliamentaryContributionLines',

  getWcps: (id) =>
    `/api/ProspectivePensioners/GetWCPSContributions?prospective_pensioner_id=${id}`,
  createWcps: '/api/ProspectivePensioners/CreateWCPSContribution',
  updateWcps: '/api/ProspectivePensioners/UpdateWCPSContribution',
  deleteWcps: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSContribution?id=${id}`,

  getWcpsLine: (id) =>
    `/api/ProspectivePensioners/GetWCPSContributionLines?prospective_pensioner_id=${id}`,
  createWcpsLine: '/api/ProspectivePensioners/CreateWCPSProforma',
  updateWcpsLine: '/api/ProspectivePensioners/UpdateWCPSContributionLine',
  deleteWcpsLine: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSContributionLine?id=${id}`,

  getWcpsProforma: (id) =>
    `api/ProspectivePensioners/GetWCPSProformas?prospective_pensioner_id=${id}`,
  createWcpsProforma: '/api/ProspectivePensioners/CreateWCPSProforma',
  updateWcpsProforma: '/api/ProspectivePensioners/UpdateWCPSProforma',
  deleteWcpsProforma: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSProforma?id=${id}`,

  getWcpsProformaLine: (id) =>
    `/api/ProspectivePensioners/GetWCPSProformaLines?filterCriterion.criterions[0].propertyName=wCPS_proforma_id&filterCriterion.criterions[0].propertyValue=${id}`,
  createWcpsProformaLine: '/api/ProspectivePensioners/CreateWCPSProformaLine',
  deleteWcpsProformaLine: (id) =>
    `/api/ProspectivePensioners/DeleteWCPSProformaLine?id=${id}`,
  updateWcpsProformaLine: '/api/ProspectivePensioners/UpdateWCPSProformaLine',

  getLiabilities: (id) =>
    `/api/ProspectivePensioners/GetLiabilties?prospective_pensioner_id=${id}`,
  createLiabilities: '/api/ProspectivePensioners/CreateLiabilities',
  updateLiabilities:
    '/api/ProspectivePensioners/UpdateProspectivePensionerLiabilities',

  mapExitGroundAwards: '/api/Setups/MapExitReasonAward',

  previewBirthCertificate: (prospectiveId, birthCertNo) =>
    `/birthCert/${prospectiveId}/${birthCertNo}`,

  createPasswordRules: '/api/PasswordRulesSetUp/CreatePasswordRules',
  getPasswordRules: '/api/PasswordRulesSetUp/GetPasswordRules',
  updatePasswordRules: (id) =>
    `/api/PasswordRulesSetUp/UpdatePasswordRule/${id}`,
  deletePasswordRules: (id) =>
    `/api/PasswordRulesSetUp/DeletePasswordRule/${id}`,

  createCity: '/api/Setups/CreateCity',
  getCities: '/api/Setups/GetCity',
  updateCity: '/api/Setups/UpdateCity',
  deleteCity: (id) => `/api/Setups/DeleteCity?id=${id}`,

  createGovernmentSalary: '/api/ProspectivePensioners/CreateGovernmentSalary',
  getGovernmentSalary: (id) =>
    `/api/ProspectivePensioners/GetGovernmentSalary?prospective_pensioner_id=${id}`,
  updateGovernmentSalary: '/api/ProspectivePensioners/UpdateGovernmentSalary',
  deleteGovernmentSalary: (id) =>
    `/api/ProspectivePensioners/DeleteGovenrmentSalary?id=${id}`,

  // APPROVALS & WORKFLOWS ****************************************

  createApprovalUser: '/api/ApprovalSetups/CreateApprovalUser',
  getApprovalUsers: '/api/ApprovalSetups/GetApprovalUsers',
  updateApprovalUser: '/api/ApprovalSetups/UpdateApprovalUsers',
  deleteApprovalUser: (id) => `/api/ApprovalSetups/DeleteApprovalUsers/${id}`,
  createApprovalType: '/api/ApprovalSetups/CreateApprovalType',
  createApprovalStages: '/api/ApprovalSetups/CreateApprovalStages',
  getApprovalTypes: '/api/ApprovalSetups/GetApprovalType',
  updateApprovalType: '/api/ApprovalSetups/UpdateApprovalType',
  deleteApprovalType: (id) => `/api/ApprovalSetups/DeleteApprovalType/${id}`,

  createApprovalStage: '/api/ApprovalSetups/CreateApprovalStages',
  getApprovalStages: '/api/ApprovalSetups/GetApprovalStages',
  updateApprovalStage: '/api/ApprovalSetups/UpdateApprovalStages',
  deleteApprovalStage: (id) => `/api/ApprovalSetups/DeleteApprovalStages/${id}`,
  getParliamentaryTermsSetups: '/api/Setups/GetParliamentaryTermSetups',
  createParliamentaryTerms: '/api/Setups/CreateParliamentaryTermSetup',

  /////

  getApproversForASpecificStage: (id) =>
    `/api/ApprovalSetUps/GetApprovalStageUser?filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyValue=${id}&filterCriterion.criterions[0].propertyName=approval_stage_id`,

  createApproverForASpecificStage:
    '/api/ApprovalSetUps/CreateApprovalStageUser',
  getGeneralSettings: '/api/Setups/GetGeneralSettings',
  createGeneralSettings: '/api/Setups/CreateGeneralSettings',
  getRateOfInjury: '/api/Setups/GetRateOfInjuryForCap189Setups',

  getPensionFactor: '/api/assessment/GetPensionFactorSetup',
  createPensionFactor: '/api/assessment/CreatePensionFactorSetup',
  updatePensionFactor: '/api/assessment/UpdatePensionFactorSetup',
  deletePensionFactor: (id) => `/api/assessment/DeletePensionFactorSetup/${id}`,
  addRecoveryDeduction: '/api/PostingSetup/AddDeductionsAndRefund',
  getRecoveryDeductions: '/api/PostingSetup/GetDeductionsAndRefunds',
  updateRecoveryDeduction: '/api/PostingSetup/UpdateDeductionsAndRefund',
  deleteRecoveryDeduction: (id) =>
    `/api/PostingSetup/DeleteDeductionsAndRefund?id=${id}`,

  getBeneficiariesRelationShips: '/api/Setups/GetBenefitsConfigurationMatrix',
  getBeneficiaries: (id) =>
    `api/Claims/getAllBeneficiaries?prospective_pensioner_id=${id}`,
  createBeneficiary: '/api/Claims/createBeneficiary',

  updateBeneficiaries: '/api/Claims/UpdateBeneficiary',

  getRetireesDesignationGvtSalary: (id) =>
    `api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalaries?prospective_pensioner_id=${id}`,

  getPostAndNature: (id) =>
    `api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalaries?prospective_pensioner_id=${id}`,

  getRelationships: 'api/Setups/GetBenefitsConfigurationMatrix',
  createRelationship: 'api/setups/CreateBenefitsConfigurationMatrix',

  getProspectivePensionerReviewPeriods: (id) =>
    `api/ProspectivePensioners/GetProspectivePensionerReviewPeriods?prospective_pensioner_id=${id}`,

  getContributionType: '/api/Contribution/GetContributionType',
  createContributionType: '/api/Contribution/AddContributionType',
  updateContributionType: '/api/Contribution/UpdateContributionType',
  deleteContributionType: (id) =>
    `/api/Contribution/DeleteContributionType/${id}`,

  /////// CUSTOMER SERVICE MANAGEMENT

  confirmPrincipalPensioner:
    '/api/IGCClaimInitiation/ConfirmPrincipalPensionerDetailsBeforeIGCInitiation',

  getDocumentFieldsNames: '/api/Setups/GetDocumentFieldLocationNames',
  getDocumentsMappedToField: '/api/Setups/GetDocumentFieldLocations',
  toggleDocumentFieldMapping: '/api/setups/ToggleDocumentTypeFieldLocation',

  getMappedStagesPerExitGround:
    '/api/Setups/ExitGroundDocumentVerificationSections',

  toggleDocumentVerificationSection:
    '/api/setups/ToggleDocumentVerificationSection',

  getExitGroundbyId: (id) =>
    `api/Setups/GetExitGround?paging.pageNumber=1&paging.pageSize=1000&filterCriterion.compositionType=0&filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyName=id&filterCriterion.criterions[0].propertyValue=${id}`,
  verifyPensionerDocument: '/api/ProspectivePensioners/VerifyPensionerDocument',
  igcDocuments: '/api/Setups/GetIGCDocuments',
  //getIgcDocumentTypeFor "igC_Type": 0, using filtercrite

  getKilledOnDutyIgcDocs: `/api/Setups/GetIGCDocuments?filterCriterion.compositionType=0&filterCriterion.criterions[0].propertyName=igC_Type&filterCriterion.criterions[0].propertyValue=0&paging.pageSize=1000`,

  createIgcDocument: '/api/Setups/CreateIGCDocuments',
  updateIGCDoc: '/api/Setups/UpdateIGCDocuments',

  initiateIGC: '/api/IGCClaimInitiation/initiateIGCClaimCommand',
  deleteIgc: '/api/Setups/DeleteIGCDocuments',
  getTaskDetails: (id, type) =>
    `/api/TaskAllocations/GetCurrentTaskAllocation?recordId=${id}&taskType=${type}`,

  reassignTask: '/api/TaskAllocations/ReassignTaskAllocation',

  getIgcInitiation: '/api/IGCClaimInitiation/GetIGCClaimInitiations',
  igcBeneficiaries: '/api/IGCClaimInitiation/GetIGCs',

  //for getIgcListingsByClaimStage use  'filterCriterion.criterions[0].propertyName':
  // 'igc_stage_type_map.igc_stage',
  // 'filterCriterion.criterions[0].propertyValue': activeSegment,
  // 'filterCriterion.criterions[0].criterionType': 0
  getIgcListingsByClaimStage: (id) =>
    `/api/IGCClaimInitiation/GetIGCs?filterCriterion.criterions[0].propertyName=igc_stage_type_map.igc_stage&filterCriterion.criterions[0].propertyValue=${id}&filterCriterion.criterions[0].criterionType=0`,
  igcBeneficiariesTrack: '/api/IGCClaimInitiation/GetIGCBeneficiaryTrack',

  getIgcByStatus: (id) => `/api/IGCClaimInitiation/GetIGCs?type=${id}`,

  initiateIgcBeneficiary:
    '/api/IGCClaimInitiation/initiateDependantsEnrolmentCommand',
  initiateChangeOfPaypoint:
    '/api/IGCClaimInitiation/initiate_igc_change_of_pay_point',
  getBasicFields: '/api/RevisedClaim/GetSectionsAndBasicFields',
  createRevisedClaim: '/api/RevisedClaim/CreateRevisedClaim',
  sendIgcForApproval: '/api/RevisedClaim/SendForApproval',
  updateRevisedCase: '/api/RevisedClaim/UpdateClaim',
  getRevisionPayload: (id) => `/api/RevisedClaim/GetRevisionPayload?id=${id}`,
  moveIgcStatus: '/api/RevisedClaim/MoveIGCRecord',
  verifyBeneficiary: (id) =>
    `/api/DeathInService/VerifyBeneficiary?beneficiaryId=${id}`,

  createServiceCategory: 'api/Setups/CreateCRMServiceCategory',
  /**DELETE
/api/Setups/DeleteCRMServiceCategoriesGET
/api/Setups/GetCRMServiceCategories */
  getServiceCategories: '/api/Setups/GetCRMServiceCategories',
  deleteServiceCategory: (id) =>
    `/api/Setups/DeleteCRMServiceCategoriesGET?id=${id}`,
  getComplaints: '/api/CRM/complaints',
  createComplaint: '/api/CRM/complaints',

  getTickets: '/api/CRM/tickets',
  createTicket: '/api/CRM/tickets',
  updateTicket: `/api/CRM/tickets`,
  deleteTicket: (id) => `/api/CRM/tickets?id=${id}`,
  getClaimInquiry: '/api/CRM/enquiries',
  getStats: '/api/CRM/tickets/stats',
  getTicketsByStatus: (status) =>
    `/api/CRM/tickets?filterCriterion.criterions[0].propertyName=status&filterCriterion.criterions[0].propertyValue=${status}&filterCriterion.criterions[0].criterionType=0`,
  assignPerPerson: '/api/CRM/tickets/assign',
  closeComplaint: '/api/CRM/complaints/close',
  getComplaintStats: 'api/CRM/complaints/stats',
  esclateComplaint: '/api/CRM/complaints/escalate',
  getComplaintByStatus: (status) =>
    `/api/CRM/complaints?filterCriterion.criterions[0].propertyName=status&filterCriterion.criterions[0].propertyValue=${status}&filterCriterion.criterions[0].criterionType=0`,
  getReportedDeaths: '/api/IGCClaimInitiation/GetIGCClaimInitiations',
  getIgcByStage: (id) =>
    `/api/IGCClaimInitiation/GetIGCs?filterCriterion.criterions[0].propertyName=igc_submission_status&filterCriterion.criterions[0].propertyValue=${id}&filterCriterion.criterions[0].criterionType=0`,
  getDependantPensioNiGCDocuments:
    'api/Setups/GetIGCDocuments?filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyName=igC_Type&filterCriterion.criterions[0].propertyValue=0&paging.pageNumber=1&paging.pageSize=1000',

  getClaimById: (id) => `api/Claims/claimsList?id=${id}`,
  addPaymentReasons: '/api/AccountsSetup/AddPaymentReturnReason',
  getPaymentReasons: '/api/AccountsSetup/GetPaymentReturnReasons',
  updatePaymentReasons: '/api/AccountsSetup/UpdatePaymentReturnReason',
  deletePaymentReasons: (id) =>
    `/api/AccountsSetup/DeletePaymentReturnReason?id=${id}`,
  getGeneralPolicy: '/api/Policy/general',
  createGeneralPolicy: '/api/Policy/general',
  getOmbudsman: '/api/Policy/ombudsman-case',
  createOmbudsman: '/api/Policy/ombudsman-case',
  createCourtCase: '/api/Policy/court-case',
  getCourtCase: '/api/Policy/court-case',
  notifyBeneficiary: '/api/IGCClaimInitiation/CreateIGCClaimforBeneficiary',
  getOmbumdanByStartDate: (startDate, endDate) =>
    `api/Policy/ombudsman-case/reports?startDate=${startDate}&endDate=${endDate}`,
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
  patch: async (endpoint, data) => {
    try {
      const response = await api.patch(endpoint, data);
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
