import BaseCollapse from "@/components/baseComponents/BaseCollapse";
import BaseLoadingOverlay from "@/components/baseComponents/BaseLoadingOverlay";
import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function DeductionsDetails() {
  const columnDefs = [
    {
      field: "pensionable_service_years",
      headerName: "Years",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
    },
    {
      field: "pensionable_service_months",
      headerName: "Months",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
    },
    {
      field: "pensionable_service_days",
      headerName: "Days",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
    },
    {
      field: "pensionable_service_cumulative_months",
      headerName: "Cumulative Months",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
    },
  ];
  const [rowData, setRowData] = useState([]);
  const gridApiRef = useRef(null);

  const [gridApi, setGridApi] = useState(null);

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "Loading..." };
  }, []);
  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-quartz h-[150px] mt-5 px-9">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
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
        // onSelectionChanged={onSelectionChanged}
        onRowClicked={(e) => {
          console.log("e.data", e.data);
          //   setOpenBaseCard(true);
          //   setClickedItem(e.data);
        }}
      />
    </div>
  );
}

export default DeductionsDetails;
