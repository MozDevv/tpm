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
        title: "Pending Approvals",
        path: "/pensions/preclaims/approvals",
      },
      {
        title: "Claims Management",
        path: "/pensions/claims-management",
      },
      {
        title: "Claims Approval",
        path: "/pensions/claims-approval",
      },
    ],
  },
  {
    title: "Assessment",
    path: "/pensions/assessment",
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
        ],
      },
      {
        title: "Cash Management",
        subChildren: [
          {
            title: "Bank Account",
            path: "/pensions/finance/cash-management/bank-account",
          },
        ],
      },
      {
        title: "Payments",
        path: "/finance/payments",
      },
      {
        title: "Recievables",
        path: "/finance/payments",
      },
      {
        title: "Payables",
        path: "/finance/recievables",
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
        title: "Leave Management",
        path: "/pensions/users/leave-management",
      },
    ],
  },
  {
    title: "Setups",

    children: [
      {
        title: "Accounting Period",
        path: "/pensions/setups/accounting-period",
      },
      {
        title: "Account Category",
        path: "/pensions/setups/account-category",
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
