"use client";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@mui/material";
import "./ag-theme.css";

const headers = ["Column 1", "Column 2", "Column 3"]; // Define your table headers

function Test() {
  const [rowData, setRowData] = useState([]);

  const columnDefs = headers.map((header) => ({
    headerName: header,
    field: header.toLowerCase().replace(/\s+/g, "_"), // Convert headers to field names
    editable: true,
    sortable: true,
    filter: true,
  }));

  const defaultColDef = {
    resizable: true,
  };

  const addRow = () => {
    setRowData([...rowData, {}]);
  };

  const getRowHeight = () => 35;

  return (
    <div className="flex items-center justify-center w-full h-full my-10">
      <div
        className="ag-theme-alpine"
        style={{
          height: "400px",
          width: "100%",
        }}
      >
        <Button variant="contained" sx={{ mb: 2 }} onClick={addRow}>
          Add Row
        </Button>{" "}
        {/* Example button to add rows */}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowHeight={getRowHeight}
        />
      </div>
    </div>
  );
}

export default Test;
