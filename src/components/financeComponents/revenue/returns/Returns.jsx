'use client';
import React, { useEffect, useState } from 'react';

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
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { formatNumber } from '@/utils/numberFormatters';
import ReturnActions from './ReturnActions';
import { Dialog } from '@mui/material';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import BaseFinanceInputTable from '@/components/baseComponents/BaseFinanceInputTable';
import ReceiptVoucher from '../../payments/reciepts/ReceiptVoucher';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';

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

  const [openAction, setOpenAction] = React.useState(false);

  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [selectedBank, setSelectedBank] = React.useState(null);
  const [openAddReturn, setOpenAddReturn] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      receiptNo: item?.recieptNo,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0 && {
      generateReturnTemplate: () => generateBudgetUploadTemplate(),
      uploadReturn: () => {
        setUploadExcel(true);
        setOpenBaseCard(true);
      },
      addReturn: () => {
        setOpenAddReturn(true);
        setOpenBaseCard(true);
      },
    }),
    ...(status === 0
      ? {
          submitReturnForApproval: () => {
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

    ...(status === 2 && {
      // postReceiptToGL: () => setOpenPV(true),
      postReceiptToGL: () => {
        setOpenAction(true);
      },
    }),
  };
  const [openReceiptReport, setOpenReceiptReport] = React.useState(false);

  const baseCardHandlers = {
    'Receipt Voucher': () => setOpenReceiptReport(true),
    // ...(clickedItem &&
    //   status === 2 && {
    //     createReturnReceipt: () => {
    //       setOpenAction(true);
    //     },
    //   }),
    ...(status === 0 &&
      clickedItem && {
        generateReturnTemplate: () => generateBudgetUploadTemplate(),
      }),
    ...(status === 0 && clickedItem
      ? {
          submitReturnForApproval: () => {
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
    ...(status === 2
      ? {
          postReceiptToLedger: () => handlePostReceiptToLedger(),
        }
      : {}),
  };

  const handlePostReceiptToLedger = async () => {
    try {
      // Prepare request data
      const requestData =
        selectedRows.length > 0
          ? {
              receiptList: selectedRows.map((journal) => ({
                receiptId: journal.id,
              })),
            }
          : clickedItem
          ? {
              receiptList: [{ receiptId: clickedItem.id }],
            }
          : null;

      if (!requestData) {
        message.error('No receipts selected or clicked item available.');
        return;
      }

      // API call
      const res = await apiService.post(
        financeEndpoints.postReceiptToLedger,
        requestData
      );

      // Handle response
      if (res.status === 200 && res.data.succeeded) {
        message.success('Receipts posted to ledger successfully.');
      } else {
        message.error(
          res.data.messages?.[0] || 'Failed to post receipts to ledger.'
        );
      }
    } catch (error) {
      console.error('Error posting receipts to ledger:', error);
      message.error('An error occurred while posting receipts to ledger.');
    }
  };
  const submitBudgetForApproval = async () => {
    try {
      const response = await apiService.post(
        financeEndpoints.submitReturnForApproval(clickedItem.id)
      );
      if (response.status === 200 && response.data.succeeded) {
        message.success('Return submitted for approval successfully');
        if (openBaseCard) {
          setOpenBaseCard(false);
        }
      } else if (
        response.data.succeeded === false &&
        response.data.messages &&
        response.data.messages.length > 0
      ) {
        message.error(response.data.messages[0]); // Fixed variable name
      } else {
        message.error('Failed to submit return for approval');
      }
    } catch (error) {
      console.error('Error submitting budget for approval:', error);
    } finally {
      setRefresh((prev) => prev + 1);
    }
  };

  const title = clickedItem
    ? clickedItem?.documentNo
    : uploadExcel
    ? 'Upload Return'
    : 'Add Return';
  const { data: accountingPeriod } = useFetchAsync(
    financeEndpoints.getAccountingPeriods,
    apiService
  );

  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [claims, setClaims] = React.useState([]);

  const { data: paymentMeth } = useFetchAsync(
    financeEndpoints.getPaymentMethods,
    apiService
  );

  const [glAccounts, setGlAccounts] = React.useState([]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.getAllAccounts, {
        'paging.pageSize': 1500,
      });

      setGlAccounts(
        response.data.data.map((account) => ({
          id: account.id,
          name: account.accountNo,
          accountNo: account.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts();
  }, []);
  const [inputData, setInputData] = useState(null);
  const { data: receiptNos } = useFetchAsync(
    financeEndpoints.getUsedNoGeneratorHeader,
    apiService
  );
  const { data: receiptNoLines } = useFetchAsync(
    financeEndpoints.getUsedNoGeneratorHeader,
    apiService
  );
  const { data: allReciepts } = useFetchAsync(
    financeEndpoints.getReceiptPostingGroups,
    apiService
  );
  const { data: crAccounts } = useFetchAsync(
    financeEndpoints.getAccountByAccountTypeNoPage(0),
    apiService
  );
  const { data: drAccounts } = useFetchAsync(
    financeEndpoints.getAccountByAccountTypeNoPage(3),
    apiService
  );
  const { data: paymentMethods } = useFetchAsync(
    financeEndpoints.getPaymentMethods,
    apiService
  );
  const { data: allNos } = useFetchAsync(
    financeEndpoints.getAllGeneratedLines,
    apiService
  );

  const { data: recieptsFromReceipts } = useFetchAsync(
    financeEndpoints.getAllReceipts,
    apiService
  );

  const fields = [
    ...(clickedItem
      ? [
          {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            disabled: true,
          },
        ]
      : []),

    /**{
  "ReceiptId": "3723dbc1-5dde-4a59-8e7c-a42004fa2b41",
{
  "recieptNo": "string",
  "receiptDate": "2025-03-26T09:40:40.451Z",
  "receiptAmount": 0,
  "bankBranchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bankId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "receiptId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "accountNumber": "string",
  "remarks": "string"
}
} */
    ...(clickedItem
      ? [
          {
            name: 'recieptNo',
            label: 'Receipt No',
            type: 'text',
            disabled: true,
            // required: true,
          },
        ]
      : [
          {
            name: 'receiptId',
            label: 'Receipt No',
            type: 'autocomplete',
            required: true,
            options:
              recieptsFromReceipts &&
              recieptsFromReceipts.map((item) => {
                return {
                  id: item.id,
                  name: item.recieptNo
                    ? String(item.recieptNo)
                    : 'No reciept Nos',
                  receiptAmount: item.totalAmount,
                  receiptCode: item.receiptCode,
                  bankId: item.receiptLines?.[0]?.bankId ?? null,
                  bankBranchId: item.receiptLines?.[0]?.bankBranchId ?? null,
                  receiptType: item.receiptLines?.[0]?.receiptTypeId ?? null,
                  drAccountId: item.drAccountId,
                  crAccountId: item.crAccountId,
                  receiptTypeId: item?.receiptTypeId,
                };
              }),
          },
        ]),

    {
      name: 'receiptAmount',
      label: 'Receipt Amount',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'receiptTypeId',
      label: 'Receipt Type',
      type: 'autocomplete',
      disabled: true,
      options:
        allReciepts &&
        allReciepts.map((item) => {
          return {
            id: item.receiptTypeId,
            name: item.receiptTypeName,
            crAccount: item.crAccountNo,
            drAccount: item.drAccountNo,
          };
        }),
    },

    {
      name: 'bankId',
      label: 'Bank',
      type: 'autocomplete',
      disabled: true,
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
      disabled: true,
      required: true,
      options: branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        bankId: branch.bankId,
      })),
    },
    {
      name: 'drAccountId',
      label: 'Debit Account',
      type: 'autocomplete',
      options: drAccounts,
      disabled: true,
    },
    {
      name: 'crAccountId',
      label: 'Credit Account',
      type: 'autocomplete',
      options: crAccounts,
      disabled: true,
    },
    {
      name: 'receiptDate',
      label: 'Voucher Date',
      type: 'date',
      required: true,
      disabled: true,
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'text',
      required: true,
    },
    ...(clickedItem
      ? [
          {
            name: 'isPosted',
            label: 'Is Posted',
            type: 'switch',
            disabled: true,
          },
          {
            name: 'postingDate',
            label: 'Posting Date',
            type: 'date',
            disabled: true,
          },
        ]
      : []),
  ];

  const token = localStorage.getItem('token');

  const generateBudgetUploadTemplate = async () => {
    try {
      // Fetch the file as a blob
      const response = await axios.get(
        `${BASE_CORE_API}api/Revenue/GenerateReturnUploadTemplate`,
        {
          responseType: 'blob', // Specify that the response is a binary Blob
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
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
  const { data: receiptTypes } = useFetchAsync(
    financeEndpoints.getReceiptPostingGroups,
    apiService
  );
  const columnDefs = [
    {
      field: 'documentNo',
      headerName: 'Receipt Voucher No',
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
    // {
    //   field: 'chequeNo',
    //   headerName: 'Cheque No',
    //   headerClass: 'prefix-header',
    //   flex: 1,
    //   cellRenderer: (params) => {
    //     return <p className=" text-primary font-semibold">{params.value}</p>;
    //   },
    // },
    // {
    //   field: 'chequeDate',
    //   headerName: 'Cheque Date',
    //   headerClass: 'prefix-header',
    //   flex: 1,
    // },

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
      field: 'receiptDate',
      headerName: 'Reciept Voucher Date',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return parseDate(params.value);
      },
    },
    {
      field: 'receiptAmount',
      headerName: 'Total Amount',
      headerClass: 'prefix-header',
      flex: 1,

      cellRenderer: (params) => {
        return <div className="text-right">{formatNumber(params.value)}</div>;
      },
    },
    {
      field: 'eftNo',
      headerName: 'EFT No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return (
          <p className=" text-primary font-semibold">
            {params.data?.returnDetails[0]?.chequeOrEftNo}
          </p>
        );
      },
    },
    {
      field: 'receiptTypeId',
      headerName: 'Return Type',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        if (params.value && receiptTypes) {
          const matchingType = receiptTypes.find(
            (item) => item.receiptTypeId === params.value
          );
          return matchingType ? matchingType.description : '';
        }
        return '';
      },
    },
    {
      field: 'bankBranchId',
      headerName: 'Branch',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        const branch = branches.find((branch) => branch.id === params.value);
        return branch?.name;
      },
    },
    {
      field: 'bankId',
      headerName: 'Bank',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        const bank = banks.find((bank) => bank.id === params.value);
        return bank?.name;
      },
    },
    {
      field: 'paymentMethodId',
      headerName: 'Payment Method',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        const paymentMethod =
          paymentMeth &&
          paymentMeth.find(
            (method) =>
              method.id === params.data.returnDetails[0]?.paymentMethodId
          );
        return paymentMethod?.description;
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

  const fetchPensioners = async () => {
    let filters = {};
    let statusArr = [7, 8, 9, 10, 11];

    if (statusArr && statusArr.length > 0) {
      // When statusArr is provided, loop through it and populate criterions array
      statusArr.forEach((status, index) => {
        filters[`filterCriterion.criterions[${index}].propertyName`] = 'stage';
        filters[`filterCriterion.criterions[${index}].propertyValue`] = status;
        filters[`filterCriterion.criterions[${index}].criterionType`] = 0; // Adjust criterionType if necessary
      });
    }

    try {
      const res = await assessApiService.get(
        assessEndpoints.getAssessmentClaims,
        {
          'paging.pageSize': 100000,
          'paging.pageNumber': 1,
          ...filters,
          'filterCriterion.compositionType': 1,
        }
      );
      if (res.status === 200) {
        const mappedData = res.data.data.map((item) => ({
          id: item?.prospectivePensioner?.prospectivePensionerAwards[0]
            ?.pension_award?.prefix
            ? item?.prospectivePensioner?.prospectivePensionerAwards[0]
                ?.pension_award?.prefix + item?.pensioner_number
            : item?.pensioner_number ?? 'N/A',
          name: item?.prospectivePensioner?.prospectivePensionerAwards[0]
            ?.pension_award?.prefix
            ? item?.prospectivePensioner?.prospectivePensionerAwards[0]
                ?.pension_award?.prefix + item?.pensioner_number
            : item?.pensioner_number ?? 'N/A',
          accountName:
            item?.prospectivePensioner?.first_name +
            ' ' +
            item?.prospectivePensioner?.surname,
        }));
        console.log('mappedData', mappedData);
        setClaims(mappedData);
      } // Handle the response as needed
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPensioners();
    fetchBanksAndBranches();
  }, []);

  const uploadFields = [
    ...(clickedItem
      ? [
          {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            disabled: true,
          },
        ]
      : []),

    /**{
  "ReceiptId": "3723dbc1-5dde-4a59-8e7c-a42004fa2b41",
{
  "recieptNo": "string",
  "receiptDate": "2025-03-26T09:40:40.451Z",
  "receiptAmount": 0,
  "bankBranchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bankId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "receiptId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "accountNumber": "string",
  "remarks": "string"
}
} */
    ...(clickedItem
      ? [
          {
            name: 'recieptNo',
            label: 'Receipt No',
            type: 'text',
            // required: true,
          },
        ]
      : [
          {
            name: 'receiptId',
            label: 'Receipt No',
            type: 'autocomplete',
            required: true,
            options:
              recieptsFromReceipts &&
              recieptsFromReceipts.map((item) => {
                return {
                  id: item.id,
                  name: item.recieptNo
                    ? String(item.recieptNo)
                    : 'No reciept Nos',
                  receiptAmount: item.totalAmount,
                  receiptCode: item.receiptCode,
                  bankId: item.receiptLines?.[0]?.bankId ?? null,
                  bankBranchId: item.receiptLines?.[0]?.bankBranchId ?? null,
                  receiptType: item.receiptLines?.[0]?.receiptTypeId ?? null,
                  drAccountId: item.drAccountId,
                  crAccountId: item.crAccountId,
                  receiptTypeId: item?.receiptTypeId,
                };
              }),
          },
        ]),

    {
      name: 'receiptAmount',
      label: 'Receipt Amount',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'receiptTypeId',
      label: 'Receipt Type',
      type: 'autocomplete',
      disabled: true,
      options:
        allReciepts &&
        allReciepts.map((item) => {
          return {
            id: item.receiptTypeId,
            name: item.receiptTypeName,
            crAccount: item.crAccountNo,
            drAccount: item.drAccountNo,
          };
        }),
    },

    {
      name: 'bankId',
      label: 'Bank',
      type: 'autocomplete',
      disabled: true,
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
      disabled: true,
      required: true,
      options: branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        bankId: branch.bankId,
      })),
    },
    {
      name: 'drAccountId',
      label: 'Debit Account',
      type: 'autocomplete',
      options: drAccounts,
      disabled: true,
    },
    {
      name: 'crAccountId',
      label: 'Credit Account',
      type: 'autocomplete',
      options: crAccounts,
      disabled: true,
    },
    {
      name: 'receiptDate',
      label: 'Voucher Date',
      type: 'date',
      required: true,
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'text',
      required: true,
    },
    {
      name: 'accountNumber',
      label: 'Account Number',
      type: 'text',
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

  const { data: months } = useFetchAsync(
    financeEndpoints.getMonths,
    apiService
  );
  const { data: paymentReasons } = useFetchAsync(
    financeEndpoints.getPaymentReturnReasons,
    apiService
  );

  const [inputDataTable, setInputDataTable] = useState(null);
  const returnLineFields = [
    {
      label: 'Return Owner Type',
      value: 'returnOwnerType',
      type: 'select',
      options: [
        { id: 0, name: 'Pensioner' },
        { id: 1, name: 'Dependant' },
        { id: 2, name: 'WCPS' },
        { id: 3, name: 'Secondment' },
      ],
    },
    {
      label: 'Pensioner No',
      value: 'pensionerNo',
      type:
        inputDataTable?.returnOwnerType === 2 ||
        inputDataTable?.returnOwnerType === 3
          ? 'text'
          : 'select',
      required: true,
      options: claims || [], // Ensure options fallback to an empty array if claims is null
    },
    {
      label: 'Pensioner Name',
      value: 'pensionerName',
      type: 'text',
      required: true,
      disabled: !(
        inputDataTable?.returnOwnerType === 2 ||
        inputDataTable?.returnOwnerType === 3
      ),
    },
    {
      label: 'Month',
      value: 'monthId',
      type: 'select',
      required: true,
      options:
        months &&
        months.map((month) => ({ id: month.id, name: month.description })),
    },
    {
      label: 'Return Reason',
      value: 'paymentReturnReasonId',
      type: 'select',
      required: true,
      options:
        paymentReasons &&
        paymentReasons.map((item) => ({
          id: item.id,
          name: item.description,
        })),
    },
    {
      label: 'Amount',
      value: 'amount',
      type: 'amount',
      required: true,
    },

    {
      label: 'Cheque/EFT No',
      value: 'chequeOrEftNo',
      type: 'text',
      required: true,
    },
  ];

  useEffect(() => {
    if (!openBaseCard) {
      setClickedItem(null);
      setOpenAddReturn(false);
      setUploadExcel(false);
    }
  }, [openBaseCard]);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    console.log('recueopt No Lines', receiptNoLines);
    console.log('inputData', inputData);
  }, [inputData]);
  const reportItems = ['Receipt Voucher'];

  useEffect(() => {
    console.log('clicked Item has been changed to:', clickedItem);
  }, [clickedItem]);
  return (
    <div className="">
      <Dialog
        open={openReceiptReport}
        onClose={() => setOpenReceiptReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '55vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <ReceiptVoucher
            crAccounts={crAccounts}
            drAccounts={drAccounts}
            setOpenReceiptReport={setOpenReceiptReport}
            clickedItem={clickedItem}
          />
        </div>
      </Dialog>
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

      <Dialog
        open={openAction}
        onClose={() => {
          setOpenAction(false);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
        }}
      >
        <ReturnActions
          isReceiptVoucher={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setOpenPostGL={setOpenAction}
          clickedItem={clickedItem}
          status={status}
          postApiFunction={financeEndpoints.postReceiptToLedger}
          postApiService={apiService.post}
        />
      </Dialog>

      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        reportItems={reportItems}
      >
        {/* {JSON.stringify(clickedItem)} */}
        {clickedItem ? (
          <>
            <div>
              <BaseAutoSaveInputCard
                fields={fields}
                apiEndpoint={financeEndpoints.addReturn}
                putApiFunction={apiService.post}
                updateApiEndpoint={financeEndpoints.updateReturn}
                postApiFunction={apiService.post}
                getApiEndpoint={
                  status
                    ? financeEndpoints.getReturnsBystageAndId(status)
                    : financeEndpoints.getReturnsById
                }
                getApiFunction={apiService.get}
                transformData={(data) => data}
                useRequestBody={true}
                setOpenBaseCard={setOpenAddReturn}
                isBranch={true}
                refreshData={false}
                setSelectedBank={setSelectedBank}
                setCloseProp={setOpenAddReturn}
                setClickedItem={setClickedItem}
                clickedItem={clickedItem}
                setInputData={setInputData}
              />

              {/* {Do not confuse  } */}

              <BaseFinanceInputTable
                clickedItem={clickedItem}
                title="Return Details"
                fields={returnLineFields}
                id={clickedItem?.id}
                idLabel="returnId"
                getApiService={apiService.get}
                postApiService={apiService.post}
                putApiService={apiService.post}
                getEndpoint={financeEndpoints.getReturnLineById(
                  clickedItem?.id
                )}
                postEndpoint={financeEndpoints.addReturnLine}
                putEndpoint={financeEndpoints.updateReturnLine}
                passProspectivePensionerId={true}
                allOptions={claims}
                refetchData={clickedItem}
                setInputData={setInputDataTable}
              />

              {/* {Do not confuse  } */}
            </div>
          </>
        ) : openAddReturn ? (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addReturn}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateReturn}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getReturnsById}
            getApiFunction={apiService.get}
            transformData={(data) => data}
            useRequestBody={true}
            setOpenBaseCard={setOpenAddReturn}
            isBranch={true}
            refreshData={false}
            setSelectedBank={setSelectedBank}
            setCloseProp={setOpenAddReturn}
            setClickedItem={setClickedItem}
            setInputData={setInputData}
          />
        ) : uploadExcel ? (
          <BaseAutoSaveInputCard
            useFormData={true}
            fields={uploadFields}
            apiEndpoint={financeEndpoints.uploadReturn}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateReturn}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getReturnsById}
            getApiFunction={apiService.get}
            transformData={(data) => data}
            useRequestBody={true}
            setOpenBaseCard={setOpenAddReturn}
            isBranch={true}
            refreshData={false}
            setSelectedBank={setSelectedBank}
            setCloseProp={setOpenAddReturn}
            setClickedItem={setClickedItem}
            setInputData={setInputData}
          />
        ) : (
          <></>
        )}
      </BaseCard>
      <div className="">
        <BaseTable
          refreshData={refresh}
          openBaseCard={openBaseCard}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          setOpenBaseCard={setOpenBaseCard}
          columnDefs={columnDefs}
          fetchApiEndpoint={financeEndpoints.getReturnsByStage(status)}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="Receipt Voucher"
          currentTitle="Receipt Voucher"
          selectedRows={selectedRows}
          onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
          openApproveDialog={openApprove}
        />
      </div>
    </div>
  );
};

export default Returns;
