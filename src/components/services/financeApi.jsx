/* eslint-disable no-useless-catch */
import axios from 'axios';
import { BASE_CORE_API } from '@/utils/constants';
import { create } from '@mui/material/styles/createTransitions';

export const API_BASE_URL = `${BASE_CORE_API}api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthorizationHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
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
const financeEndpoints = {
  fetchGlAccounts: '/Accounts/GetGLAccounts',
  fetchGlAccountsById: (id) => `/Accounts/GetGLAccounts?budgetId=${id}`,
  fetchGlAccountTypes: '/AccountsSetup/GetGLAccountTypes',
  createGlAccount: '/Accounts/AddGLAccount',
  getAccountGroupTypes: '/AccountsSetup/GetAccountGroups',
  updateGlAccount: `/Accounts/UpdateGLAccount/`,
  deleteGlAccount: (id) => `/Accounts/DeleteGLAccount?id=${id}`,

  createBudget: '/Accounts/AddBudget',
  getBudget: '/Accounts/GetBudget',

  addBudgetLines: '/Accounts/AddBudgetLines',
  updateBudgetLine: '/Accounts/UpdateBudgetLines',

  addAccountGroup: '/AccountsSetup/AddAccountGroup',
  getAccountGroups: '/AccountsSetup/GetAccountGroups',
  updateAccountGroup: '/AccountsSetup/UpdateAccountGroup',
  deleteAccountGroup: (id) => `/AccountsSetup/DeleteAccountGroup?id=${id}`,

  getAccountSubGroups: '/AccountsSetup/GetAccountSubGroups',
  addAccountSubGroup: '/AccountsSetup/AddAccountSubGroup',
  updateAccountSubGroup: '/AccountsSetup/UpdateAccountSubGroup',
  deleteAccountSubGroup: (id) =>
    `/AccountsSetup/DeleteAccountSubGroup?id=${id}`,

  addAccountingPeriod: '/AccountsSetup/AddAccountingPeriod',
  getAccountingPeriodById: (id) =>
    `/AccountsSetup/GetAccountingPeriod?id=${id}`,
  getAccountingPeriods: '/AccountsSetup/GetAccountingPeriod',
  updateAccountingPeriod: '/AccountsSetup/UpdateAccountingPeriod',
  deleteAccountingPeriod: (id) =>
    `/AccountsSetup/DeleteAccountingPeriod?id=${id}`,

  getAccountingPeriodLines: '/AccountsSetup/GetAccountingPeriodLines',

  addAccountingPeriodLines: '/AccountsSetup/AddAccountingPeriodLine',
  updateAccountingPeriodLines: '/AccountsSetup/UpdateAccountingPeriodLine',
  deleteAccountingPeriodLines: (id) =>
    `/AccountsSetup/DeleteAccountingPeriodLine?id=${id}`,

  addBankAccount: '/Accounts/AddBankAccount',
  getBankAccounts: '/Accounts/GetBankAccount',
  updateBankAccount: '/Accounts/UpdateBankAccount',
  deleteBankAccount: (id) => `/Accounts/DeleteBankAccount?id=${id}`,

  addVendor: '/Accounts/AddVendor',
  getVendors: '/Accounts/GetVendors',
  updateVendor: '/Accounts/UpdateVendor',
  deleteVendor: (id) => `/Accounts/DeleteVendor?id=${id}`,

  addCustomer: '/Accounts/AddCustomer',
  getCustomers: '/Accounts/GetCustomer',
  updateCustomer: '/Accounts/UpdateCustomer',
  deleteCustomer: (id) => `/Accounts/DeleteCustomer?id=${id}`,

  getVendorPostingGroups: '/PostingSetup/GetVendorPostingGroups',
  updateVendorPostingGroup: '/PostingSetup/UpdateVendorPostingGroup',
  addVendorPostingGroup: '/PostingSetup/AddVendorPostingGroup',
  deleteVendorPostingGroup: (id) =>
    `/PostingSetup/DeleteVendorPostingGroup?id=${id}`,

  getCustomerPostingGroup: '/PostingSetup/GetCustomerPostingGroups',
  updateCustomerPostingGroup: '/PostingSetup/UpdateCustomerPostingGroup',
  addCustomerPostingGroup: '/PostingSetup/AddCustomerPostingGroup',
  deleteCustomerPostingGroup: (id) =>
    `/PostingSetup/DeleteCustomerPostingGroup?id=${id}`,

  getBankPostingGroups: '/PostingSetup/GetBankPostingGroups',
  updateBankPostingGroup: '/PostingSetup/UpdateBankPostingGroup',
  addBankPostingGroup: '/PostingSetup/AddBankPostingGroup',
  deleteBankPostingGroup: (id) =>
    `/PostingSetup/DeleteBankPostingGroup?id=${id}`,

  addBusinessPostingGroup: '/PostingSetup/AddBusinessPostingGroup',
  getBusinessPostingGroups: '/PostingSetup/GetBusinessPostingGroups',
  updateBusinessPostingGroup: '/PostingSetup/UpdateBusinessPostingGroup',
  deleteBusinessPostingGroup: (id) =>
    `/PostingSetup/DeleteBusinessPostingGroup?id=${id}`,

  getProductPostingGroups: '/PostingSetup/GetProductPostingGroups',
  addProductPostingGroup: '/PostingSetup/AddProductPostingGroup',
  updateProductPostingGroup: '/PostingSetup/UpdateProductPostingGroup',
  deleteProductPostingGroup: (id) =>
    `/PostingSetup/DeleteProductPostingGroup?id=${id}`,

  addGeneralBusinessPostingGroup:
    '/PostingSetup/AddGeneralBusinessPostingGroup',
  getGeneralBusinessPostingGroups:
    '/PostingSetup/GetGeneralBusinessPostingGroups',
  updateGeneralBusinessPostingGroup:
    '/PostingSetup/UpdateGeneralBusinessPostingGroup',
  deleteGeneralBusinessPostingGroup: (id) =>
    `/PostingSetup/DeleteGeneralBusinessPostingGroup?id=${id}`,

  addGeneralProductPostingGroup: '/PostingSetup/AddGeneralProductPostingGroup',
  getGeneralProductPostingGroups:
    '/PostingSetup/GetGeneralProductPostingGroups',
  updateGeneralProductPostingGroup:
    '/PostingSetup/UpdateGeneralProductPostingGroup',
  deleteGeneralProductPostingGroup: (id) =>
    `/PostingSetup/DeleteGeneralProductPostingGroup?id=${id}`,

  addGeneralPostingGroup: '/PostingSetup/AddGeneralPostingSetup',
  getGeneralPostingGroups: '/PostingSetup/GetGeneralPostingSetups',
  updateGeneralPostingGroup: '/PostingSetup/UpdateGeneralPostingSetup',
  deleteGeneralPostingGroup: (id) =>
    `/PostingSetup/DeleteGeneralPostingSetup?id=${id}`,

  addVatSetup: '/PostingSetup/AddVATPostingSetup',
  getVatSetups: '/PostingSetup/GetVATPostingSetups',
  updateVatSetup: '/PostingSetup/UpdateVATPostingSetup',
  deleteVatSetup: (id) => `/PostingSetup/DeleteVATPostingSetup?id=${id}`,

  getAccountByAccountType: (accountType) =>
    `/Accounts/GetAccounts?AccountType=${accountType}`,

  getAllAccounts: `/Accounts/GetAccounts`,

  getAccounts: '/api/Accounts/GetAccounts',
  getGeneralJournals: '/Posting/GetGeneralJournals',

  addGeneralJournal: '/Posting/AddGeneralJournal',
  getGeneralJournalsById: (id) => `/Posting/GetGeneralJournals?id=${id}`,
  editGeneralJournal: '/Posting/UpdateGeneralJournal',
  deleteGeneralJournal: (id) => `/Posting/DeleteGeneralJournal?id=${id}`,

  addGeneralJournalLine: '/Posting/AddGeneralJournalLine',
  editGeneralJournalLine: '/Posting/UpdateGeneralJournalLine',
  deleteGeneralJournalLine: (id) =>
    `/Posting/DeleteGeneralJournalLine?id=${id}`,
  getGeneralJournalLines: (id) => `/Posting/GetJournalLines?JournalId=${id}`,

  postGeneralJournalsToLedger: '/Posting/PostGeneralJournalToLedger',

  //sub-ledgers
  vendorSubLedger: '/api/Posting/GetVendorSubLedger',
  customerSubLedger: '/api/Posting/GetCustomerSubLedger',
  bankSubLedger: '/api/Posting/GetBankSubLedger',
  glSubLedger: '/api/Posting/GetGeneralLedgerDetail',

  bankSubLedgerPayments: '/Posting/GetBankSubLedger',

  addPaymentMethod: '/AccountsSetup/AddPaymentMethod',
  getPaymentMethods: '/AccountsSetup/GetPaymentMethods',
  updatePaymentMethod: '/AccountsSetup/UpdatePaymentMethod',
  deletePaymentMethod: (id) => `/AccountsSetup/DeletePaymentMethod?id=${id}`,

  //Payments
  addPayment: '/Posting/AddPayment',
  getPayments: '/Posting/GetPayments',
  updatePayment: '/Posting/UpdatePayment',
  getPaymentById: (id) => `/Posting/GetPayments?id=${id}`,
  getPaymentByStages: (stage) =>
    `/Posting/GetPayments?PaymentVoucherStage=${stage}`,
  deletePayment: (id) => `/Posting/DeletePayment?id=${id}`,
  addPaymentLine: '/Posting/AddPaymentLine',
  updatePaymentLine: '/Posting/UpdatePaymentLine',
  deletePaymentLine: (id) => `/Posting/DeletePaymentLine?id=${id}`,
  getPaymentLines: (id) => `/Posting/GetPaymentLines?PaymentId=${id}`,

  //Award Documents

  addAwardPostingGroup: '/PostingSetup/AddAwardPostingGroup',
  getAwardPostingGroups: '/PostingSetup/GetAwardPostingGroups',
  updateAwardPostingGroup: '/PostingSetup/UpdateAwardPostingGroup',
  deleteAwardPostingGroup: (id) =>
    `/PostingSetup/DeleteAwardPostingGroup?id=${id}`,

  getPensionAwards: '/Setups/GetPensionAwards',
  pensionCaps: '/Setups/GetPensionCaps',

  //RECOVERIES AND DEDUCTIONSgetPaymentById
  addRecoveryDeduction: '/PostingSetup/AddDeductionsAndRefund',
  getRecoveryDeductions: '/PostingSetup/GetDeductionsAndRefunds',
  updateRecoveryDeduction: '/PostingSetup/UpdateDeductionsAndRefund',
  deleteRecoveryDeduction: (id) =>
    `/PostingSetup/DeleteDeductionsAndRefund?id=${id}`,
  addOperationSetup: '/PostingSetup/AddOperationSetup',
  getOperationSetups: '/PostingSetup/GetOperationSetups',
  updateOperationSetup: '/PostingSetup/UpdateOperationSetup',
  deleteOperationSetup: (id) => `/PostingSetup/DeleteOperationSetup?id=${id}`,

  submitPVforApproval: (id) =>
    `/Posting/SubmitPaymentForApproval?PaymentId=${id}`,
  approvePv: (id) => `/Posting/ApprovePayment?PaymentId=${id}`,
  createPaymentSchedule: '/Posting/CreatePensionPaymentSchedule',
  postClaimPitoLegder: '/Posting/PostClaimPIToLedger',

  getPaymentSchedules: '/Posting/GetPaymentSchedules',
  getPaymentScheduleLines: (id) =>
    `/Posting/GetPaymentScheduleLines?PaymentScheduleId=${id}`,

  getBankStatement: (id) => `/Posting/GetBankStatement?BankAccountId=${id}`,

  uploadBankStatement: '/Posting/UploadBankStatement',

  generateBudgetUploadTemplate: '/Accounts/GenerateBudgetUploadTemplate',
  uploadBudget: '/Accounts/UploadBudget',
  matchBankDetails: '/Posting/MatchBankDetails',
  getReceipts: '/Posting/GetReceipts',
  getReceiptsById: (id) => `/Posting/GetReceipts?id=${id}`,
  addReceipt: '/Posting/AddReceipt',
  updateReceipt: '/Posting/UpdateReceipt',
  updateTheReceipt: '/Posting/UpdateReceipt',
  deleteReceipt: (id) => `/Posting/DeleteReceipt?id=${id}`,

  addReceiptLine: '/Posting/AddReceiptLine',
  updateReceiptLine: '/Posting/UpdateReceiptLine',
  deleteReceiptLine: (id) => `/Posting/DeleteReceiptLine?id=${id}`,
  getReceiptLines: (id) => `/Posting/GetReceiptLines?ReceiptId=${id}`,

  removeMatch: `/Posting/RemoveMatch`,
  deleteUploadedStatement: (id) =>
    `/Posting/DeleteUploadedStatement?BankReconciliationId=${id}`,

  reconcileBankDetails: '/Posting/ReconcileBankDetails',

  getGLAccountsAccounttype: (accountType) =>
    `/Accounts/GetAccounts?AccountType=${accountType}`,

  postPaymentToLedger: '/Posting/PostPaymentToLedger',
  postReceiptToLedger: '/Posting/PostReceiptToLedger',

  bankDrillDown: (val) =>
    `/Posting/GetBankSubLedger?filterCriterion.compositionType=0&filterCriterion.criterions[0].criterionType=0&filterCriterion.criterions[0].propertyName=bankAccountCode&filterCriterion.criterions[0].propertyValue=${val}`,
  vendorDrillDown: (val) => `/Posting/GetVendorSubLedger?VendorId=${val}`,

  customenrDrillDown: (val) =>
    `/Posting/GetCustomerSubLedger?CustomerId=${val}`,

  glDrillDown: (val) => `/Posting/GetGeneralLedgerDetail?GlAccountId=${val}`,

  postClaimtoFinance: 'Posting/PostClaimPIToLedger',

  postScheduledPaymentToLedger: '/Posting/PostClaimPaymentToLedger',

  //contributions

  addSponsor: '/Contribution/AddSponsor',
  getSponsors: '/Contribution/GetSponsors',
  updateSponsor: '/Contribution/UpdateSponsor',
  deleteSponsor: (id) => `/Contribution/DeleteSponsor?id=${id}`,

  addBatchUpload: 'Contribution/AddMemberUploadBatch',
  getBatchUploads: 'Contribution/GetMemberUploadBatches',
  updateBatchUpload: 'Contribution/UpdateMemberUploadBatch',
  deleteBatchUpload: (id) => `/Contribution/DeleteMemberUploadBatch?id=${id}`,

  uploadMembersExcel: '/Contribution/UploadMembers',

  getMemberUploadTemplate: 'Contribution/GetMemberUploadTemplate',

  addMember: '/Contribution/AddMember',
  getMembers: '/Contribution/GetMember',
  getMemberById: (id) => `/Contribution/GetMember?id=${id}`,

  addMemberChangeRequest: '/Contribution/AddMemberChangeRequest',
  getMemberChangeRequests: '/Contribution/GetMemberChangeRequest',
  getMemberChangeRequestById: (id) =>
    `/Contribution/GetMemberChangeRequest?id=${id}`,
  updateMemberChangeRequest: '/Contribution/UpdateMemberChangeRequest',
  deleteMemberChangeRequest: (id) =>
    `/Contribution/DeleteMemberChangeRequest?id=${id}`,

  getMemberByStatus: (status) =>
    `/Contribution/GetMember?MembershipStatus=${status}`,
  updateMember: '/Contribution/UpdateMember',
  deleteMember: (id) => `/Contribution/DeleteMember?id=${id}`,

  addMemberNextOfKin: '/Contribution/AddMemberNextOfKin',
  getMemberNextOfKin: (id) => `/Contribution/GetMemberNextOfKin?MemberId=${id}`,
  updateMemberNextOfKin: '/Contribution/UpdateMemberNextOfKin',
  deleteMemberNextOfKin: (id) => `/Contribution/DeleteMemberNextOfKin?id=${id}`,

  //Reports
  getTrialBalance: '/Reports/GetTrialBalance',

  getPaymentVoucherReport: (id) =>
    `/Reports/GetPaymentVoucherReport?PaymentId=${id}`,

  getContributionType: '/Contribution/GetContributionType',
  createContributionType: '/Contribution/AddContributionType',
  updateContributionType: '/Contribution/UpdateContributionType',
  deleteContributionType: (id) => `/Contribution/DeleteContributionType/${id}`,

  getContributionBatches: '/Contribution/GetContributionBatches',
  uploadContributions: '/Contribution/UploadContributions',

  getContributions: '/Contribution/GetContributions',

  generateContributionTemplate: '/Contribution/GetContributionUploadTemplate',
  submitBatchForApproval: '/Contribution/SubmitContributionForApproval',
  previewMemberDetails: '/Contribution/PreviewMemberDetails',
  downloadMemberTemplate: '/Contribution/DownloadMemberTemplate',

  removePaymentFromSchedule: '/Posting/RemovePaymentVoucherFromSchedule',
  addPaymentsToSchedule:
    '/Posting/AddNewPaymentVouchersToExistingPaymentSchedule',

  deletePaymentSchedule: '/Posting/DeletePaymentSchedule',

  submitBudgetForApproval: (id) =>
    `/Posting/SubmitBudgetForApproval?BudgetId=${id}`,

  closeAccountingPeriod: '/Posting/CloseIncomeStatement',
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
