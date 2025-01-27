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
import { Button, Dialog } from '@mui/material';
import PVActions from '../PVActions';
import { formatNumber } from '@/utils/numberFormatters';
import ScheduledPaymentsCard from './ScheduledPaymentsCard';
import { message } from 'antd';
import AddSchedules from './AddSchedules';
import {
  AccessTime,
  Cancel,
  Check,
  DoneAll,
  Verified,
  Visibility,
} from '@mui/icons-material';
import ScheduledPvActions from '../ScheduledPvActions';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import ScheduleControlReport from './reports/ScheduleControlReport';
import TaxReport from './reports/TaxReport';

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

  /**Sch_New,
        Sch_Pending_Approval,
        Sch_Approved,
        Sch_Paid,
        Sch_Rejected, */
  const statusIcons = {
    0: { icon: Visibility, name: 'New Schedule', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending Approval', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved Schedule', color: '#2e7d32' }, // Green
    3: { icon: DoneAll, name: 'Paid Schedule', color: '#2e7d32' }, // Green
    4: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };

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
      headerName: 'Schedule No',
      field: 'scheduleNo',
      type: 'string',
    },

    {
      headerName: 'No of Selected Payments',
      field: 'noOfSelectedPayments',
      type: 'number',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '20px',
            }}
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
      documentNo: item.documentNo,
      paymentScheduleLines: item.paymentScheduleLines,
      stage: item.stage,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [isSchedule, setIsSchedule] = React.useState(false);
  const [openPV, setOpenPV] = React.useState(false);

  const [selectedLines, setSelectedLines] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);

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
    ...(status === 1 && {
      approvalRequest: () => console.log('Approval Request clicked'),
      sendApprovalRequest: () => setOpenApprove(1),
      cancelApprovalRequest: () => setOpenApprove(2),
      approveDocument: () => setOpenApprove(3),
      rejectDocumentApproval: () => setOpenApprove(4),
      delegateApproval: () => {
        setOpenApprove(5);
        setWorkFlowChange(Date.now());
      },
    }),
    // create: () => {
    //   setOpenBaseCard(true);
    //   setClickedItem(null);
    // },
    // edit: () => console.log('Edit clicked'),
    // delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
    ...(status === 0 && {
      submitPaymentForApproval: () => {
        setOpenPV(true);
        console.log('Submit Payment For Approval');
      },
    }),
    // ...(status === 1 && {
    //   approvePaymentVoucher: () => {
    //     setOpenPV(true);
    //     console.log('Approve Payment');
    //   },
    // }),
    ...(status === 2 && {
      postPaymentToLedger: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
    }),
    ...(status === 3 &&
      {
        // postPaymentVoucher: () => {
        //   setOpenPV(true);
        //   console.log('Post Payment');
        // },
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
    'Schedule Control Report': () => {
      setOpenReport(true);
    },
    'Tax Report': () => {
      setOpenReport(1);
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

    ...(status === 3 && {
      postPaymentVoucher: () => {
        setOpenPV(true);
        console.log('Post Payment');
      },
    }),

    exportScheduleLines: () => {
      exportData();
    },
    ...(status === 1 && {
      approvalRequest: () => console.log('Approval Request clicked'),
      sendApprovalRequest: () => setOpenApprove(1),
      cancelApprovalRequest: () => setOpenApprove(2),
      approveDocument: () => setOpenApprove(3),
      rejectDocumentApproval: () => setOpenApprove(4),
      delegateApproval: () => {
        setOpenApprove(5);
        setWorkFlowChange(Date.now());
      },
    }),
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
      ? 'New Scheduled Payments'
      : status === 1
      ? 'Pending Payment Schedules'
      : status === 2
      ? 'Approved Payment Schedules'
      : status === 3
      ? 'Paid Payment Schedules'
      : 'Rejected Payment Schedules';

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
  const reportItems = ['Schedule Control Report', 'Tax Report'];

  return (
    <div className="">
      <Dialog
        open={openReport && clickedItem}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <ScheduleControlReport
            setOpenReport={setOpenReport}
            data={clickedItem?.paymentScheduleLines}
          />
        </div>
      </Dialog>
      <Dialog
        open={openReport === 1 && clickedItem}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <TaxReport
            setOpenReport={setOpenReport}
            data={clickedItem?.paymentScheduleLines}
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
        <ScheduledPvActions
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
        fetchApiEndpoint={
          status === 0
            ? financeEndpoints.getPaymentSchedulesByStage(status)
            : financeEndpoints.getPaymentSchedulesByStage(status)
        }
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle={navTitle}
        currentTitle={navTitle}
        openApproveDialog={openApprove}
      />
    </div>
  );
};

export default ScheduledPayments;
