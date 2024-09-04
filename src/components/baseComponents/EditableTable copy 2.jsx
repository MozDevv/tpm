"use client";
import React, { useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import { message } from "antd";

const EditableTable = ({
  fields = [],
  initialData = [],
  validators = {},
  handleSave,
  handleUpdate,
  validationErrorsFromApi,
}) => {
  const [rowData, setRowData] = useState(initialData);
  const gridApiRef = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
    console.log("Grid is ready, API set:", gridApiRef.current);
  }, []);

  const headers = fields.map((col) => {
    let columnDef = {
      headerName: col.label,
      field: col.value,
      editable: true,
      sortable: true,
      filter: true,
    };

    if (col.type === "date") {
      columnDef.cellEditor = "agDateCellEditor";
      columnDef.valueFormatter = (params) =>
        params.value ? new Date(params.value).toLocaleDateString("en-us") : "";
    } else if (col.type === "select") {
      // Ensure options are correctly mapped
      const options = col.options.map((option) => ({
        value: option.id,
        text: option.name,
      }));

      columnDef.cellEditor = "agSelectCellEditor";
      columnDef.cellEditorParams = {
        values: options.map((opt) => opt.text), // Set the displayed values (names) in the editor
      };

      columnDef.valueFormatter = (params) => {
        const selectedOption = col.options.find(
          (option) => option.id === params.value
        );
        return selectedOption ? selectedOption.name : params.value;
      };

      columnDef.valueParser = (params) => {
        console.log("ValueParser Params:", params); // Log params to debug
        const selectedOption = col.options.find(
          (option) => option.name === params.newValue
        );
        console.log("Selected Option:", selectedOption); // Log the selected option
        return selectedOption ? selectedOption.id : params.newValue;
      };
    }
    // Add validation on cell value change
    columnDef.onCellValueChanged = (params) => {
      const { colDef, data } = params;
      const field = colDef.field;
      console.log("Cell Value Changed:", params); // Log params to debug
      console.log("Data:", data); // Log data to debug
      if (validators[field]) {
        const error = validators[field](params.newValue);
        if (error) {
          message.error(`Validation Error on ${field}: ${error}`);
          console.log("Validation Error:", error);
        } else {
          // Automatically save when validation passes
          // handleSave(data);
        }
      }
    };

    return columnDef;
  });

  // Function to save edited data
  const onSave = () => {
    if (gridApiRef.current) {
      const allRowData = [];
      gridApiRef.current.forEachNode((node) => {
        allRowData.push(node.data);
      });
      handleSave(allRowData);
      message.success("Changes saved successfully!");
    } else {
      message.error("Unable to save. Grid is not ready.");
    }
  };

  // Add a new row and trigger save for the previous row if modified
  const onAddRow = async () => {
    if (gridApiRef.current) {
      const editedData = [];
      gridApiRef.current.forEachNode((node) => {
        editedData.push(node.data);
      });

      console.log("Edited data:", editedData);

      if (editedData.length > 0) {
        try {
          await handleSave(editedData[0]);
          const newRow = fields.reduce((acc, field) => {
            acc[field.value] = "";
            return acc;
          }, {});
          setRowData((prevRowData) => [...prevRowData, newRow]);
          message.info("New row added!");
        } catch (error) {
          message.error(
            "Error saving the previous row. Please resolve the issue and try again."
          );
        }
      }
    } else {
      message.error("Unable to add a new row. Grid is not ready.");
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: "400px", width: "100%" }}>
      <Button
        onClick={onAddRow}
        variant="contained"
        style={{ marginLeft: "10px", marginBottom: "10px" }}
      >
        Add Row
      </Button>
      <AgGridReact
        ref={gridApiRef}
        rowData={rowData}
        columnDefs={headers}
        defaultColDef={{ flex: 1, minWidth: 150, height: 50 }}
        onGridReady={onGridReady} // Ensure onGridReady sets the API
      />
    </div>
  );
};

export default EditableTable;
