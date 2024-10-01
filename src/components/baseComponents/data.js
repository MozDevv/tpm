export const menuItems = [
  {
    title: "Dashboard",
    path: "/pensions",
  },
  {
    title: "Preclaims",
    children: [
      {
        title: "Retirees",
        subChildren: [
          {
            title: "Retirees List",
            path: "/pensions/preclaims/listing",
          },
          {
            title: "Unnotified Retirees",
            path: "/pensions/preclaims/listing/unnotified",
          },
          {
            title: "Notified Retirees",
            path: "/pensions/preclaims/listing/notified",
          },
          {
            title: "Submissions",
            path: "/pensions/preclaims/listing/submissions",
          },
          {
            title: "Pending Approvals",
            path: "/pensions/preclaims/approvals",
          },
        ],
      },
      {
        title: "Returned Claims",
        path: "/pensions/preclaims/returned-claims",
      },
    ],
  },
  {
    title: "Claims",
    children: [
      {
        title: "Claims Management",
        path: "/pensions/claims-management",
      },
      {
        title: "Claims Approval",
        path: "/pensions/claims-approval",
      },
      {
        title: "Claims Verification",
        path: "/pensions/claims/claims-verification",
      },
      {
        title: "Claims Validation",
        path: "/pensions/claims/claims-validation",
      },
      {
        title: "Claims Approval",
        path: "/pensions/claims/claims-approval",
      },
    ],
  },
  {
    title: "Assessment",
    path: "/pensions/assessment",
    children: [
      {
        title: "Assessment Data Capture",
        path: "/pensions/assessment/data-capture",
      },
      {
        title: "Assessment Approval",
        path: "/pensions/assessment/approval",
      },
    ],
  },
  {
    title: "Finance",

    children: [
      {
        title: "General Ledger",
        subChildren: [
          {
            title: "Chart of Accounts",
            path: "/pensions/finance/general-ledger/charts-of-accounts",
          },
          {
            title: "General Budget",
            path: "/pensions/finance/general-ledger/charts-of-accounts",
          },
          {
            title: "General Ledger Entries",
            path: "/pensions/finance/general-ledger/ledger-entries",
          },
        ],
      },
      {
        title: "Cash Management",
        subChildren: [
          {
            title: "Bank Account",
            path: "/pensions/finance/cash-management/bank-account",
          },
          {
            title: "Bank Account Ledger Entries",
            path: "/pensions/finance/cash-management/ledger-entries",
          },
        ],
      },

      {
        title: "Payments",
        path: "/finance/payments",
      },
      {
        title: "General Journals",
        path: "/pensions/finance/general-journals",
      },
      {
        title: "Recievables",
        path: "/finance/payments",
        subChildren: [
          {
            title: "Customers",
            path: "/pensions/finance/customers",
          },
          {
            title: "Customer Ledger Entries",
            path: "/pensions/finance/recievables/ledger-entries",
          },
        ],
      },
      {
        title: "Payables",
        path: "/finance/recievables",
        subChildren: [
          {
            title: "Vendors",
            path: "/pensions/finance/vendor",
          },
          {
            title: "Vendor Ledger Entries",
            path: "/pensions/finance/payables/ledger-entries",
          },
        ],
      },
      // {
      //   title: "Verification",
      //   path: "/pensions/claims-approval",
      // },
    ],
  },
  {
    title: "Directorate",
    path: "/pensions/directorate",
  },
  {
    title: "Controller of Budget",
    path: "/pensions/cob",
  },
  {
    title: "Accounts",
    path: "/pensions/accounts",
  },
  {
    title: "Customer Relations",
    path: "/pensions",
  },
  {
    title: "Users & Teams",

    children: [
      {
        title: "Manage Users",
        path: "/pensions/users",
      },
      {
        title: "Departments Setups",
        path: "/pensions/users/setups/departments-setups",
      },
      {
        title: "Roles Setups",
        path: "/pensions/users/setups/roles-setups",
      },
      // {
      //   title: "Permissions Setups",
      //   path: "/pensions/users/setups/permissions-setups",
      // },
      {
        title: "Menu Setups",
        path: "/pensions/setups/menus",
      },
      // {
      //   title: "Tables Setups",
      //   path: "/pensions/users/setups/tables-setups",
      // },
      {
        title: "Roles & Permissions",
        path: "/pensions/users/roles-permissions",
      },
      {
        title: "Counties",
        path: "/pensions/setups/counties",
      },
      {
        title: "Constituencies",
        path: "/pensions/setups/constituencies",
      },
      {
        title: "Password Rules",
        path: "/pensions/setups/password-rules",
      },
      {
        title: "Leave Management",
        path: "/pensions/users/leave-management",
      },
    ],
  },
  {
    title: "Setups",

    children: [
      {
        title: "General Setups",
        subChildren: [
          {
            title: "General Settings",
            path: "/pensions/setups/general-settings",
          },
        ],
      },
      {
        title: "Assessment Setups",
        subChildren: [
          {
            title: "Pension Factor Setups",
            path: "/pensions/setups/pension-factor-assesment-setups",
          },
        ],
      },
      {
        title: "Finance Setup",
        subChildren: [
          {
            title: "Recoveries & Deductions",
            path: "/pensions/setups/finance-setups/recoveries-deductions",
          },
          {
            title: "Vendor Posting Group",
            path: "/pensions/setups/vendor-posting-groups",
          },
          {
            title: "Account Categories",
            path: "/pensions/setups/account-category",
          },
          {
            title: "Award Posting Groups",
            path: "/pensions/setups/award-posting-groups",
          },
          {
            title: "Payment Methods",
            path: "/pensions/setups/payment-methods",
          },
          {
            title: "Accounting Period",
            path: "/pensions/setups/accounting-period",
          },
          {
            title: "Customer Posting Groups",
            path: "/pensions/setups/customer-posting-groups",
          },
          {
            title: "Bank Posting Groups",
            path: "/pensions/setups/bank-posting-groups",
          },
          {
            title: "Business Posting Groups",
            path: "/pensions/setups/business-posting-groups",
          },
          {
            title: "Product Posting Groups",
            path: "/pensions/setups/product-posting-groups",
          },
          {
            title: "General Posting Groups",
            path: "/pensions/setups/general-posting-groups",
          },
          {
            title: "General Business Posting Groups",
            path: "/pensions/setups/general-business-posting-groups",
          },
          {
            title: "General Product Posting Groups",
            path: "/pensions/setups/general-product-posting-groups",
          },
        ],
      },
      {
        title: "Workflows Setups",
        subChildren: [
          {
            title: "Approvers",
            path: "/pensions/workflows/setups/approvers",
          },
          {
            title: "Approval Types",
            path: "/pensions/workflows/setups/approval-types",
          },
        ],
      },
      {
        title: "Preclaims Setups",
        subChildren: [
          {
            title: "Parliamentary Terms",
            path: "/pensions/setups/parliamentary-terms",
          },
        ],
      },
      {
        title: "City Setups",
        path: "/pensions/setups/city-setups",
      },
      {
        title: "No. Series",
        path: "/pensions/setups/no-series",
      },
      {
        title: "Document Types",
        path: "/pensions/setups/document-types",
      },
      {
        title: "Pension Caps",
        path: "/pensions/setups/pension-caps",
      },
      {
        title: "Terms of Service",
        path: "/pensions/setups/termsofservice",
      },
      {
        title: "Cities",
        path: "/pensions/setups/cities",
      },
      {
        title: "MDAs",
        path: "/pensions/setups/mdas",
      },
      {
        title: "Exit Grounds",
        path: "/pensions/setups/exit-grounds",
      },
      {
        title: "Postal Codes",
        path: "/pensions/setups/postal-codes",
      },
      {
        title: "Designation & Grades",
        path: "/pensions/setups/designation-grades",
      },
      {
        title: "Pension Awards",
        path: "/pensions/setups/pension-awards",
      },
      {
        title: "Banks",
        path: "/pensions/setups/banks",
      },
      {
        title: "Counties",
        path: "/pensions/setups/banks",
      },
      {
        title: "Constituencies",
        path: "/pensions/setups/banks",
      },
    ],
  },
];
