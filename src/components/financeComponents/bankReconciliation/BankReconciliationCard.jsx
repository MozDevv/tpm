import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { formatNumber } from '@/utils/numberFormatters';
import { parseDate } from '@/utils/dateFormatter';
import { TextField } from '@mui/material';
import BaseAmountInput from '@/components/baseComponents/BaseAmountInput';

function BankReconciliationCard({
  clickedItem,
  uploadExcel,
  setSelectedBankSubledgers,
  setSelectedBankStatements,
}) {
  const [bankStatement, setBankStatement] = useState([]);
  const [bankSubledger, setBankSubledger] = useState([]);

  const onBankStatementSelectionChanged = (params) => {
    const selectedRows = params.api.getSelectedRows();
    setSelectedBankStatements(selectedRows);
  };

  const onBankSubledgerSelectionChanged = (params) => {
    const selectedRows = params.api.getSelectedRows();
    setSelectedBankSubledgers(selectedRows);
  };

  const getBankStatement = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getBankStatement(clickedItem?.id)
      );
      if (response.status === 200 && response.data.succeeded) {
        setBankStatement(
          response.data.data.map((item) => ({
            id: item.id,
            transactionDate: item.transactionDate,
            description: item.description,
            debitAmount: item.debitAmount,
            creditAmount: item.creditAmount,
            balance: item.balance,
            appliedEntries: item.appliedEntries,
            bankReconciliationId: item.bankReconciliationId,
          }))
        );
      } else {
        console.warn('Failed to fetch bank statement: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bank statement', error);
      // Optionally handle the error for the UI
    }
  };

  const getBankSubledger = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.bankSubLedgerPayments
      );
      if (response.status === 200 && response.data.succeeded) {
        setBankSubledger(
          response.data.data.map((item) => ({
            id: item.id,
            transactionNo: item.transactionNo,
            documentNo: item.documentNo,
            externalDocumentNo: item.externalDocumentNo,
            glBankCode: item.glBankCode,
            transactionDate: item.transactionDate,
            amount: item.amount,
            description: item.description,
            glEntryNo: item.glEntryNo,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching bank subledger', error);
    }
  };

  useEffect(() => {
    if (!clickedItem?.id) return;
    getBankStatement();
    getBankSubledger();
  }, [clickedItem]);

  useEffect(() => {
    getBankStatement();
  }, [uploadExcel]);

  const bankStatementColDefs = [
    {
      field: 'transactionDate',
      headerName: 'Transaction Date',

      filter: true,
      checkboxSelection: true,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      width: 150,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      filter: true,
    },
    // {
    //   field: 'debitAmount',
    //   headerName: 'Debit Amount',

    //   filter: true,
    //   valueFormatter: (params) => formatNumber(params.value),
    //   cellStyle: { textAlign: 'center' },
    // },
    // {
    //   field: 'creditAmount',
    //   headerName: 'Credit Amount',

    //   filter: true,
    //   valueFormatter: (params) => formatNumber(params.value),
    //   cellStyle: { textAlign: 'center' },
    // },
    {
      field: 'balance',
      headerName: 'Statement Ammount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'balance',
      headerName: 'Applied Ammount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'balance',
      headerName: 'Difference',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'appliedEntries',
      headerName: 'Applied Entries',

      filter: true,
    },
  ];

  const bankAccountColDefs = [
    {
      field: 'documentNo',
      headerName: 'Document No',

      filter: true,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      field: 'transactionDate',
      headerName: 'Transaction Date',
      width: 150,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'amount',
      headerName: 'Amount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'description',
      headerName: 'Description',
      filter: true,
      width: 250,
    },

    {
      field: 'transactionNo',
      headerName: 'Transaction No',
      width: 150,
      filter: true,
    },
    { field: 'glEntryNo', headerName: 'GL Entry No', filter: true },
    { field: 'glBankCode', headerName: 'GL Bank Code', filter: true },
  ];
  const totalAmounts1 = [
    { name: 'Total Difference', value: '0.00' },
    { name: 'Balance', value: '0.00' },
    { name: 'Total Balance', value: '0.00' },
  ];
  const totalAmounts2 = [
    { name: 'Balance to Reconcile', value: '0.00' },
    { name: 'Balance', value: '0.00' },
  ];
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div
        className=""
        style={{
          overflow: 'auto',
          px: 2,

          width: '100%',
          overflow: 'auto',
        }}
      >
        <h3 className="font-semibold text-[16px] text-primary font-montserrat mb-2">
          Bank Statement Lines
        </h3>
        <div className="h-[250px] ag-theme-quartz ">
          <AgGridReact
            rowData={bankStatement}
            columnDefs={bankStatementColDefs}
            rowSelection="multiple"
            defaultColDef={{ resizable: true, sortable: true }}
            domLayout="normal"
            onSelectionChanged={onBankStatementSelectionChanged}
          />
        </div>

        <div className="mt-8">
          {totalAmounts1.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-4 justify-between mb-3"
            >
              <span className="text-sm font-semibold text-gray-600">
                {item.name}
              </span>
              <span className="items-end text-right">
                <TextField
                  value={item.value}
                  variant="outlined"
                  size="small"
                  type="text"
                  disabled={true}
                  fullWidth
                  inputProps={{
                    style: { textAlign: 'right' },
                  }}
                  InputProps={{
                    inputComponent: BaseAmountInput,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                      {
                        border: 'none',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                      },
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          overflow: 'auto',

          width: '100%',
          overflow: 'hidden',
          maxHeight: '600px',
          zIndex: 9999999999,
        }}
      >
        <h3 className="font-semibold text-[16px] text-primary font-montserrat mb-2">
          Bank Account Ledger Entries
        </h3>
        <div className="h-[250px] ag-theme-quartz ">
          <AgGridReact
            rowData={bankSubledger}
            columnDefs={bankAccountColDefs}
            onSelectionChanged={onBankSubledgerSelectionChanged}
            rowSelection="multiple"
            defaultColDef={{ resizable: true, sortable: true }}
            domLayout="normal"
          />
        </div>

        <div className="mt-8">
          {totalAmounts2.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-4 justify-between mb-3"
            >
              <span className="text-sm font-semibold text-gray-600">
                {item.name}
              </span>
              <span className="items-end text-right">
                <TextField
                  value={item.value}
                  variant="outlined"
                  size="small"
                  type="text"
                  disabled={true}
                  fullWidth
                  inputProps={{
                    style: { textAlign: 'right' },
                  }}
                  InputProps={{
                    inputComponent: BaseAmountInput,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                      {
                        border: 'none',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                      },
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BankReconciliationCard;
