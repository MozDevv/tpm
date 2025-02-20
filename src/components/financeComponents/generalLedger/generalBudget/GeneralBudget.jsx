'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import GLAccounts from './GLAccounts';
import * as XLSX from 'xlsx';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { message } from 'antd';
import {
  AccessTime,
  Cancel,
  Check,
  DoneAll,
  Verified,
  Visibility,
} from '@mui/icons-material';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import generateExcelTemplate from '@/utils/excelHelper';
import { BASE_CORE_API } from '@/utils/constants';
import axios from 'axios';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import { name } from 'dayjs/locale/en-au';

const statusIcons = {
  0: { icon: Visibility, name: 'New', color: '#1976d2' }, // Blue
  1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
  2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
  3: { icon: DoneAll, name: 'Closed', color: '#2e7d32' }, // Green
  4: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
};

/**
 * Gross Amount
Refund Amount
Pension Amount 
Deduction and Refund
Deduction Amount
Deduction Description.
 */
const columnDefs = [
  {
    field: 'documentNo',
    headerName: 'Document No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
    width: 150,
    pinned: 'left',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    multiple: false,
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    field: 'budgetName',
    headerName: 'Budget Name',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },

  {
    field: 'stage',
    headerName: 'Status',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      const status = statusIcons[params.value];
      if (!status) return null;

      const IconComponent = status.icon;

      return (
        <div
          style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}
        >
          <IconComponent
            style={{
              color: status.color,
              marginRight: '6px',
              fontSize: '17px',
            }}
          />
          <span
            style={{
              color: status.color,
              fontWeight: 'semibold',
              fontSize: '13px',
            }}
          >
            {status.name}
          </span>
        </div>
      );
    },
  },
  {
    field: 'budgetDescription',
    headerName: 'Budget Description',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,

    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,

    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'isBlocked',
    headerName: 'Is Blocked',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const GeneralBudget = ({ status }) => {
  const [uploadExcel, setUploadExcel] = React.useState(false);
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      budgetName: item.budgetName,
      budgetDescription: transformString(item.budgetDescription),
      startDate: item.startDate,
      endDate: item.endDate,
      isBlocked: item.isBlocked,
      documentNo: item.documentNo,
      stage: item.stage,
      accountingPeriodId: item.accountingPeriodId,

      // roles: item.roles,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },
          delete: () => console.log('Delete clicked'),
          reports: () => console.log('Reports clicked'),
          generateBudgetUploadTemplate: () => generateBudgetUploadTemplate(),
          uploadGeneralBudget: () => setUploadExcel(true),
          submitBudgetForApproval: () => {
            if (clickedItem) {
              submitBudgetForApproval();
            } else {
              message.error('Please select a budget to submit for approval');
            }
          },
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const exportToExcel = () => {
    const mapDataFunction = (data) => [
      ['Account No', 'Account Name', 'Budgeted Amount'], // Headers
      ...data.map((item) => [
        item.accountNo,
        item.accountName,
        item.budgetAmount,
      ]),
    ];

    generateExcelTemplate(
      financeEndpoints.fetchGlAccountsById(clickedItem.id, 4),
      mapDataFunction,
      //add start date and end date to the file name
      `Budget ${parseDate(clickedItem.startDate)} to ${parseDate(
        clickedItem.endDate
      )}.xlsx`,
      'budget.xlsx',
      1000
    );
  };

  const baseCardHandlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
          edit: () => console.log('Edit clicked'),
          delete: () => console.log('Delete clicked'),
          reports: () => console.log('Reports clicked'),
          notify: () => console.log('Notify clicked'),
          ...(clickedItem
            ? {
                submitBudgetForApproval: () => {
                  submitBudgetForApproval();
                },
                exportDataToExcel: () => {
                  exportToExcel();
                },
              }
            : {}),
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const submitBudgetForApproval = async () => {
    try {
      const response = await apiService.post(
        financeEndpoints.submitBudgetForApproval(clickedItem.id)
      );
      if (response.status === 200 && response.data.succeeded) {
        message.success('Budget submitted for approval successfully');
        if (openBaseCard) {
          setOpenBaseCard(false);
        }
      }
    } catch (error) {
      console.error('Error submitting budget for approval:', error);
    }
  };

  const title = clickedItem ? clickedItem?.budgetName : 'Create a New Budget';
  const { data: accountingPeriod } = useFetchAsync(
    financeEndpoints.getAccountingPeriods,
    apiService
  );

  const fields = [
    { name: 'budgetName', label: 'Budget Name', type: 'text', required: true },
    {
      name: 'budgetDescription',
      label: 'Budget Description',
      type: 'text',
      required: true,
    },
    // {name: }
    {
      name: 'accountingPeriodId',
      label: 'Accounting Period',
      type: 'autocomplete',
      required: true,
      options:
        accountingPeriod &&
        Array.isArray(accountingPeriod) &&
        accountingPeriod.map((item) => ({
          id: item.id,
          name: item.finYearName,
          startDate: item.fromDate,
          endDate: item.toDate,
        })),
    },

    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      disabled: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      disabled: true,
    },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'switch',
      // required: true,
    },
  ];

  const generateBudgetUploadTemplate = async () => {
    try {
      // Fetch the file as a blob
      const response = await axios.get(
        `${BASE_CORE_API}api/Accounts/GenerateBudgetUploadTemplate`,
        {
          responseType: 'blob', // Specify that the response is a binary Blob
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Budget Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error('Error downloading te file:', error);
    }
  };

  const uploadFields = [
    { name: 'budgetName', label: 'Budget Name', type: 'text', required: true },
    {
      name: 'budgetDescription',
      label: 'Budget Description',
      type: 'text',
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'EndDate', label: 'End Date', type: 'date', required: true },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'switch',
      // required: true,
    },
    {
      name: 'file',
      label: 'Upload File',
      type: 'file',
      required: true,
      fileName: 'Upload Bank Statement',
    },
  ];

  return (
    <div className="">
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
      <BaseCard
        openBaseCard={uploadExcel}
        setOpenBaseCard={setUploadExcel}
        title={'Upload Budget'}
        clickedItem={clickedItem}
        isSecondaryCard={true}
        handlers={{
          generateBudgetUploadTemplate: () => generateBudgetUploadTemplate(),
        }}
      >
        {' '}
        <BaseInputCard
          fields={uploadFields}
          apiEndpoint={financeEndpoints.uploadBudget}
          postApiFunction={apiService.post}
          //  clickedItem={clickedItem}
          useRequestBody={false}
          setOpenBaseCard={setUploadExcel}
          isBranch={true}
          refreshData={false}
        />
      </BaseCard>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <div className="flex flex-col  overflow-auto max-h-[80vh]">
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.updateBudget}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              disableAll={status !== 0}
              setOpenBaseCard={setOpenBaseCard}
            />
            <div className="mt-[-20px]">
              <BaseCollapse name="GL Accounts">
                <GLAccounts
                  clickedBudget={clickedItem}
                  uploadExcel={uploadExcel}
                />
              </BaseCollapse>
            </div>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createBudget}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <div className="">
        <BaseTable
          openBaseCard={openBaseCard}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          setOpenBaseCard={setOpenBaseCard}
          columnDefs={columnDefs}
          fetchApiEndpoint={financeEndpoints.getBudgetByStatus(status)}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="General Budget"
          currentTitle="General Budget"
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          openApproveDialog={openApprove}
        />
      </div>
    </div>
  );
};

export default GeneralBudget;
