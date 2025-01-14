'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';

import financeEndpoints from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';

import PaymentsCard from '../PaymentsCard';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { Dialog } from '@mui/material';
import PVActions from '../PVActions';
import { formatNumber } from '@/utils/numberFormatters';
import ScheduledPaymentsCard from './ScheduledPaymentsCard';
import { message } from 'antd';
import AddSchedules from './AddSchedules';

const ScheduledPayments = ({ status }) => {
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
      headerName: 'Schedule No',
      field: 'scheduleNo',
      type: 'string',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
    },

    {
      headerName: 'No of Selected Payments',
      field: 'noOfSelectedPayments',
      type: 'number',
    },
    {
      headerName: 'Schedule Date',
      field: 'scheduleDate',
      type: 'date',
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      headerName: 'Total Amount',
      field: 'totalAmount',
      type: 'number',
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== 'POSTING' ? 'bold' : 'normal',
        textAlign: 'right',
        color: '#006990',
      }),
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },

    {
      headerName: 'Paying Bank',
      field: 'payingBank',
      valueGetter: (params) => {
        const bank = bankAccounts.find(
          (acc) => acc.id === params.data.payingBank
        );
        return bank ? bank.name : '';
      },
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
      scheduleNo: item.scheduleNo,
      scheduleDate: item.scheduleDate,
      noOfSelectedPayments: item.noOfSelectedPayments,
      payingBank: item.payingBank,
      totalAmount: item.totalAmount,
      paymentScheduleLines: item.paymentScheduleLines,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [isSchedule, setIsSchedule] = React.useState(false);
  const [openPV, setOpenPV] = React.useState(false);

  const [selectedLines, setSelectedLines] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleRemovePayments = async () => {
    if (selectedLines.length === 0) {
      message.warning('Please select a payment to remove');
      return;
    }
    console.log();
    try {
      const res = await apiService.post(
        financeEndpoints.removePaymentFromSchedule,
        {
          paymentVouchers: selectedLines.map((row) => ({
            paymentScheduleLineId: row.id,
          })),
        }
      );

      if (res.data.succeeded) {
        message.success('Payments removed successfully');
      } else if (res.data.messages[0]) {
        message.error(res.data.messages[0]);
      } else {
        message.error('An error occured while removing the payments');
      }
    } catch (error) {
      message.error('An error occured while removing the payments');
      console.log(error);
    } finally {
      setLoading((prev) => !prev);
    }
  };

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

  const [exportScheduleLines, setExportScheduleLines] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [gridApi, setGridApi] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const exportData = () => {
    gridApi.exportDataAsCsv({
      fileName: `Scheduled Payments - ${parseDate(
        clickedItem?.scheduleDate
      )}.csv`, // Set the desired file name here
    });
  };

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
      // postPaymentToLedger: () => {
      //   setOpenPV(true);
      //   console.log('Post Payment');
      // },
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

    exportScheduleLines: () => {
      exportData();
    },
  };

  const title = clickedItem
    ? `${clickedItem.documentNo} `
    : 'Create New Payment';

  const fields = [
    {
      name: 'scheduleNo',
      label: 'Schedule No',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'scheduleDate',
      label: 'Schedule Date',
      type: 'date',
      required: true,
      disabled: true,
    },
    {
      name: 'noOfSelectedPayments',
      label: 'No of Selected Payments',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'payingBank',
      label: 'Paying Bank',
      type: 'select',
      required: true,
      options: bankAccounts,
      disabled: true,
    },
    {
      name: 'totalAmount',
      label: 'Total Amount',
      type: 'amount',
      required: true,
      disabled: true,
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

  const scheduleHandlers = {
    ...(status === 3 && {
      removePaymentsFromSchedule: () => {
        handleRemovePayments();
      },
      addPaymentsToSchedule: () => {
        setOpenDialog(true);
      },
    }),
  };

  const handleDeleteSchedule = async () => {
    const payload = {
      paymentSchedules: [
        {
          paymentScheduleId: clickedItem.id,
        },
      ],
    };

    try {
      const res = await apiService.post(
        financeEndpoints.deletePaymentSchedule,
        payload
      );
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <div className="">
      <AddSchedules
        clickedItem={clickedItem}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <Dialog
        open={openBaseCard ? openPV : openPV && selectedRows.length > 0}
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
        title={'Scheduled Payments'}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        isUserComponent={false}
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
        customDeleteFunction={handleDeleteSchedule}
      >
        {clickedItem ? (
          <ScheduledPaymentsCard
            openDialog={openDialog}
            baseCardHandlers={scheduleHandlers}
            selectedLines={selectedLines}
            setSelectedLines={setSelectedLines}
            exportScheduleLines={exportScheduleLines}
            fields={fields}
            apiEndpoint={financeEndpoints.updatePayment}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            setClickedItem={setClickedItem}
            gridApi={gridApi}
            setGridApi={setGridApi}
            transformData={transformData}
            loading={loading}
          />
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
        fetchApiEndpoint={financeEndpoints.getPaymentSchedules}
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

export default ScheduledPayments;
