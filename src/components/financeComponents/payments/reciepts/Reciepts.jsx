'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';

import financeEndpoints from '@/components/services/financeApi';
import { formatDate } from '@/utils/dateFormatter';

import PaymentsCard from '../PaymentsCard';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { Dialog } from '@mui/material';
import PVActions from '../PVActions';
import { formatNumber } from '@/utils/numberFormatters';
import RecieptLines from './ReceiptLines';
import ReceiptActions from './ReceiptActions';
import { message } from 'antd';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';

const Reciepts = ({ status }) => {
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
      headerName: 'Payment Method',
      field: 'paymentMethodId',
      type: 'select',
      valueFormatter: (params) => {
        const paymentMethod = paymentMethods.find(
          (meth) => meth.id === params.value
        );
        return paymentMethod ? paymentMethod.name : '';
      },
    },
    {
      headerName: 'Cheque No',
      field: 'chequeNo',
      type: 'string',
      cellRenderer: (params) => {
        return <p className=" text-primary font-normal">{params.value}</p>;
      },
    },
    {
      headerName: 'Cheque Date',
      field: 'chequeDate',
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: 'Payment Narration',
      field: 'paymentNarration',
      type: 'string',
    },
    {
      headerName: 'Recieved From',
      field: 'recievedFrom',
      type: 'string',
    },
    {
      headerName: 'Paying Bank Account',
      field: 'payingBankAccountId',
      type: 'select',
      valueFormatter: (params) => {
        const bankAccount = bankAccounts.find((acc) => acc.id === params.value);
        return bankAccount ? bankAccount.name : '';
      },
    },
    {
      headerName: 'Posting Date',
      field: 'postingDate',
      valueFormatter: (params) => formatDate(params.value),
    },
    // {
    //   headerName: 'Is Posted',
    //   field: 'isPosted',
    //   type: 'boolean',
    // },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      documentNo: item.documentNo,
      recieptDate: item.recieptDate,
      paymentMethodId: item.paymentMethodId,
      chequeNo: item.chequeNo,
      chequeDate: item.chequeDate,
      paymentNarration: item.paymentNarration,
      recievedFrom: item.recievedFrom,
      payingBankAccountId: item.payingBankAccountId,
      postingDate: item.postingDate,
      isPosted: item.isPosted,
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
              message.error('Please select a budget to submit for approval');
            }
          },
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },

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
      : status === 2
      ? {
          postReceiptToGL: () => setOpenPV(true),
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

  const fields = [
    {
      label: 'Document No.',
      name: 'documentNo',
      type: 'text',
      disabled: true,
    },
    {
      label: 'Reciept Date',
      name: 'recieptDate',
      type: 'date',
      required: true,
    },

    {
      label: 'Payment Method',
      name: 'paymentMethodId',
      type: 'select',
      options: paymentMethods,
      required: true,
    },
    {
      label: 'Cheque No',
      name: 'chequeNo',
      type: 'string',
      required: true,
    },
    {
      label: 'Cheque Date',
      name: 'chequeDate',
      type: 'date',
      required: true,
    },
    {
      label: 'Payment Narration',
      name: 'paymentNarration',
      type: 'string',
    },
    {
      label: 'Recieved From',
      name: 'recievedFrom',
      type: 'string',
      required: true,
    },
    {
      label: 'Paying Bank Account',
      name: 'payingBankAccountId',
      type: 'select',
      options: bankAccounts,
      required: true,
    },
    {
      label: 'Posting Date',
      name: 'postingDate',
      type: 'date',
      required: true,
    },
    {
      label: 'Is Posted',
      name: 'isPosted',
      type: 'switch',
    },
  ];

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (selectedRows) => {
    // console.log('Slected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };

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
