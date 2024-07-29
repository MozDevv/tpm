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
];
