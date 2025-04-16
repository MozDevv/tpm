'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import {
  AccountBalance,
  AccountBalanceWallet,
  Addchart,
  AssuredWorkload,
  AutoGraph,
  DragIndicator,
  KeyboardArrowRight,
  PeopleAltOutlined,
  Person,
  QueryStats,
  ReceiptLong,
  Wallet,
  Widgets,
} from '@mui/icons-material';
import styles from './sidebar.module.css';
import { Box, Button, Divider, IconButton } from '@mui/material';
import { BarChart, Payments, SupportAgent } from '@mui/icons-material';
import { useSelectedItem } from '@/context/NavItemContext';
import { useIsLoading } from '@/context/LoadingContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { BASE_CORE_API } from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';

export const menuItems = [
  {
    title: 'Dashboard',
    path: '/pensions',
    icon: <DashboardOutlinedIcon />,
  },
  {
    title: 'Preclaims',
    icon: <ArticleOutlinedIcon />,
    children: [
      {
        title: 'Retirees',
        subChildren: [
          {
            title: 'Retirees List',
            path: '/pensions/preclaims/listing',
          },
          {
            title: 'Unnotified Retirees',
            path: '/pensions/preclaims/listing/unnotified',
          },
          {
            title: 'Scheduled Preclaims',
            path: '/pensions/preclaims/listing/scheduled',
          },
          {
            title: 'Notified Retirees',
            path: '/pensions/preclaims/listing/notified',
          },
          {
            title: 'Submissions',
            path: '/pensions/preclaims/listing/submissions',
          },
          {
            title: 'Pending Approvals',
            path: '/pensions/preclaims/approvals',
          },
        ],
      },
      {
        title: 'Returned Claims',
        path: '/pensions/preclaims/returned-claims',
      },
    ],
  },
  {
    title: 'Claims',
    icon: <ArticleOutlinedIcon />,
    children: [
      {
        title: 'Reported Deceased',
        subChildren: [
          {
            title: 'Reported Deceased List',
            path: '/pensions/claims/reported-deceased',
          },
          {
            title: 'Beneficiary Tracking',
            path: '/pensions/claims/igc/dependants-enrollment',
          },
        ],
      },
      {
        title: 'Internally Generated Claims',
        subChildren: [
          {
            title: 'IGC List',
            path: '/pensions/claims/igc/igc-beneficiaries-list',
          },
          {
            title: "IGC Dependant's Pension",
            path: '/pensions/claims/igc/dependant-pension',
          },
          {
            title: 'IGC Killed On Duty',
            path: '/pensions/claims/igc/igc-killed-on-duty',
          },
          {
            title: 'IGC Injury or Disability Pension',
            path: '/pensions/claims/igc/igc-injury-or-disability-pension',
          },
          {
            title: 'IGC Revised Disability',
            path: '/pensions/claims/igc/igc-revised-disability',
          },
          {
            title: 'IGC Revised Cases Court Order',
            path: '/pensions/claims/igc/igc-revised-cases-court-order',
          },
          {
            title: 'IGC Add Beneficiary Alive',
            path: '/pensions/claims/igc/igc-add-beneficiary-alive',
          },
          {
            title: 'IGC Add Beneficiary Deceased',
            path: '/pensions/claims/igc/igc-add-beneficiary-dead',
          },
          {
            title: 'IGC Change of Pay Point',
            path: '/pensions/claims/igc/change-of-paypoint',
          },
          {
            title: 'IGC Revised Computation',
            path: '/pensions/claims/igc/revised-computation',
          },
        ],
      },
      {
        title: 'Claims Management',
        path: '/pensions/claims/claims-management',
      },
      {
        title: 'Claims Verification',
        path: '/pensions/claims/claims-verification',
      },
      {
        title: 'Claims Validation',
        path: '/pensions/claims/claims-validation',
      },
      {
        title: 'Claims Approval',
        path: '/pensions/claims/claims-approval',
      },
    ],
  },
  {
    title: 'Assessment',

    icon: <BarChart />,
    children: [
      {
        title: 'Assessment Data Capture',
        path: '/pensions/assessment/data-capture',
      },
      {
        title: 'Assessment Approval',
        path: '/pensions/assessment/approval',
      },
    ],
  },

  {
    title: 'Directorate',
    path: '/pensions/directorate',
    icon: <ArticleOutlinedIcon />,
  },
  {
    title: 'Controller of Budget',
    path: '/pensions/cob',
    icon: <Payments />,
  },

  {
    title: 'Accounts',
    icon: <AssuredWorkload />,
    children: [
      {
        title: 'Voucher Preparation',
        subChildren: [
          {
            title: 'Claim Records List',
            path: '/pensions/claim-records',
          },
          {
            title: 'Payroll Records',
            path: '/pensions/payroll-records',
          },
        ],
      },

      /**   
       Bgt_New,
      Bgt_Pending_Approval,
      Bgt_Approved,
      Bgt_Closed,
      Bgt_Rejected */

      {
        title: 'General Ledger',
        subChildren: [
          {
            title: 'Chart of Accounts',
            path: '/pensions/finance/general-ledger/charts-of-accounts',
          },

          {
            title: 'General Ledger Entries',
            path: '/pensions/finance/general-ledger/ledger-entries',
          },
        ],
      },
      {
        title: 'General Budget ',
        subChildren: [
          {
            title: 'New Budget',
            path: '/pensions/finance/general-ledger/general-budget/new',
          },
          {
            title: 'Budget Pending Approval',
            path: '/pensions/finance/general-ledger/general-budget/pending-approval',
          },

          {
            title: 'Approved Budget',
            path: '/pensions/finance/general-ledger/general-budget/approved',
          },
          {
            title: 'Closed Budget',
            path: '/pensions/finance/general-ledger/general-budget/closed',
          },
          {
            title: 'Rejected Budget',
            path: '/pensions/finance/general-ledger/general-budget/rejected',
          },
        ],
      },

      {
        title: 'Cash Management',
        subChildren: [
          {
            title: 'Cash Book',
            path: '/pensions/finance/cash-management/cash-book',
          },
          {
            title: 'Bank Account',
            path: '/pensions/finance/cash-management/bank-account',
          },
          {
            title: 'Bank Account Ledger Entries',
            path: '/pensions/finance/cash-management/ledger-entries',
          },
          {
            title: 'Bank Reconciliation',
            path: '/pensions/finance/cash-management/bank-reconciliation',
          },
          {
            title: 'Bank Reconciliation Report',
            path: '/pensions/finance/cash-management/bank-reconciliation-report',
          },
        ],
      },
      {
        title: 'Recievables',
        subChildren: [
          {
            title: 'Customers',
            path: '/pensions/finance/customers',
          },

          {
            title: 'Customer Ledger Entries',
            path: '/pensions/finance/recievables/ledger-entries',
          },
        ],
      },

      {
        title: 'Payables',
        subChildren: [
          {
            title: 'Vendors',
            path: '/pensions/finance/vendor',
          },
          {
            title: 'Vendor Ledger Entries',
            path: '/pensions/finance/payables/ledger-entries',
          },
        ],
      },
      {
        title: 'General Journals',
        path: '/pensions/finance/general-journals',
      },
      {
        title: 'Payments',
        subChildren: [
          {
            title: 'Payment Vouchers',
            path: '/pensions/finance/payments',
          },
          {
            title: 'Pending Payment Vouchers',
            path: '/pensions/finance/payments/pending',
          },

          {
            title: 'Approved Payment Vouchers',
            path: '/pensions/finance/payments/approved',
          },

          {
            title: 'Scheduled Payment Vouchers',
            path: '/pensions/finance/payments/scheduled',
          },
          {
            title: 'Posted Payment Vouchers',
            path: '/pensions/finance/payments/posted',
          },
          {
            title: 'Rejected Payment Vouchers',
            path: '/pensions/finance/payments/rejected',
          },
        ],
      },
      {
        title: 'Scheduled Payments',
        subChildren: [
          /**    {
      Sch_New,
      Sch_Pending_Approval,
      Sch_Approved,
      Sch_Paid,
      Sch_Rejected,
  }
*/
          {
            title: 'New Scheduled Payments',
            path: '/pensions/finance/scheduled-payments/payments/new',
          },
          {
            title: 'Pending Approval',
            path: '/pensions/finance/scheduled-payments/payments/pending-approval',
          },
          {
            title: 'Approved Scheduled Payments',
            path: '/pensions/finance/scheduled-payments/payments/approved',
          },
          {
            title: 'Paid Scheduled Payments',
            path: '/pensions/finance/scheduled-payments/payments/paid',
          },
          {
            title: 'Rejected Scheduled Payments',
            path: '/pensions/finance/scheduled-payments/payments/rejected',
          },
        ],
      },
      {
        title: 'Receipts',
        subChildren: [
          {
            title: 'New Receipts',
            path: '/pensions/finance/recievables/receipts',
          },
          {
            title: 'Pending Receipts',
            path: '/pensions/finance/recievables/receipts/pending',
          },
          {
            title: 'Approved Receipts',
            path: '/pensions/finance/recievables/receipts/approved',
          },
          {
            title: 'Posted Receipts',
            path: '/pensions/finance/recievables/receipts/posted',
          },
        ],
      },

      {
        title: 'Receipt Voucher',
        subChildren: [
          {
            title: 'New Receipt Voucher',
            path: '/pensions/finance/revenue',
          },
          {
            title: 'Receipt Voucher Pending Approval',
            path: '/pensions/finance/revenue/pending-approval',
          },
          {
            title: 'Approved Receipt Voucher',
            path: '/pensions/finance/revenue/approved',
          },
          {
            title: 'Posted Receipt Voucher',
            path: '/pensions/finance/revenue/posted',
          },
          {
            title: 'Paid Receipt Voucher',
            path: '/pensions/finance/revenue/paid',
          },
          {
            title: 'Rejected Receipt Voucher',
            path: '/pensions/finance/revenue/rejected',
          },
        ],
      },
      {
        title: 'Failed Payments',
        path: '/pensions/finance/uncollected-payments',
      },
      {
        title: 'Returns',
        path: '/pensions/finance/old-cases',
      },
    ],
  },

  {
    title: 'Payroll',
    icon: <ReceiptLong />,
    children: [
      {
        title: 'Pensioners Listing',
        path: '/pensions/payroll/pensioners-listing',
      },
      {
        title: 'Run Payroll',
        path: '/pensions/payroll/run-payroll',
      },
      {
        title: 'Main Payroll',
        path: '/pensions/payroll/main-payroll/payroll-run',
        // subChildren: [
        //   {
        //     title: 'Open Payroll',
        //     path: '/pensions/payroll/main-payroll/payroll-run',
        //   },
        //   {
        //     title: 'Pending Approval',
        //     path: '/pensions/payroll/main-payroll/pending-approval',
        //   },
        //   {
        //     title: 'Closed Payroll',
        //     path: '/pensions/payroll/main-payroll/closed',
        //   },
        //   {
        //     title: 'Payroll Review',
        //     path: '/pensions/payroll/main-payroll/review',
        //   },
        //   {
        //     title: 'Suspended Payroll',
        //     path: '/pensions/payroll/main-payroll/suspended-payroll',
        //   },
        // ],
      },
      {
        title: 'Injury Payroll',
        path: '/pensions/payroll/injury/payroll-run',
        // subChildren: [
        //   {
        //     title: 'Open Payroll',
        //     path: '/pensions/payroll/injury/payroll-run',
        //   },
        //   {
        //     title: 'Pending Approval',
        //     path: '/pensions/payroll/injury/pending-approval',
        //   },
        //   {
        //     title: 'Closed Payroll',
        //     path: '/pensions/payroll/injury/closed',
        //   },
        //   {
        //     title: 'Payroll Review',
        //     path: '/pensions/payroll/injury/review',
        //   },
        //   {
        //     title: 'Suspended Payroll',
        //     path: '/pensions/payroll/injury/suspended-payroll',
        //   },
        // ],
      },
      {
        title: 'Dependent Payroll',
        path: '/pensions/payroll/dependent/payroll-run',
        // subChildren: [
        //   {
        //     title: 'Open Payroll',
        //     path: '/pensions/payroll/main-payroll/payroll-run',
        //   },
        //   {
        //     title: 'Pending Approval',
        //     path: '/pensions/payroll/main-payroll/pending-approval',
        //   },
        //   {
        //     title: 'Closed Payroll',
        //     path: '/pensions/payroll/main-payroll/closed',
        //   },
        //   {
        //     title: 'Payroll Review',
        //     path: '/pensions/payroll/main-payroll/review',
        //   },
        //   {
        //     title: 'Suspended Payroll',
        //     path: '/pensions/payroll/main-payroll/suspended-payroll',
        //   },
        // ],
      },
      {
        title: 'Agency Payroll',
        path: '/pensions/payroll/agency/payroll-run',
        // subChildren: [
        //   {
        //     title: 'Open Payroll',
        //     path: '/pensions/payroll/main-payroll/payroll-run',
        //   },
        //   {
        //     title: 'Pending Approval',
        //     path: '/pensions/payroll/main-payroll/pending-approval',
        //   },
        //   {
        //     title: 'Closed Payroll',
        //     path: '/pensions/payroll/main-payroll/closed',
        //   },
        //   {
        //     title: 'Payroll Review',
        //     path: '/pensions/payroll/main-payroll/review',
        //   },
        //   {
        //     title: 'Suspended Payroll',
        //     path: '/pensions/payroll/main-payroll/suspended-payroll',
        //   },
        // ],
      },
      {
        title: 'Payroll Increment',
        path: '/pensions/payroll/payroll-increment',
        // subChildren: [
        //   {
        //     title: 'Payroll Increment',
        //     path: '/pensions/payroll/payroll-increment',
        //   },
        //   {
        //     title: 'Pending Increment Approval',
        //     path: '/pensions/payroll/payroll-increment/pending-approval',
        //   },
        //   {
        //     title: 'Approved Increment',
        //     path: '/pensions/payroll/payroll-increment/approved-increment',
        //   },
        //   {
        //     title: 'Rejected Increment',
        //     path: '/pensions/payroll/payroll-increment/rejected-increment',
        //   },
        // ],
      },
    ],
  },

  {
    title: 'PSSF Contributions',
    icon: <Addchart />,
    children: [
      {
        title: 'Enrollments',
        subChildren: [
          {
            title: 'New Batch Member',
            path: '/pensions/contributions/enrollments/batch-upload',
          },
          {
            title: 'Pending Batch Members',
            path: '/pensions/contributions/enrollments/pending',
          },
          {
            title: 'Approved Batch Members',
            path: '/pensions/contributions/enrollments/approved',
          },

          {
            title: 'Rejected Batch Members',
            path: '/pensions/contributions/enrollments/rejected',
          },
        ],
      },

      /**  {
      Active,
      Deferred,
      Died,
      Retired,
      Leave_of_absence,
      Secondment,
      Fully_paid
  } */
      {
        title: 'Members',
        subChildren: [
          {
            title: 'Member List',
            path: '/pensions/contributions/members',
          },
          {
            title: 'Active Members',
            path: '/pensions/contributions/members/active',
          },
          // {
          //   title: 'Deferred Members',
          //   path: '/pensions/contributions/members/deferred',
          // },
          // {
          //   title: 'Dead Members',
          //   path: '/pensions/contributions/members/dead',
          // },
          // {
          //   title: 'Retired Members',
          //   path: '/pensions/contributions/members/retired',
          // },
          // {
          //   title: 'Leave of Absence Members',
          //   path: '/pensions/contributions/members/leave-of-absence',
          // },
          // {
          //   title: 'Secondment Members',
          //   path: '/pensions/contributions/members/secondment',
          // },
          // {
          //   title: 'Fully Paid Members',
          // path: '/pensions/contributions/members/fully-paid',
          // },
        ],
      },
      // {
      //   title: 'Change Requests',
      //   subChildren: [
      //     {
      //       title: 'Member Change Requests',
      //       path: '/pensions/contributions/change-requests',
      //     },
      //     {
      //       title: 'Next of Kin Change Requests',
      //       path: '/pensions/contributions/change-requests/next-of-kin',
      //     },
      //   ],
      // },
      /**Under Contribution Menu 1 Contribution Processing 2 Contribution Approval 3 Contribution Posting 4 Contribution Reverse */
      {
        title: 'Contributions',
        subChildren: [
          {
            title: 'Open Contributions',
            path: '/pensions/contributions/contribution-processing',
          },
          {
            title: 'Contribution Pending Approval',
            path: '/pensions/contributions/contribution-approval',
          },
          {
            title: 'Approved Contributions',
            path: '/pensions/contributions/contribution-posting',
          },
          {
            title: 'Rejected Contributions',
            path: '/pensions/contributions/contribution-reverse',
          },
        ],
      },
    ],
  },

  {
    title: 'Customer Relations',

    icon: <SupportAgent />,
    children: [
      {
        title: 'Report Deceased Case',

        path: '/pensions/customer-relations/dependants-enrollment',
      },
      {
        title: 'Claim Inquiry',
        path: '/pensions/customer-relations/claim-inquiry',
      },
      {
        title: 'Tickets',
        path: '/pensions/customer-relations/tickets',

        subChildren: [
          {
            title: 'Tickets List',
            path: '/pensions/customer-relations/tickets',
          },
          {
            title: 'Open Tickets',
            path: '/pensions/customer-relations/tickets/open',
          },
          {
            title: 'Pending Tickets',
            path: '/pensions/customer-relations/tickets/assigned',
          },
          {
            title: 'ReAssigned Tickets',
            path: '/pensions/customer-relations/tickets/escalated',
          },
          {
            title: 'Closed Tickets',
            path: '/pensions/customer-relations/tickets/closed',
          },
        ],
      },
      {
        title: 'Complaints',
        path: '/pensions/customer-relations/complaints',
        /**    {
        OPEN,
        ASSIGNED,lai
        ESCALATED,
        CLOSED
    } */
        subChildren: [
          {
            title: 'Complaints List',
            path: '/pensions/customer-relations/complaints',
          },
          {
            title: 'Open Complaints',
            path: '/pensions/customer-relations/complaints/open',
          },
          {
            title: 'Assigned Complaints',
            path: '/pensions/customer-relations/complaints/assigned',
          },
          {
            title: 'Escalated Complaints',
            path: '/pensions/customer-relations/complaints/escalated',
          },
          {
            title: 'Closed Complaints',
            path: '/pensions/customer-relations/complaints/closed',
          },
        ],
      },
    ],
  },
];

