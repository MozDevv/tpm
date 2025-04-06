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
import { useRowDataSore } from '@/zustand/store';

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

const UncollectedPayments = ({ status }) => {
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
    create: () => {
      setOpenBaseCard(true);
    },
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
    // create:
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
    : 'New Uncollected Payment';
  const { data: accountingPeriod } = useFetchAsync(
    financeEndpoints.getAccountingPeriods,
    apiService
  );

  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [claims, setClaims] = React.useState([]);

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
  const { data: paymentReasons } = useFetchAsync(
    financeEndpoints.getPaymentReturnReasons,
    apiService
  );
  const { data: scheduledClaims } = useFetchAsync(
    financeEndpoints.getScheduledPensioners,
    apiService
  );

  // const { rowData, setRowData } = useRowDataSore();
  const fields = [
    ...(clickedItem
      ? [
          {
            name: 'documentNo',
            label: 'Voucher Number',
            type: 'text',
            disabled: true,
          },
        ]
      : []),
    // {
    //   name: 'chequeType',
    //   label: 'Cheque Type',
    //   type: 'select',
    //   options: [
    //     { id: 0, name: 'Own Cheque' },
    //     { id: 1, name: 'Bankers Cheque' },
    //     { id: 2, name: 'Cash' },
    //   ],
    // },
    // {
    //   name: 'depType',
    //   label: 'Pen/Deposit Type',
    //   type: 'select',
    //   options: [
    //     { id: 0, name: 'Pensioner' },
    //     { id: 1, name: 'Dependant' },
    //   ],
    // },
    // {
    //   name: 'checkSubType',
    //   label: 'Cheque Sub Type',
    //   type: 'select',
    //   required: true,
    //   options: [
    //     { id: 0, name: 'Net' },
    //     { id: 1, name: 'Deductions' },
    //     { id: 2, name: 'Return' },
    //   ],
    // },
    // {
    //   name: 'penDepType',
    //   label: 'Pensioner/Dependant',
    //   type: 'select',
    //   required: true,
    //   options: [
    //     { id: 0, name: 'Pensioner' },
    //     { id: 1, name: 'Dependant' },
    //   ],
    // },
    {
      name: 'pensionerNo',
      label: 'Amount Paid',
      type: 'select',
      table: true,
      // disabled: true,
      options:
        scheduledClaims &&
        scheduledClaims.map((data) => ({
          id: data?.pensionerNo,
          name: data?.netAmount,

          paymentVoucherNo: data.paymentVoucherNo,
          pensionerName: data.pensionerName,
          nationalIdNo: data.nationalIdNo,
          bankAccountName: data.bankAccountName,
          scheduleNo: data.scheduleNo,
          netAmount: data.netAmount,
          scheduleDate: data.scheduleDate,
          accountNo: data.accountNo,
          paymentVoucherDate: data.paymentVoucherDate,
          eftNo: data.eftNo,
          bankId: data.bankId,
          bankBranchId: data.bankBranchId,
          crAccountId: data.crAccountId,
          drAccountId: data.drAccountId,
          drAccountNo: data.drAccountNo,
          crAccountNo: data.crAccountNo,
          paymentId: data.paymentId,
          paymentMethodId: data.paymentMethodId,
          paymentReturnReasonId: data.paymentReturnReasonId,
          paymentScheduleId: data.paymentScheduleId,
        })),
      required: true,
    },
    {
      name: 'paymentVoucherNo',
      label: 'Payment Voucher No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'paymentVoucherDate',
      label: 'Payment Voucher Date',
      type: 'date',
      disabled: true,
    },

    {
      name: 'pensionerName',
      label: 'Pensioner Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'nationalIdNo',
      label: 'National ID No',
      type: 'text',
      disabled: true,
    },

    {
      name: 'scheduleNo',
      label: 'Schedule No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'netAmount',
      label: 'Payment Amount',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'drAccountId',
      label: 'Debit Account',
      type: 'autocomplete',
      options: drAccounts,
      disabled: true,
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
      name: 'crAccountId',
      label: 'Credit Account',
      type: 'autocomplete',
      options: crAccounts,
      disabled: true,
    },
    {
      name: 'eftNo',
      label: 'Payment Cheque No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'scheduleDate',
      label: 'Payment Cheque Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'returnChequeOrEftNo',
      label: 'Return Cheque No',
      type: 'text',
    },
    {
      name: 'returnChequeOrEftDate',
      label: 'Return Cheque Date',
      type: 'date',
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'select',
      options:
        // paymentReasons &&
        paymentReasons &&
        paymentReasons.map((item) => ({
          id: item.id,
          name: item.description,
        })),
    },
    {
      name: 'returnVoucherDate',
      label: 'Return Voucher Date',
      type: 'date',
      required: true,
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'text',
      required: true,
    },
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
      field: 'paymentVoucherNo',
      headerName: 'Payment Voucher No',
      headerClass: 'prefix-header',
      width: 150,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'pensionerNo',
      headerName: 'Pensioner No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-primary font-semibold">{params.value}</p>;
      },
    },
    {
      field: 'pensionerName',
      headerName: 'Pensioner Name',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: 'nationalIdNo',
      headerName: 'National ID No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p>{params.value}</p>;
      },
    },

    {
      field: 'scheduleNo',
      headerName: 'Schedule No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <div className="text-right">{formatNumber(params.value)}</div>;
      },
    },
    {
      field: 'scheduleDate',
      headerName: 'Schedule Date',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return parseDate(params.value);
      },
    },

    {
      field: 'paymentVoucherDate',
      headerName: 'Payment Voucher Date',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return parseDate(params.value);
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

  const { data: months } = useFetchAsync(
    financeEndpoints.getMonths,
    apiService
  );

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
                apiEndpoint={financeEndpoints.createFailedPayment}
                putApiFunction={apiService.post}
                updateApiEndpoint={financeEndpoints.updateReturn}
                postApiFunction={apiService.post}
                getApiEndpoint={
                  status
                    ? financeEndpoints.getFailedPayments
                    : financeEndpoints.getFailedPayments
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

              {/* <BaseFinanceInputTable
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
              /> */}

              {/* {Do not confuse  } */}
            </div>
          </>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createFailedPayment}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateReturn}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getFailedPayments}
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
          fetchApiEndpoint={financeEndpoints.getFailedPayments}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="Failed Payments"
          currentTitle="Failed Payments"
          selectedRows={selectedRows}
          onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
          openApproveDialog={openApprove}
        />
      </div>
    </div>
  );
};

export default UncollectedPayments;
