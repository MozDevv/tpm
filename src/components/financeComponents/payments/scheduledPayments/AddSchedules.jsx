import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Add } from '@mui/icons-material';

import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { parseDate } from '@/utils/dateFormatter';
import { message } from 'antd';

function AddSchedules({ clickedItem, openDialog, setOpenDialog }) {
  const [payments, setPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getPaymentByStages(2), {
        'paging.pageSize': 1000,
      });
      const paymentsData = res.data.data.map((item, index) => ({
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
        claimId: item?.claimId,
      }));
      console.log('paymentsData:', res.data.data);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [clickedItem]);
  useEffect(() => {
    fetchPayments();
  }, [openDialog]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRowSelection = (event) => {
    const selectedData = event.api.getSelectedRows();
    setSelectedPayments(selectedData);
  };

  const handleAddPayments = async () => {
    const payload = {
      payments: selectedPayments.map((payment) => ({
        paymentId: payment.id,
      })),
      paymentScheduleId: clickedItem?.id,
    };

    try {
      const res = await apiService.post(
        financeEndpoints.addPaymentsToSchedule,
        payload
      );

      if (res.data.succeeded) {
        message.success('Payments added successfully');
        handleCloseDialog();
      } else if (res.data.messages[0]) {
        message.error(res.data.messages[0]);
      } else {
        message.error('An error occured while adding the payments');
      }
    } catch (error) {
      console.error('Error adding payments:', error);
    }
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

  const sourceStatus = {
    0: { name: 'Normal Payment', color: '#2ecc71' },
    1: { name: 'Claim Payment', color: '#970FF2' },
    2: { name: 'Claim Receipt', color: '#3498db' },
    3: { name: 'Normal Receipt', color: '#970FF2' },
    4: { name: 'Claim Purchase Invoice', color: '#970FF2' },
    5: { name: 'Normal Purchase Invoice', color: '#2ecc71' },
    6: { name: 'Claim Sales Invoice', color: '#1abc9c' },
    7: { name: 'Normal Sales Invoice', color: '#9b59b6' },
    8: { name: 'General Journals', color: '#f1c40f' },
    9: { name: 'Closing Income', color: '#e67e22' },
  };

  const columnDefs = [
    {
      headerName: 'Payment Voucher No',
      field: 'documentNo',
      width: 140,
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
      width: 140,
    },
    {
      headerName: 'On Behalf Of',
      field: 'onBehalfOf',
      width: 140,
    },
    {
      headerName: 'Narration',
      field: 'narration',
      width: 180,
    },
    {
      headerName: 'Source',
      field: 'source',
      width: 180,
      filter: true,
      cellRenderer: (params) => {
        const status = sourceStatus[params.value];

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
      headerName: 'Bank Account',
      field: 'bankAccountId',
      width: 140,
      valueFormatter: (params) => {
        const bankAccount = bankAccounts.find(
          (account) => account.id === params.value
        );
        return bankAccount ? bankAccount.name : '';
      },
    },
    {
      headerName: 'Posting Date',
      field: 'postingDate',
      width: 140,
      valueFormatter: (params) => {
        return parseDate(params.value);
      },
    },
  ];

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '80vh',
            minWidth: '60vw',
            pt: 5,
            px: 5,
          },
        }}
      >
        <div className="flex justify-between w-full">
          <DialogTitle className="text-primary font-bold text-lg">
            Select Payments to add to current schedule
          </DialogTitle>
          <div className="flex items-center gap-10">
            <Button
              onClick={handleAddPayments}
              variant="contained"
              color="primary"
            >
              Add Selected Payments
            </Button>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
          </div>
        </div>
        <DialogContent>
          <div
            className="ag-theme-quartz min-h-[500px] max-h-[600px] mt-3"
            style={{ height: 400, width: '100%' }}
          >
            <AgGridReact
              rowData={payments}
              columnDefs={columnDefs}
              pagination={false}
              domLayout="normal"
              noRowsOverlayComponent={BaseEmptyComponent}
              rowSelection="multiple"
              onSelectionChanged={handleRowSelection}
              className="custom-grid ag-theme-quartz"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddSchedules;
