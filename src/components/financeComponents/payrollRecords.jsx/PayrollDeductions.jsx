import { formatNumber } from '@/utils/numberFormatters';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function PayrollDeductions({ payrollLines }) {
  /** {
          "id": "4316a6d4-c86f-41b5-b41b-32a33268da8a",
          "coreDeductionId": "dba92722-f757-482c-8801-39755af74caa",
          "amount": 26400,
          "payrollSummaryId": "00000000-0000-0000-0000-000000000000",
          "deductionAndRefundName": "Chief Pension Accountant Deductions"
        }, */

  const columnDefs = [
    {
      field: 'deductionAndRefundName',
      headerName: 'Deduction And Refund Name',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
  ];
  return (
    <div>
      <div className="min-h-[600px] max-h-[600px] h-[200px]">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={payrollLines}
          pagination={false}
          domLayout="normal"
          alwaysShowHorizontalScroll={true}
          className="custom-grid ag-theme-quartz"
          rowSelection="multiple"
          // onSelectionChanged={onSelectionChanged}
          //   onRowClicked={(e) => {
          //     setOpenBaseCard(true);
          //     console.log('e.data', e.data);
          //     setClickedRow(e.data);
          //   }}
        />
      </div>
    </div>
  );
}

export default PayrollDeductions;
