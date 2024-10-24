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
import ScheduledPaymentsCard from './ScheduledPaymentsCard';

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
    {
      headerName: 'Is Posted',
      field: 'isPosted',
      type: 'boolean',
    },
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
  const handlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
    ...(status === 0 && {
      submitPaymentForApproval: () => {
        setOpenPV(true);
        console.log('Submit Payment For Approval');
      },
    }),
    ...(status === 1 && {
      approvePaymentVoucher: () => {
        setOpenPV(true);
        console.log('Approve Payment');
      },
    }),
    ...(status === 2 && {
      postPaymentToLedger: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
      schedulePaymentVoucher: () => {
        setIsSchedule(true);
        setOpenPV(true);
        console.log('Schedule Payment');
      },
    }),
    ...(status === 3 && {
      postPaymentVoucher: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
    }),
  };

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const baseCardHandlers = {
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
    createConstituency: () => {
      setDialogType('branch');
      setOpenAction(true);
    },
    ...(status === 0 && {
      submitPaymentForApproval: () => {
        console.log('Submit Payment For Approval');
        setOpenPV(true);
      },
    }),
    ...(status === 1 && {
      approvePaymentVoucher: () => {
        setOpenPV(true);
        console.log('Approve Payment');
      },
    }),
    ...(status === 2 && {
      postPaymentToLedger: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
      schedulePaymentVoucher: () => {
        setOpenPV(true);
        console.log('Schedule Payment');
      },
    }),
    ...(status === 3 && {
      postPaymentVoucher: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
    }),
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
    console.log('Slected rows in ParentComponent:', selectedRows);
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
        <PVActions
          isSchedule={isSchedule}
          status={status}
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
          <BaseAutoSaveInputCard
            fields={fields}
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
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
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
        openPostToGL={openPV}
        openAction={openAction}
        openBaseCard={openBaseCard}
        onSelectionChange={handleSelectionChange}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getReceipts}
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
