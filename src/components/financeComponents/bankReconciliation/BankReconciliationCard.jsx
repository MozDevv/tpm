import React, { use, useEffect, useState } from 'react';
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
  setClickedItem,
  uploadExcel,
  setSelectedBankSubledgers,
  setSelectedBankStatements,
  refreshBankStatements,
}) {
  const [bankStatement, setBankStatement] = useState([]);
  const [bankSubledger, setBankSubledger] = useState([]);
  const [selectedStatementIndex, setSelectedStatementIndex] = useState(-1);

  const onBankStatementSelectionChanged = (params) => {
    const selectedRows = params.api.getSelectedRows();
    const selectedRowId = selectedRows.length > 0 ? selectedRows[0].id : null;

    // Find the index of the selected row in the original statements array
    const selectedIndex = bankStatement.findIndex(
      (statement) => statement.id === selectedRowId
    );

    setSelectedStatementIndex(selectedIndex); // Update the selected index
    setSelectedBankStatements(selectedRows); // Store selected rows

    // Calculate totals based on the selected index
    const totals = calculateTotals(bankStatement, selectedIndex);
    console.log('Calculated Totals:', totals); // Log or use totals as needed
  };

  const onBankSubledgerSelectionChanged = (params) => {
    const selectedRows = params.api.getSelectedRows();
    setSelectedBankSubledgers(selectedRows);
  };

  const [totalAmounts1, setTotalAmounts1] = useState([
    { name: 'Total Difference', value: '0.00' },
    { name: 'Balance', value: '0.00' },
    { name: 'Total Balance', value: '0.00' },
  ]);

  const calculateTotals = (statements, selectedIndex) => {
    const totalDifference = statements.reduce(
      (sum, item) => sum + (item.difference || 0),
      0
    );

    const totalBalance = statements.reduce(
      (sum, item) => sum + (item.statementAmount || 0),
      0
    );

    const balance =
      statements
        .slice(0, selectedIndex + 1)
        .reduce((sum, item) => sum + (item.statementAmount || 0), 0) +
      clickedItem?.lastStatementBalance;

    setTotalAmounts1([
      { name: 'Total Difference', value: formatNumber(totalDifference) },
      { name: 'Balance', value: formatNumber(balance) },
      { name: 'Total Balance', value: formatNumber(totalBalance) },
    ]);
    return { totalDifference, balance, totalBalance };
  };

  const getBankStatement = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getBankStatement(clickedItem?.id)
      );
      if (response.status === 200 && response.data.succeeded) {
        if (response.data.data[0].bankStatements.length > 0) {
          const bankStatement = response.data.data[1];
          setClickedItem((prev) => ({
            ...prev,
            totalDifference: bankStatement.totalDifference,
            statementStartDate: bankStatement.statementStartDate,
            statementEndDate: bankStatement.statementEndDate,
            lastStatementBalance: bankStatement.lastStatementBalance,
            currentStatementBalance: bankStatement.currentStatementBalance,
          }));
        }

        const formattedStatements = response.data.data[1].bankStatements.map(
          (item) => ({
            id: item.id,
            transactionDate: item.transactionDate,
            description: item.description,
            debitAmount: item.debitAmount,
            appliedAmount: item.appliedAmount,
            difference: item.difference,
            statementAmount: item.statementAmount,
            appliedEntries: item.appliedEntries,
            creditAmount: item.creditAmount,
            balance: item.balance,
            appliedEntries: item.appliedEntries,
            bankReconciliationId: item.bankReconciliationId,
            bankReconciliationStatus: item.bankReconciliationStatus,
            totalSubLedgerCount: item.totalSubLedgerCount,
          })
        );

        setBankStatement(formattedStatements);
        calculateTotals(formattedStatements, 0);
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
            bankReconciliationStatus: item.bankReconciliationStatus,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching bank subledger', error);
    }
  };

  useEffect(() => {
    getBankStatement();
    getBankSubledger();
  }, [refreshBankStatements]);

  useEffect(() => {
    getBankStatement();
    getBankSubledger();
  }, []);

  useEffect(() => {
    getBankStatement();
  }, [uploadExcel]);

  // useEffect(() => {
  //   getBankStatement();
  // }, [refreshBankStatements]);

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
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      filter: true,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },

    {
      field: 'statementAmount',
      headerName: 'Statement Ammount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'appliedAmount',
      headerName: 'Applied Ammount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),

      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'difference',
      headerName: 'Difference',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'appliedEntries',
      headerName: 'Applied Entries',
      filter: true,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'bankReconciliationStatus',
      headerName: 'Bank Reconciliation Status',
      filter: true,
      cellStyle: (params) => {
        if (params.value === 1) {
          return {
            color: 'green',
            fontWeight: 'bold',
          };
        }
        return null; // Default style if the value is not 1
      },
      valueFormatter: (params) =>
        params.value === 0
          ? 'None'
          : params.value === 1
          ? 'Matched'
          : params.value === 2
          ? 'Reconciled'
          : 'Unknown',
    },
    {
      field: 'totalSubLedgerCount',
      headerName: 'Total Sub Ledger Count',
      filter: true,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
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
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'transactionDate',
      headerName: 'Transaction Date',
      width: 150,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'amount',
      headerName: 'Amount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),

      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'description',
      headerName: 'Description',
      filter: true,
      width: 250,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },

    {
      field: 'transactionNo',
      headerName: 'Transaction No',
      width: 150,
      filter: true,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'glEntryNo',
      headerName: 'GL Entry No',
      filter: true,
      cellStyle: ({ data }) => ({
        fontWeight: data.bankReconciliationStatus === 1 ? 'bold' : 'normal',
        color: data.bankReconciliationStatus === 1 ? 'green' : 'black',
      }),
    },
    {
      field: 'bankReconciliationStatus',
      headerName: 'Bank Reconciliation Status',
      filter: true,
      cellStyle: (params) => {
        if (params.value === 1) {
          return {
            color: 'green',
            fontWeight: 'bold',
          };
        }
        return null; // Default style if the value is not 1
      },
      valueFormatter: (params) =>
        params.value === 0
          ? 'None'
          : params.value === 1
          ? 'Matched'
          : params.value === 2
          ? 'Reconciled'
          : 'Unknown',
    },
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
          padding: '0 20px',

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
              <span className="text-sm font-semibold text-gray-600 mt-1">
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
