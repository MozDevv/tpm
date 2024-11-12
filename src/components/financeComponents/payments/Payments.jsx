'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';

import financeEndpoints from '@/components/services/financeApi';
import { formatDate } from '@/utils/dateFormatter';

import PaymentsCard from './PaymentsCard';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { Button, Dialog } from '@mui/material';
import PVActions from './PVActions';
import PaymentVoucherReport from './reports/PaymentVoucherReport';
import GratuityLetterReport from './reports/GratuityLetterReport';

const Payments = ({ status }) => {
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
      headerName: 'Payment Voucher No',
      field: 'documentNo',
      flex: 1,
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
      headerName: 'Payee',
      field: 'payee',
      flex: 1,
    },
    {
      headerName: 'On Behalf Of',
      field: 'onBehalfOf',
      flex: 1,
    },

    {
      headerName: 'Source',
      field: 'source',
      width: 180,
      filter: true,
      cellRenderer: (params) => {
        const status = sourceStatus[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 3,

              maxHeight: '22px',
              cursor: 'pointer',
              color: status.color,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {status.name}
          </Button>
        );
      },
    },

    {
      headerName: 'Payment Method',
      field: 'paymentMethodId',
      flex: 1,
      valueFormatter: (params) => {
        const paymentMethod = paymentMethods.find(
          (method) => method.id === params.value
        );
        return paymentMethod ? paymentMethod.name : '';
      },
    },
    {
      headerName: 'Bank Account',
      field: 'bankAccountId',
      flex: 1,
      valueFormatter: (params) => {
        const bankAccount = bankAccounts.find(
          (account) => account.id === params.value
        );
        return bankAccount ? bankAccount.name : '';
      },
    },
    {
      headerName: 'Narration',
      field: 'narration',
      flex: 1,
    },
    {
      headerName: 'Is Posted',
      field: 'isPosted',
      flex: 1,
      cellRenderer: (params) => {
        if (params.value === null || params.value === false) {
          return 'No';
        } else if (params.value === true) {
          return 'Yes';
        }
        return 'No'; // Default case
      },
      cellStyle: (params) => ({
        color: params.value ? 'red' : 'green',
        fontWeight: 'semi-bold',
        paddingLeft: '50px',
      }),
    },
    {
      headerName: 'Posting Date',
      field: 'postingDate',
      flex: 1,
      valueFormatter: (params) => {
        return formatDate(params.value);
      },
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  //   {
  //     NormalPayment,
  //     ClaimPayment,
  //     ClaimReceipt,
  //     NormalReceipt,
  //     ClaimPurchaseInvoice,
  //     NormalPurchaseInvoice,
  //     ClaimSalesInvoice,
  //     NormalSalesInvoice,
  //     GeneralJournals,
  //     ClosingIncome,

  // }
  const sourceStatus = {
    0: { name: 'Normal Payment', color: '#2ecc71' }, // Light Red
    1: { name: 'Claim Payment', color: '#970FF2' }, // Bright Orange
    2: { name: 'Claim Receipt', color: '#3498db' }, // Light Blue
    3: { name: 'Normal Receipt', color: '#970FF2' }, // Amethyst
    4: { name: 'Claim Purchase Invoice', color: '#970FF2' }, // Carrot Orange
    5: { name: 'Normal Purchase Invoice', color: '#2ecc71' }, // Emerald
    6: { name: 'Claim Sales Invoice', color: '#1abc9c' }, // Turquoise
    7: { name: 'Normal Sales Invoice', color: '#9b59b6' }, // Amethyst
    8: { name: 'General Journals', color: '#f1c40f' }, // Bright Yellow
    9: { name: 'Closing Income', color: '#e67e22' }, // Carrot Orange
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      payee: item.payee,
      postingDate: item.postingDate,
      onBehalfOf: item.onBehalfOf,
      bankAccountId: item.bankAccountId,
      paymentMethodId: item.paymentMethodId,
      narration: item.narration,
      isPosted: item.isPosted,
      documentNo: item.documentNo,
      source: item.source,
      prospectivePensionerId: item.prospectivePensionerId,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [isSchedule, setIsSchedule] = React.useState(false);
  const [openPV, setOpenPV] = React.useState(false);
  const [openTrialBalanceReport, setOpenTrialBalanceReport] =
    React.useState(false);
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

  const [openGratuity, setOpenGratuity] = React.useState(false);

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
    'Payment Voucher Report': () => setOpenTrialBalanceReport(true),
    'Gratuity Notification Letter': () => setOpenGratuity(true),
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
      name: 'documentNo',
      label: 'Payment Voucher No',
      type: 'text',
      required: false,
      disabled: true,
    },
    {
      name: 'payee',
      label: 'Payee',
      type: 'text',
      required: true,
    },

    {
      name: 'onBehalfOf',
      label: 'On Behalf Of',
      type: 'text',
      required: true,
    },
    {
      name: 'paymentMethodId',
      label: 'Payment Method',
      type: 'select',
      options: paymentMethods,
      required: true,
    },
    {
      name: 'bankAccountId',
      label: 'Bank Account',
      type: 'select',
      required: true,
      options: bankAccounts,
    },

    {
      name: 'postingDate',
      label: 'Posting Date',
      type: 'date',
      required: true,
    },
    {
      name: 'narration',
      label: 'Narration',
      type: 'text',
      required: false,
    },
    {
      name: 'isPosted',
      label: 'Is Posted',
      type: 'switch',
      required: false,
    },
  ];

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (selectedRows) => {
    console.log('Selected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };

  const navTitle =
    status === 0
      ? 'Payments'
      : status === 1
      ? 'Pending Payment Vouchers'
      : status === 2
      ? 'Approved Payment Vouchers'
      : status === 3
      ? 'Scheduled Payment Vouchers'
      : 'Posted Payment Vouchers';

  const reportItems = [
    'Payment Voucher Report',
    'Gratuity Notification Letter',
  ];

  return (
    <div className="">
      <div className="">
        <Dialog
          open={openTrialBalanceReport}
          onClose={() => setOpenTrialBalanceReport(false)}
          sx={{
            '& .MuiPaper-root': {
              minHeight: '75vh',
              maxHeight: '85vh',
              minWidth: '45vw',
              maxWidth: '55vw',
            },
            zIndex: 99999,
          }}
        >
          <div className="flex-grow overflow-hidden">
            <PaymentVoucherReport
              setOpenTrialBalanceReport={setOpenTrialBalanceReport}
              clickedItem={clickedItem}
            />
          </div>
        </Dialog>
        <Dialog
          open={openGratuity}
          onClose={() => setOpenGratuity(false)}
          sx={{
            '& .MuiPaper-root': {
              minHeight: '75vh',
              maxHeight: '85vh',
              minWidth: '45vw',
              maxWidth: '55vw',
            },
            zIndex: 99999,
          }}
        >
          <div className="flex-grow overflow-hidden">
            <GratuityLetterReport
              setOpenGratuity={setOpenGratuity}
              clickedItem={clickedItem}
            />
          </div>
        </Dialog>
      </div>
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
        reportItems={reportItems}
        isClaim={true}
        retireeId={clickedItem?.prospectivePensionerId}
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        isUserComponent={false}
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
        steps={[
          'Payment Creation',
          'Payment Approval',
          'Payment Scheduling',
          'Payment Posting',
        ]}
        activeStep={status}
      >
        {clickedItem ? (
          <>
            {' '}
            <PaymentsCard
              fields={fields}
              apiEndpoint={financeEndpoints.updatePayment}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              setClickedItem={setClickedItem}
              transformData={transformData}
            />{' '}
          </>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addPayment}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updatePayment}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getPaymentById(status)}
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
        fetchApiEndpoint={
          status === 0
            ? financeEndpoints.getPaymentByStages(status)
            : financeEndpoints.getPaymentByStages(status)
        }
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle={navTitle}
        currentTitle={navTitle}
      />
    </div>
  );
};

export default Payments;
