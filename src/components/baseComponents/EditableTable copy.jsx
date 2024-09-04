"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import { message } from "antd";
import { Add, Delete } from "@mui/icons-material";
import DatePickerEditor from "./DatePickerEditor";

const EditableTable = ({
  fields = [],
  initialData,
  validators = {},
  handleSave,
  handleUpdate,
  validationErrorsFromApi,
  fetchData,
}) => {
  // Initialize rowData with initialData
  const [rowData, setRowData] = useState(initialData);
  const [rowErrors, setRowErrors] = useState({});

  useEffect(() => {
    fetchData().then((data) => {
      setRowData(data);
    });
  }, []);

  const gridApiRef = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
    console.log("Grid is ready, API set:", gridApiRef.current);
  }, []);

  const isRowComplete = (row) => {
    return fields.every(
      (field) =>
        row[field.value] !== undefined &&
        row[field.value] !== null &&
        row[field.value] !== ""
    );
  };

  // Create column definitions based on fields
  const headers = fields.map((col) => {
    let columnDef = {
      headerName: col.label,
      field: col.value,
      editable: true,
      sortable: true,
      filter: true,
      headerClass: (params) => {
        const isError = rowErrors[params.column.getColId()];
        return isError ? "error-header" : "";
      },
      cellStyle: (params) => {
        if (rowErrors[params.data.id]) {
          return {
            border: "1px solid red",
          };
        }
        return {};
      },
    };

    if (col.type === "date") {
      columnDef.cellEditor = "agDateStringCellEditor";

      columnDef.valueFormatter = (params) =>
        params.value ? new Date(params.value).toLocaleDateString("en-us") : "";

      // Parser to handle shorthand date inputs
      columnDef.valueParser = (params) => {
        const parseDate = (input) => {
          // Example input: 22024 should parse to 2/20/2024
          if (/^\d{5,6}$/.test(input)) {
            const month = parseInt(input.slice(0, 2), 10) - 1;
            const day = parseInt(input.slice(2, 4), 10);
            const year =
              input.length === 5 ? `20${input.slice(4)}` : input.slice(4);
            const parsedDate = new Date(year, month, day);

            // Check if the date is valid
            if (!isNaN(parsedDate.getTime())) {
              return parsedDate.toISOString(); // Return ISO string to store in the grid
            }
          }

          // Fall back to the default behavior
          const fallbackDate = new Date(input);
          return isNaN(fallbackDate.getTime())
            ? input // If not a valid date, return input as is
            : fallbackDate.toISOString();
        };

        // Parse the user input into a date
        return parseDate(params.newValue);
      };
    } else if (col.type === "select") {
      const options = col.options.map((option) => option.name);

      columnDef.cellEditor = "agSelectCellEditor";
      columnDef.cellEditorParams = {
        values: options,
      };

      columnDef.valueFormatter = (params) => {
        const selectedOption = col.options.find(
          (option) => option.id === params.value
        );
        return selectedOption ? selectedOption.name : params.value;
      };

      columnDef.valueParser = (params) => {
        const selectedOption = col.options.find(
          (option) => option.name === params.newValue
        );
        return selectedOption ? selectedOption.id : params.newValue;
      };
    }

    columnDef.onCellValueChanged = async (params) => {
      const { colDef, data, newValue } = params;
      const field = colDef.field;

      if (colDef.cellEditor === "agSelectCellEditor") {
        const selectField = fields.find(
          (field) => field.value === colDef.field
        );

        if (selectField && selectField.options) {
          const selectedOption = selectField.options.find(
            (option) => option.name === newValue
          );

          if (selectedOption) {
            data[field] = selectedOption.id;
          }
        }
      }
      console.log("Cell Value Changed:", params);
      console.log("Updated Data:", data);

      if (validators[field]) {
        const error = validators[field](newValue);
        if (error) {
          message.error(`Validation Error on ${field}: ${error}`);
        }
      }

      // Autosave if the row is complete
      if (isRowComplete(data)) {
        try {
          if (data.id) {
            await handleUpdate(data);
            refreshData();
          } else {
            await handleSave(data);
            refreshData();
          }
          message.success("Row saved successfully!");

          setRowErrors((prevErrors) => {
            const existingErrors = { ...prevErrors };
            delete existingErrors[data.id];
            return existingErrors;
          });
        } catch (error) {
          message.error("Error saving row: " + error.message);
          setRowErrors((prevErrors) => {
            return { ...prevErrors, [data.id]: true };
          });
        }
      }
    };

    return columnDef;
  });

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

  const onAddRow = async () => {
    if (gridApiRef.current) {
      const editedData = [];
      gridApiRef.current.forEachNode((node) => {
        editedData.push(node.data);
      });

      console.log("Edited data:", editedData);

      if (editedData.length > 0) {
        const newRow = fields.reduce((acc, field) => {
          acc[field.value] = "";
          return acc;
        }, {});
        setRowData((prevRowData) => [...prevRowData, newRow]);
        message.info("New row added!");
      }
    } else {
      message.error("Unable to add a new row. Grid is not ready.");
    }
  };
  const refreshData = async () => {
    try {
      const newData = await fetchData();
      setRowData(newData);
    } catch (error) {
      message.error("Error refreshing data: " + error.message);
    }
  };

  return (
    <div
      className="ag-theme-quartz"
      style={{ maxHeight: "400px", width: "100%", height: "300px" }}
    >
      <div className="flex flex-row gap-5 ml-[-20px]">
        <Button
          onClick={onAddRow}
          variant="text"
          startIcon={<Add />}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          Add Lines
        </Button>
        <Button
          onClick={onAddRow}
          variant="text"
          startIcon={<Delete />}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          Delete Lines
        </Button>
      </div>
      <AgGridReact
        ref={gridApiRef}
        rowData={rowData}
        columnDefs={headers}
        defaultColDef={{ flex: 1, minWidth: 150, height: "100%" }}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default EditableTable;
