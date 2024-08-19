"use client";
import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@mui/material";

const EditableTable = ({ handleSave }) => {
  // Define sample columns directly in the component
  const columns = [
    { title: "First Name", value: "firstName", type: "text" },
    { title: "Last Name", value: "lastName", type: "text" },
    { title: "Id", value: "id", type: "number" },
    { title: "Date of Birth", value: "dob", type: "date" },
    {
      title: "Role",
      value: "role",
      type: "select",
      options: ["Admin", "User", "Guest"],
    },
    { title: "Email", value: "email", type: "text" },
  ];

  const [rowData, setRowData] = useState([
    {
      firstName: "John",
      lastName: "Doe",
      dob: new Date(),
      role: 1,
      email: "john.doe@example.com",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      dob: new Date(),
      role: 2,
      email: "jane.smith@example.com",
    },
  ]);

  const gridApiRef = useRef(null);

  const dateFormatter = (params) => {
    return new Date(params.value).toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const headers = columns.map((col) => {
    let hd = {
      headerName: col.title,
      field: col.value,
      editable: true,
      sortable: true,
      filter: true,
    };

    // Enable date type
    if (col.type === "date") {
      Object.assign(hd, { valueFormatter: dateFormatter });
    }

    if (col.type === "select") {
      const options = col.options;
      const valueMap = {};
      const reverseValueMap = {};
      options.forEach((option, index) => {
        valueMap[index + 1] = option;
        reverseValueMap[option] = index + 1;
      });

      Object.assign(hd, {
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: options,
        },
        valueFormatter: (params) => valueMap[params.value],
        valueParser: (params) => reverseValueMap[params.newValue],
      });
    }

    return hd;
  });

  // Adding selection checkboxes
  headers.unshift({
    headerName: "",
    field: "id",
    width: 50,
    pinned: "left",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    valueGetter: (params) => {
      const rowIndex = params.node.rowIndex + 1;
      return rowIndex;
    },
  });

  const [columnDefs, setColumnDefs] = useState(headers);
  const rowSelection = "multiple";

  const getRowHeight = () => 35;

  const defaultColDef = {
    resizable: true,
  };

  const addRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.value] =
        col.type === "select"
          ? col.options[0]
          : col.type === "date"
          ? new Date()
          : "";
      return acc;
    }, {});
    setRowData([...rowData, newRow]);
  };

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  return (
    <div className="flex items-center justify-center w-full h-full my-4">
      <div
        className="ag-theme-alpine"
        style={{
          height: "320px",
          width: "100%",
        }}
      >
        <div className="w-full flex justify-start items-center gap-4">
          <Button variant="contained" sx={{ mb: 2 }} onClick={addRow}>
            Add Record
          </Button>
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowHeight={getRowHeight}
          rowSelection={rowSelection}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default EditableTable;
