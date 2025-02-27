'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';

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
import { apiService as setupsApiService } from '@/components/services/setupsApi';

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

const Returns = ({ status }) => {
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
  const [selectedBank, setSelectedBank] = React.useState(null);

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
    generateReturnTemplate: () => generateBudgetUploadTemplate(),
    uploadReturn: () => setUploadExcel(true),
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

  const baseCardHandlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
          edit: () => console.log('Edit clicked'),
          delete: () => console.log('Delete clicked'),
          reports: () => console.log('Reports clicked'),
          notify: () => console.log('Notify clicked'),
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
        `${BASE_CORE_API}api/Revenue/GenerateReturnUploadTemplate`,
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
      link.setAttribute('download', 'Return Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error('Error downloading te file:', error);
    }
  };

  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const uploadFields = [
    /**file
string($binary)
ReturnDate
string($date-time)
TotalAmount
number($double)
EFTNo
number($double)
ReturnTypeId
string($uuid)
BankBranchId
string($uuid)
BankId
string($uuid)
 */
    {
      name: 'returnDate',
      label: 'Return Date',
      type: 'date',
      required: true,
    },
    {
      name: 'totalAmount',
      label: 'Total Amount',
      type: 'amount',
      required: true,
    },

    {
      name: 'returnTypeId',
      label: 'Return Type',
      type: 'select',
      required: true,
      options: [
        { id: '1', name: 'Pension' },
        { id: '2', name: 'Deduction' },
      ],
    },
    {
      name: 'eftNo',
      label: 'EFT No',
      type: 'number',
    },
    {
      name: 'bankId',
      label: 'Bank',
      type: 'autocomplete',
      required: true,
      options: banks.map((bank) => ({
        id: bank.id,
        name: bank.name,
      })),
    },
    {
      name: 'bankBranchId',
      label: 'Branch',
      type: 'autocomplete',
      required: true,
      options: branches
        .filter((branch) => branch.bankId === selectedBank)
        .map((branch) => ({
          id: branch.id,
          name: branch.name,
          bankId: branch.bankId,
        })),
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
          setSelectedBank={setSelectedBank}
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

export default Returns;
