import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import endpoints, { apiService } from '@/components/services/setupsApi';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';

function DeductionsDetails({ clickedItem }) {
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'mda',
      headerName: 'Ministry/Department/Agency',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'deductions_and_refunds_id',
      headerName: 'Deductions/Refunds ',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        const deduction = recoveryDeductions.find(
          (deduction) => deduction.id === params.value
        );
        return deduction ? deduction.name : params.value;
      },
    },
  ];
  const [rowData, setRowData] = useState([]);
  const gridApiRef = useRef(null);

  const [gridApi, setGridApi] = useState(null);

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);
  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

  const [recoveryDeductions, setRecoveryDeductions] = useState([]);

  const fetchRecoveryDeductions = async () => {
    try {
      const res = await apiService.get(endpoints.getRecoveryDeductions);
      const data = res.data.data;
      setRecoveryDeductions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [filteredData, setFilteredData] = useState([]);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(
        endpoints.getDeductions(clickedItem.retiree)
      );
      const data = res.data.data;
      setFilteredData(transformData(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchRecoveryDeductions();
    fetchMaintenance();
  }, []);

  return (
    <div className="ag-theme-quartz h-[150px] mt-5 px-9">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={filteredData}
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
        noRowsOverlayComponent={BaseEmptyComponent}
        // alwaysShowVerticalScroll={true}

        // loadingOverlayComponent={BaseLoadingOverlay} // Use your custom loader
        // loadingOverlayComponentParams={loadingOverlayComponentParams}
        // paginationPageSize={pageSize}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
          onGridReady(params);
          //  gridApiRef.current.api.showLoadingOverlay();
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

export default DeductionsDetails;
