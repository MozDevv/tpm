'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';

import financeEndpoints from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { Dialog } from '@mui/material';
import RecieptLines from './ReceiptLines';
import ReceiptActions from './ReceiptActions';
import { message } from 'antd';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import {
  AccessTime,
  AddTask,
  Cancel,
  Verified,
  Visibility,
} from '@mui/icons-material';
import ReceiptVoucher from './ReceiptVoucher';
import { formatNumber } from '@/utils/numberFormatters';

const Reciepts = ({ status }) => {
  const statusIcons = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: AddTask, name: 'Posted', color: '#2e7d32' }, // Red
  };
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [bankAccounts, setBankAccounts] = React.useState([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await apiService.get(financeEndpoints.getPaymentMethods, {
          'paging.pageSize': 2000,
        });
        if (res.status === 200) {
          setPaymentMethods(
            res.data.data.map((meth) => {
              return {
                id: meth.id,
                name: meth.code,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBankAccounts = async () => {
      try {
        const res = await apiService.get(financeEndpoints.getBankAccounts, {
          'paging.pageSize': 2000,
        });
        if (res.status === 200) {
          setBankAccounts(
            res.data.data.map((acc) => {
              return {
                id: acc.id,
                name: acc.bankAccountName,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPaymentMethods();
    fetchBankAccounts();
  }, []);

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [isSchedule, setIsSchedule] = React.useState(false);
  const [openPV, setOpenPV] = React.useState(false);
  const [openApprove, setOpenApprove] = React.useState(0);
  const [refresh, setRefresh] = React.useState(1);

  const submitBudgetForApproval = async () => {
    try {
      const response = await apiService.post(
        financeEndpoints.submitReceiptForApproval(clickedItem.id)
      );
      if (
        response.status === 200 &&
        response.data.succeeded &&
        response.data.messages[0]
      ) {
        message.success(response.data.messages[0]);
        if (openBaseCard) {
          setOpenBaseCard(false);
        }
      }
    } catch (error) {
      console.error('Error submitting budget for approval:', error);
    } finally {
      setRefresh((prev) => prev + 1);
    }
  };
  const handlers = {
    ...(status === 0
      ? {
          submitPaymentForApproval: () => {
            if (clickedItem) {
              submitBudgetForApproval();
            } else {
              message.error('Please select a receipt to submit for approval.');
            }
          },
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },
          delete: () => {
            if (clickedItem) {
              // Add delete logic here
              console.log(`Deleting receipt with ID: ${clickedItem.id}`);
            } else {
              message.error('Please select a receipt to delete.');
            }
          },
          reports: () => {
            // Add reports logic here
            console.log('Reports clicked');
          },
          notify: () => {
            // Add notify logic here
            console.log('Notify clicked');
          },
        }
      : status === 1
      ? {
          approvalRequest: () => {
            // Add approval request logic here
            console.log('Approval Request clicked');
          },
          sendApprovalRequest: () => {
            setOpenApprove(1);
          },
          cancelApprovalRequest: () => {
            setOpenApprove(2);
          },
          approveDocument: () => {
            setOpenApprove(3);
          },
          rejectDocumentApproval: () => {
            setOpenApprove(4);
          },
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const baseCardHandlers = {
    ...(status === 0
      ? {
          submitPaymentForApproval: () => {
            if (clickedItem) {
              submitBudgetForApproval();
            } else {
              message.error('Please select a budget to submit for approval');
            }
          },
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },
          edit: (item) => {
            setOpenBaseCard(true);
            setClickedItem(item);
          },
          delete: (item) => {
            setOpenBaseCard(true);
            setClickedItem(item);
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
      : status === 2
      ? {
          postReceiptToGL: () => setOpenPV(true),
        }
      : {}),
  };

  const title = clickedItem
    ? `${clickedItem.documentNo} `
    : 'Create New Payment';

  const [inputData, setInputData] = useState(null);
  const { data: receiptNos } = useFetchAsync(
    financeEndpoints.getUnusedReceiptNoGeneratorHeader,
    apiService
  );
  const { data: receiptNoLines } = useFetchAsync(
    financeEndpoints.getUnusedReceiptNoGeneratorHeader,
    apiService
  );
  const { data: allNoLines } = useFetchAsync(
    financeEndpoints.getAllReceiptNoGeneratorLine,
    apiService
  );

  const columnDefs = [
    {
      headerName: 'Document No',
      field: 'documentNo',
      type: 'string',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      headerName: 'Reciept Date',
      field: 'recieptDate',

      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: 'Stage',
      field: 'stage',
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
      headerName: 'Payment Narration',
      field: 'narration',
      type: 'string',
    },
    {
      headerName: 'Total Amount',
      field: 'totalAmount',
      cellRenderer: (params) => {
        return (
          <div className="text-right text-primary">
            {formatNumber(params.value)}
          </div>
        );
      },
    },
    {
      field: 'created_date',
      headerName: 'Created Date',
      cellRenderer: (params) => {
        return <p className=" text-center">{parseDate(params.value)}</p>;
      },
    },
  ];
  useEffect(() => {
    console.log('inputData:', inputData);
  }, [inputData]);

  const { data: receiptTypes } = useFetchAsync(
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
  const fields = [
    /**{
{
  "recieptDate": "2025-03-25T20:19:32.930Z",
  "returnId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "receiptNoGeneratorLineId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "recieptNo": "string",
  "narration": "string",
  "totalAmount": 0
}
} */
    ...(clickedItem
      ? [
          {
            label: 'Document No.',
            name: 'documentNo',
            type: 'text',
            disabled: true,
          },
        ]
      : []),

    {
      name: 'receiptNoGeneratorLineId',
      label: 'Receipt No',
      type: 'autocomplete',
      required: true,
      disabled: true,
      // disabled: clickedItem ? true : false,
      options:
        (allNoLines &&
          allNoLines?.map((item) => {
            return {
              id: item.id,
              name: item.receiptNo,
              recieptNo: item.receiptNo,
            };
          })) ||
        [],
    },
    /**{
    "RecieptNo": "4567847",
    "ReceiptDate": "2024-03-25T00:00:00Z",
    "ReceiptAmount": 3000.00,
    "BankId": "99285702-1196-4e11-8b70-725e50aef567",
    "BankBranchId": "5c3392d5-2807-403f-a34d-1c00325eccf1",
    "ReceiptId": "9f1e4978-349c-45a2-a988-5975f5300c34",
    "AccountNumber": "1234567890",
    "Remarks": "Payment received successfully"
} */
    {
      name: 'receiptTypeId',
      label: 'Receipt Type',
      type: 'select',
      options:
        receiptTypes &&
        receiptTypes.map((item) => {
          return {
            id: item.receiptTypeId,
            name: item.receiptTypeName,
            crAccount: item.crAccountId,
            drAccount: item.drAccountId,
          };
        }),
    },
    {
      name: 'crAccountId',
      label: 'CR Account',
      type: 'select',
      disabled: true,
      options: crAccounts && crAccounts,
    },
    {
      name: 'drAccountId',
      label: 'DR Account',
      disabled: true,
      type: 'select',
      options: drAccounts && drAccounts,
    },
    {
      label: 'Reciept Date',
      name: 'recieptDate',
      type: 'date',
      required: true,
    },

    {
      label: 'Narration',
      name: 'narration',
      type: 'string',
    },
    ...(clickedItem
      ? [
          {
            label: 'Total Amount',
            name: 'totalAmount',
            type: 'amount',
            required: true,
            disabled: true,
          },
        ]
      : []),
    {
      label: 'Received From',
      name: 'receivedFrom',
      type: 'text',
      required: true,
    },
    ...(clickedItem
      ? [
          {
            label: 'Posting Date',
            name: 'postingDate',
            type: 'date',
            disabled: true,
          },
          {
            label: 'Is Posted',
            name: 'isPosted',
            type: 'switch',
            disabled: true,
          },
        ]
      : []),
  ];

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (selectedRows) => {
    // console.log('Slected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };

  return (
    <div className="">
      <Dialog
        open={openPV && selectedRows.length > 0}
        onClose={() => {
          setOpenPV(false);
          setIsSchedule(false);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
        }}
      >
        <ReceiptActions
          isSchedule={true}
          status={2}
          clickedItem={clickedItem}
          setOpenBaseCard={setOpenBaseCard}
          selectedRows={selectedRows}
          setOpenPostGL={setOpenPV}
          setSelectedRows={setSelectedRows}
        />
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
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={'Receipts'}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        isUserComponent={false}
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
      >
        {clickedItem ? (
          <div className="flex flex-col ">
            <BaseAutoSaveInputCard
              fields={fields}
              disableAll={status !== 0 && status !== 1}
              apiEndpoint={financeEndpoints.addReceipt}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateTheReceipt}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.getReceiptsById}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
            />
            <RecieptLines clickedItem={clickedItem} status={status} />
          </div>
        ) : (
          <BaseAutoSaveInputCard
            setInputData={setInputData}
            fields={fields.filter((field) => field.name !== 'documentNo')}
            apiEndpoint={financeEndpoints.addReceipt}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateTheReceipt}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getReceiptsById}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        refreshData={refresh}
        openPostToGL={openPV}
        openAction={openAction}
        openBaseCard={openBaseCard}
        onSelectionChange={handleSelectionChange}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getReceiptBystage(status)}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Receipts"
        currentTitle="Receipts"
      />
    </div>
  );
};

export default Reciepts;
