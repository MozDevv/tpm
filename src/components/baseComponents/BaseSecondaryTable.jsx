// BaseSecondaryTable.jsx
import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const BaseSecondaryTable = ({
  columnDefs,
  rowData,
  onRowClicked,
  pagination = false,
  height = "60vh",
  additionalStyles = {},
  alwaysShowHorizontalScroll = true,
  title,
  handleButtonClick,
}) => {
  return (
    <div
      className="ag-theme-quartz"
      style={{
        height,
        overflowY: "auto",
        ...additionalStyles,
      }}
    >
      <div className="text-primary font-semibold text-base my-2 px-3 font-montserrat">
        {title}
      </div>

      <Button
        variant="text"
        startIcon={<Add />}
        sx={{ my: 2, ml: 1 }}
        onClick={handleButtonClick}
      >
        New {title}
      </Button>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={pagination}
        domLayout="autoHeight"
        alwaysShowHorizontalScroll={alwaysShowHorizontalScroll}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
        onRowClicked={onRowClicked}
      />
    </div>
  );
};

export default BaseSecondaryTable;