export const adminItems = [
  {
    title: 'Users & Teams',
    icon: <PeopleAltOutlined />,
    children: [
      {
        title: 'Manage Users',
        path: '/pensions/users',
      },
      {
        title: 'Departments Setups',
        path: '/pensions/users/setups/departments-setups',
      },
      {
        title: 'Roles Setups',
        path: '/pensions/users/setups/roles-setups',
      },
      // {
      //   title: "Permissions Setups",
      //   path: "/pensions/users/setups/permissions-setups",
      // },
      {
        title: 'Menu Setups',
        path: '/pensions/setups/menus',
      },
      // {
      //   title: "Tables Setups",
      //   path: "/pensions/users/setups/tables-setups",
      // },
      {
        title: 'Roles & Permissions',
        path: '/pensions/users/roles-permissions',
      },
      {
        title: 'Password Rules',
        path: '/pensions/users/password-rules',
      },
      {
        title: 'Counties',
        path: '/pensions/setups/counties',
      },
      // {
      //   title: "Constituencies",
      //   path: "/pensions/setups/constituencies",
      // },
      {
        title: 'Leave Management',
        path: '/pensions/users/leave-management',
      },
    ],
  },
  {
    title: 'Setups',
    icon: <Widgets />,
    children: [
      {
        title: 'General Setups',
        subChildren: [
          {
            title: 'General Settings',
            path: '/pensions/setups/general-settings',
          },
        ],
      },
      {
        title: 'Assessment Setups',
        subChildren: [
          {
            title: 'Pension Factor Setups',
            path: '/pensions/setups/pension-factor-assesment-setups',
          },
          {
            title: 'Tax Types',
            path: '/pensions/setups/tax-types',
          },
          {
            title: 'Tax Bands',
            path: '/pensions/setups/tax-bands',
          },
        ],
      },

      {
        title: 'Finance Setup',
        subChildren: [
          {
            title: 'Operation Setups',
            path: '/pensions/setups/operation-setups',
          },
          {
            title: 'Receipt Generation',
            path: '/pensions/setups/receipt-generation',
          },
          {
            title: 'Receipt Types',
            path: '/pensions/setups/receipt-types',
          },
          {
            title: 'Receipt Posting Groups',
            path: '/pensions/setups/receipt-posting-groups',
          },
          {
            title: 'Recoveries & Deductions',
            path: '/pensions/setups/recoveries-deductions',
          },
          {
            title: 'Recoveries Bank Details',
            path: '/pensions/setups/recovery-bank-details',
          },
          {
            title: 'Account Categories',
            path: '/pensions/setups/account-category',
          },
          {
            title: 'Accounting Period',
            path: '/pensions/setups/accounting-period',
          },
          {
            title: 'Sponsors Setups',
            path: '/pensions/setups/sponsor-setups',
          },
          {
            title: 'Payment Methods',
            path: '/pensions/setups/payment-methods',
          },
          {
            title: 'Payment Reasons',
            path: '/pensions/setups/payment-reasons',
          },
          {
            title: 'Award Posting Groups',
            path: '/pensions/setups/award-posting-groups',
          },
          {
            title: 'Bank Posting Groups',
            path: '/pensions/setups/bank-posting-groups',
          },
          {
            title: 'Business Posting Groups',
            path: '/pensions/setups/business-posting-groups',
          },
          {
            title: 'Customer Posting Groups',
            path: '/pensions/setups/customer-posting-groups',
          },

          {
            title: 'Vendor Posting Group',
            path: '/pensions/setups/vendor-posting-groups',
          },
          {
            title: 'VAT Postings',
            path: '/pensions/setups/vat-postings',
          },

          {
            title: 'Product Posting Groups',
            path: '/pensions/setups/product-posting-groups',
          },
          {
            title: 'General Posting Groups',
            path: '/pensions/setups/general-posting-groups',
          },
          {
            title: 'General Business Posting Groups',
            path: '/pensions/setups/general-business-posting-groups',
          },
          {
            title: 'General Product Posting Groups',
            path: '/pensions/setups/general-product-posting-groups',
          },
        ],
      },

      {
        title: 'CRM Setups',
        subChildren: [
          {
            title: 'Service Categories',
            path: '/pensions/setups/service-categories',
          },
        ],
      },
      {
        title: 'Payroll Setups',
        subChildren: [
          {
            title: 'Payroll Periods',
            path: '/pensions/setups/payroll-periods',
          },
          {
            title: 'Payroll Types',
            path: '/pensions/setups/payroll-types',
          },
          {
            title: 'Increment Master',
            path: '/pensions/setups/increment-master',
          },
          {
            title: 'Suspension Reasons',
            path: '/pensions/setups/suspension-reasons',
          },
        ],
      },
      {
        title: 'Contributions Setups',
        subChildren: [
          {
            title: 'Contribution Types',
            path: '/pensions/setups/contribution-types',
          },
        ],
      },

      {
        title: 'Workflows Setups',
        subChildren: [
          {
            title: 'Approvers',
            path: '/pensions/workflows/setups/approvers',
          },
          {
            title: 'Approval Types',
            path: '/pensions/workflows/setups/approval-types',
          },
          {
            title: 'Approval Stages',
            path: '/pensions/workflows/setups/approval-stages',
          },
        ],
      },

      {
        title: 'Preclaims Setups',
        subChildren: [
          {
            title: 'Parliamentary Terms',
            path: '/pensions/setups/parliamentary-terms',
          },
        ],
      },
      {
        title: 'IGC Setups',
        subChildren: [
          {
            title: 'IGC Document Setups',
            path: '/pensions/setups/igc-document-setups',
          },
        ],
      },

      {
        title: 'No. Series',
        path: '/pensions/setups/no-series',
      },

      {
        title: 'Vendor Posting Groups',
        path: '/pensions/setups/vendor-posting-groups',
      },
      {
        title: 'Cities',
        path: '/pensions/setups/cities',
      },
      {
        title: 'Document Types',
        path: '/pensions/setups/document-types',
      },
      {
        title: 'Pension Caps',
        path: '/pensions/setups/pension-caps',
      },
      {
        title: 'Designation & Grades',
        path: '/pensions/setups/designation-grades',
      },
      {
        title: 'Exit Grounds',
        path: '/pensions/setups/exit-grounds',
      },
      {
        title: 'Postal Codes',
        path: '/pensions/setups/postal-codes',
      },
      {
        title: 'Terms of Service',
        path: '/pensions/setups/termsofservice',
      },
      {
        title: 'Beneficiary Relationships',
        path: '/pensions/setups/beneficiary-relationships',
      },
      {
        title: 'MDAs',
        path: '/pensions/setups/mdas',
      },
      {
        title: 'Pension Awards',
        path: '/pensions/setups/pension-awards',
      },
      {
        title: 'Banks',
        path: '/pensions/setups/banks',
      },
      {
        title: 'Counties',
        path: '/pensions/setups/banks',
      },
      {
        title: 'Constituencies',
        path: '/pensions/setups/banks',
      },
    ],
  },
];
function Sidebar() {
  const [open, setOpen] = useState({});
  const { selectedItem, setSelectedItem } = useSelectedItem();
  const { isLoading, setIsLoading } = useIsLoading();
  const [fetchedMenuItems, setFetchedMenuItems] = useState([]);
  const pathname = usePathname();

  const handleToggle = (title) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [title]: !prevOpen[title],
    }));
  };
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const allItems = [...menuItems, ...adminItems];

    // Flatten all children and subchildren with their parents
    const allChildren = allItems.flatMap((item) =>
      item.children
        ? item.children.flatMap((child) =>
            child.subChildren
              ? child.subChildren.map((subChild) => ({
                  ...subChild,
                  parent: item.title,
                  childParent: child.title,
                }))
              : [{ ...child, parent: item.title }]
          )
        : [{ ...item, parent: null, childParent: null }]
    );

    // Find the selected item in subchildren based on the current path and title
    const selectedChild = allChildren.find(
      (child) => child.path === currentPath && child.title === selectedItem
    );

    if (selectedChild) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [selectedChild.parent]: true,
        [selectedChild.childParent]: true, // Open child as well
      }));
    }
  }, [currentPath, selectedItem, fetchedMenuItems]);

  const { auth } = useAuth();

  const getMenus = async (role) => {
    try {
      if (!role) {
        throw new Error('Role is not defined');
      }
      const res = await axios.get(
        `${BASE_CORE_API}api/MenuItemsSetup/GetMenuJSON1/${role}`
      );

      setFetchedMenuItems(res.data.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.log('Error response:', error.response);
      } else if (error.request) {
        // Request was made but no response was received
        console.log('Error request:', error.request);
      } else {
        // Something else happened while setting up the request
        console.log('Error message:', error.message);
      }
      console.log('Role:', role);
    }
  };

  useEffect(() => {
    getMenus(auth?.user?.roles);
  }, [auth?.user?.roles]);

  const normalizePath = (path) => {
    return path && path.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
  };

  // useEffect(() => {
  //   console.log('Current Path:', window.location.pathname); // Log the current path
  //   console.log('Fetched Menu Items:', fetchedMenuItems); // Log the fetched menu items

  //   const isRouteAllowed = (path, menuItems) => {
  //     // Filter the menu items using the filter function
  //     const filteredMenuItems = filterMenuItems(
  //       [...menuItems, ...adminItems],
  //       fetchedMenuItems
  //     );

  //     // Flatten all paths (including nested children and subchildren)
  //     const allPaths = filteredMenuItems.flatMap((item) =>
  //       item.children
  //         ? item.children.flatMap((child) =>
  //             child.subChildren
  //               ? child.subChildren.map((sub) => sub.path)
  //               : [child.path]
  //           )
  //         : [item.path]
  //     );

  //     console.log('All Paths:', allPaths); // Log all available paths

  //     // Check if the current path is included in the allowed paths
  //     return allPaths.includes(path);
  //   };

  //   // Proceed only when fetchedMenuItems are available
  //   if (fetchedMenuItems.length > 0) {
  //     const hasAccess = isRouteAllowed(router.pathname, fetchedMenuItems);

  //     if (!hasAccess) {
  //       // Redirect to 404 if route is not allowed#
  //       console.log('Redirecting to 404');
  //       // router.replace('/404');
  //     }
  //   }
  // }, [router.pathname, fetchedMenuItems, adminItems, router]);

  const filterMenuItems = (items, fetchedItems) => {
    return items
      .map((item) => {
        const fetchedItem = fetchedItems.find(
          (fetched) => fetched.name === item.title
        );
        if (!fetchedItem) return null;

        const children = item.children
          ? filterMenuItems(item.children, fetchedItem.children || [])
          : null;
        return {
          ...item,
          children,
        };
      })
      .filter((item) => item !== null);
  };

  const filteredMenuItems = filterMenuItems(menuItems, fetchedMenuItems);
  const filteredAdminItems = filterMenuItems(adminItems, fetchedMenuItems);
  //const filteredAdminItems = adminItems;
  const renderSubChildren = (subChildren) => (
    <List component="div" disablePadding>
      {subChildren.map((subChild) => (
        <Link
          href={subChild.path}
          className="no-underline hover:no-underline"
          key={subChild.title}
          prefetch={false}
        >
          <ListItem
            button
            onClick={() => setSelectedItem(subChild.title)}
            sx={{
              pl: 11,
              py: '3px',

              '&:hover': {
                backgroundColor: 'rgba(0, 105, 144, 0.1)',
              },
            }}
          >
            <ListItemText
              sx={{
                color:
                  selectedItem === subChild.title &&
                  currentPath === subChild.path
                    ? '#006990'
                    : 'gray',
                fontWeight: 600,
              }}
            >
              <p className={styles.nav_title}> {subChild.title}</p>
            </ListItemText>
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const renderChildren = (children) => (
    <List component="div" disablePadding>
      {children.map((child) => (
        <React.Fragment key={child.title}>
          {child.subChildren ? (
            <React.Fragment>
              <ListItem
                button
                onClick={() => handleToggle(child.title)}
                sx={{ pl: 10, py: '3px', display: 'flex' }}
              >
                <ListItemText
                  sx={{
                    color: open[child.title] ? '#006990' : 'gray',
                    fontWeight: 700,
                  }}
                >
                  <p className={styles.nav_title}> {child.title}</p>
                </ListItemText>
                {open[child.title] ? (
                  <ExpandLess sx={{ color: 'gray' }} />
                ) : (
                  <ExpandMore sx={{ color: 'gray' }} />
                )}
              </ListItem>
              <Collapse in={open[child.title]} timeout="auto" unmountOnExit>
                {renderSubChildren(child.subChildren)}
              </Collapse>
            </React.Fragment>
          ) : (
            <Link
              href={child.path}
              prefetch={false}
              className="no-underline hover:no-underline"
            >
              <ListItem
                button
                onClick={() => setSelectedItem(child.title)}
                sx={{
                  pl: 10,
                  py: '3px',
                  color: selectedItem === child.title ? '#006990' : '#1F1F1F',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 105, 144, 0.1)',
                  },
                }}
              >
                <ListItemText
                  sx={{
                    color: selectedItem === child.title ? '#006990' : 'gray',
                    fontWeight: 600,
                    display: 'flex',
                  }}
                >
                  <p className={styles.nav_title}> {child.title}</p>
                </ListItemText>
              </ListItem>
            </Link>
          )}
        </React.Fragment>
      ))}
    </List>
  );

  const renderMenuItems = (items) =>
    items.map((item) => (
      <React.Fragment key={item.title}>
        <Link
          href={item.path || '#'}
          className="no-underline hover:no-underline"
          prefetch={false}
        >
          <ListItem
            button
            onClick={() => {
              if (!item.children) {
                setSelectedItem(item.title);
              }
              if (item.children) {
                handleToggle(item.title);
              }
            }}
            sx={{
              mb: '5px',
              backgroundColor:
                open[item.title] || selectedItem === item.title
                  ? '#E5F0F4'
                  : 'transparent',
              borderRadius: '30px',
              color:
                open[item.title] || selectedItem === item.title
                  ? '#006990'
                  : '#1F1F1F',
              '&:hover': {
                backgroundColor: 'rgba(0, 105, 144, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  open[item.title] || selectedItem === item.title
                    ? '#006990'
                    : '#1F1F1F',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                color:
                  open[item.title] || selectedItem === item.title
                    ? '#006990'
                    : 'gray',
                fontWeight: 700,
              }}
              // className="font-bold"
            >
              <p className={styles.nav_title}> {item.title}</p>
            </ListItemText>
            {item.children &&
              (open[item.title] ? (
                <ExpandLess sx={{ color: 'gray' }} />
              ) : (
                <ExpandMore sx={{ color: 'gray' }} />
              ))}
          </ListItem>
        </Link>
        {item.children && (
          <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
            {renderChildren(item.children)}
          </Collapse>
        )}
      </React.Fragment>
    ));

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <div className="sticky top-0 bg-white z-50">
        <img
          src="/logo.png"
          className="w-full h-[75px] pt-2 mb-[-20px] "
          alt=""
        />
      </div>
      <List>
        <h6 className={styles.h6}>MAIN MENU</h6>
        {renderMenuItems(filteredMenuItems)}
        <Divider />
        <h6 className={styles.h6}>ADMINISTRATION</h6>
        {renderMenuItems(filteredAdminItems)}
        <h6 className={styles.h6}>REPORTS</h6>

        <React.Fragment key={'Reports'}>
          <ListItem
            button
            sx={{
              mb: '5px',
              backgroundColor:
                open['Reports'] || selectedItem === 'Reports'
                  ? '#E5F0F4'
                  : 'transparent',
              borderRadius: '30px',
              color:
                open['Reports'] || selectedItem === 'Reports'
                  ? '#006990'
                  : '#1F1F1F',
              '&:hover': {
                backgroundColor: 'rgba(0, 105, 144, 0.1)',
              },
            }}
            onClick={() =>
              window.open(
                'http://localhost:8088/superset/dashboard/p/0KrJVaM9N6m/',
                '_blank'
              )
            }
          >
            <ListItemIcon
              sx={{
                color:
                  open['Reports'] || selectedItem === 'Reports'
                    ? '#006990'
                    : '#1F1F1F',
              }}
            >
              <AutoGraph />
            </ListItemIcon>
            <ListItemText
              sx={{
                color:
                  open['Reports'] || selectedItem === 'Reports'
                    ? '#006990'
                    : 'gray',
                fontWeight: 700,
              }}
              // className="font-bold"
            >
              <p className={styles.nav_title}> {'Reports'}</p>
            </ListItemText>
          </ListItem>
        </React.Fragment>
      </List>
    </Box>
  );
}

export default Sidebar;
