import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import endpoints, { apiService } from '@/components/services/setupsApi';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import { formatNumber } from '@/utils/numberFormatters';

function PayrollDeductionDetails({ payrollDetails }) {
  const columnDefs = [
    {
      field: 'amount',
      headerName: 'Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'deductionName',
      headerName: 'Deduction Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  return (
    <div className="ag-theme-quartz min-h-[600px] max-h-[600px] h-[200px] mt-5 px-9">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={payrollDetails.flatMap((item) =>
          item.deductions.map((deduction) => ({
            ...deduction,
            deductionName: deduction.deductionsMaster.deductionName,
          }))
        )}
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
        noRowsOverlayComponent={BaseEmptyComponent}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
          //  onGridReady(params);
        }}
        rowSelection="multiple"
        className="custom-grid ag-theme-quartz"
        // onSelectionChanged={onSelectionChanged}
        onRowClicked={(e) => {
          console.log('e.data', e.data);
          //   setOpenBaseCard(true);
          //   setClickedItem(e.data);
        }}
      />
    </div>
  );
}

export default PayrollDeductionDetails;
