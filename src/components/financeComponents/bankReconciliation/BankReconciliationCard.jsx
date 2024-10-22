import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { formatNumber } from '@/utils/numberFormatters';
import { parseDate } from '@/utils/dateFormatter';

function BankReconciliationCard({ clickedItem, uploadExcel }) {
  const [bankStatement, setBankStatement] = useState([]);
  const [bankSubledger, setBankSubledger] = useState([]);

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
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      filter: true,
    },
    {
      field: 'debitAmount',
      headerName: 'Debit Amount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'creditAmount',
      headerName: 'Credit Amount',

      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: 'center' },
    },
    {
      field: 'balance',
      headerName: 'Balance',

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

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div
        className="ag-theme-quartz"
        style={{
          overflow: 'auto',
          height: '300px',
          width: '100%',
          overflow: 'hidden',
          maxHeight: '600px',
        }}
      >
        <h3 className="font-semibold text-[16px] text-primary font-montserrat mb-2">
          Bank Statement Lines
        </h3>
        <AgGridReact
          rowData={bankStatement}
          columnDefs={bankStatementColDefs}
          rowSelection="multiple"
          defaultColDef={{ resizable: true, sortable: true }}
          domLayout="autoHeight"
        />
      </div>

      <div
        className="ag-theme-quartz"
        style={{
          overflow: 'auto',
          height: '300px',
          width: '100%',
          overflow: 'hidden',
          maxHeight: '600px',
          zIndex: 9999999999,
        }}
      >
        <h3 className="font-semibold text-[16px] text-primary font-montserrat mb-2">
          Bank Account Ledger Entries
        </h3>
        <AgGridReact
          rowData={bankSubledger}
          columnDefs={bankAccountColDefs}
          rowSelection="multiple"
          defaultColDef={{ resizable: true, sortable: true }}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}

export default BankReconciliationCard;
