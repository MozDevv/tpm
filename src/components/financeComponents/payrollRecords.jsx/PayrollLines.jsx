import { formatNumber } from '@/utils/numberFormatters';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function PayrollLines({ payrollLines }) {
  /**  {
          "id": "5c34e9d8-1ef7-4e02-8a44-d4117ddcf79a",
          "awardId": "00000000-0000-0000-0000-000000000000",
          "pensionAwardName": "PRESIDENTIAL RETIREMENT PENSION",
          "grossAmount": 792000,
          "netAmount": 765600,
          "individualDeductionAmount": 0,
          "netArrears": 0,
          "taxAmount": 79200,
          "grossArrears": 0,
          "statutoryDeductions": 0,
          "payrollSummaryId": "00000000-0000-0000-0000-000000000000"
        }, */

  const columnDefs = [
    {
      field: 'pensionAwardName',
      headerName: 'Pension Award Name',
      headerClass: 'prefix-header',
      width: 250,
      cellRenderer: (params) => {
        return <p className="text-primary font-semibold ">{params.value}</p>;
      },
    },
    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'individualDeductionAmount',
      headerName: 'Individual Deduction Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'netArrears',
      headerName: 'Net Arrears',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'taxAmount',
      headerName: 'Tax Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'grossArrears',
      headerName: 'Gross Arrears',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'statutoryDeductions',
      headerName: 'Statutory Deductions',
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

export default PayrollLines;
