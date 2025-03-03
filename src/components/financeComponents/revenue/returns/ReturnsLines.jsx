import { formatNumber } from '@/utils/numberFormatters';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function ReturnsLines({ payrollLines }) {
  /**  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "pensionerName": "string",
          "pensionerNo": "string",
          "returnReason": "string",
          "returnId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "amount": 0 */
  const columnDefs = [
    {
      field: 'pensionerNo',
      headerName: 'Pensioner No',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-primary font-semibold ">{params.value}</p>;
      },
    },
    {
      field: 'pensionerName',
      headerName: 'Pensioner Name',
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
    {
      field: 'returnReason',
      headerName: 'Return Reason',
      headerClass: 'prefix-header',
      flex: 1,
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

export default ReturnsLines;
