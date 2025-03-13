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
import BaseTabs from '@/components/baseComponents/BaseTabs';
import ReturnsLines from './ReturnsLines';

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
      ...item,

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

  const { data: paymentMeth } = useFetchAsync(
    financeEndpoints.getPaymentMethods,
    apiService
  );

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
      field: 'chequeNo',
      headerName: 'Cheque No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className=" text-primary font-semibold">{params.value}</p>;
      },
    },
    {
      field: 'chequeDate',
      headerName: 'Cheque Date',
      headerClass: 'prefix-header',
      flex: 1,
    },

    /**[
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "documentNo": "string",
        "chequeDate": "2025-03-03T05:56:26.450Z",
        "chequeNo": "string",
        "returnDate": "2025-03-03T05:56:26.450Z",
        "totalAmount": 0,
        "eftNo": 0,
        "returnType": 0,
        "bankBranchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "bankId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "paymentMethodId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "returnDetails": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "pensionerName": "string",
            "pensionerNo": "string",
            "returnReason": "string",
            "returnId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "amount": 0
          }
        ]
      }
    ], */
    {
      field: 'returnDate',
      headerName: 'Return Date',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'eftNo',
      headerName: 'EFT No',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'returnType',
      headerName: 'Return Type',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'bankBranchId',
      headerName: 'Branch',
      headerClass: 'prefix-header',
      flex: 1,
      valueGetter: (params) => {
        const branch = branches.find((branch) => branch.id === params.value);
        return branch?.name;
      },
    },
    {
      field: 'bankId',
      headerName: 'Bank',
      headerClass: 'prefix-header',
      flex: 1,
      valueGetter: (params) => {
        const bank = banks.find((bank) => bank.id === params.value);
        return bank?.name;
      },
    },
    {
      field: 'paymentMethodId',
      headerName: 'Payment Method',
      headerClass: 'prefix-header',
      flex: 1,
      valueGetter: (params) => {
        const paymentMethod = paymentMeth.find(
          (method) => method.id === params.value
        );
        return paymentMethod?.name;
      },
    },
  ];
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
        { id: 0, name: 'Monthly' },
        { id: 1, name: 'Lumpsum' },
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

  const tabPanes = [
    {
      key: '1',
      title: "Return's Information",
      content: (
        <div>
          <BaseInputCard
            fields={uploadFields}
            apiEndpoint={financeEndpoints.updateBudget}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            disableAll={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        </div>
      ),
    },
    {
      key: '2',
      title: 'Return Details',
      content: <ReturnsLines payrollLines={clickedItem?.returnDetails} />,
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
        title={'Upload Return'}
        clickedItem={clickedItem}
        isSecondaryCard={true}
        handlers={{
          generateReturnTemplate: () => generateBudgetUploadTemplate(),
        }}
      >
        {' '}
        <BaseInputCard
          fields={uploadFields}
          apiEndpoint={financeEndpoints.uploadReturn}
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
          <>
            <BaseTabs tabPanes={tabPanes} />
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.uploadBudget}
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
          fetchApiEndpoint={financeEndpoints.getReturns}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="Returns"
          currentTitle="Returns"
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          openApproveDialog={openApprove}
        />
      </div>
    </div>
  );
};

export default Returns;
