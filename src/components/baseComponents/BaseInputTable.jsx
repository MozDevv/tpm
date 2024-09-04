"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button } from "@mui/material";
import { message } from "antd";
import { Add, Api, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

const BaseInputTable = ({
  fields = [],
  validators = {},
  title,
  id,
  idLabel,
  initialData = [],
  apiService,
  postEndpoint,
  putEndpoint,
  getEndpoint,
  deleteEndpoint,
  setSelectedValue,
}) => {
  const [rowData, setRowData] = useState(() => {
    const emptyRows = Array.from({ length: 1 }, () =>
      fields.reduce((acc, field) => {
        acc[field.value] = "";
        return acc;
      }, {})
    );

    return [...initialData, ...emptyRows];
  });

  const [rowErrors, setRowErrors] = useState({});

  const fetchData = async () => {
    try {
      const res = await apiService.get(getEndpoint);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

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

  const deleteRow = async (rowId) => {
    try {
      const res = await apiService.delete(`${deleteEndpoint}/${rowId}`);
      if (res.status === 200 && res.data.succeeded) {
        refreshData();
        message.success("Record deleted successfully");
      } else {
        message.error("An error occurred while deleting the record.");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while deleting the record.");
    }
  };
  const handleDeleteSelectedRows = async () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      const rowsToDelete = selectedNodes.map((node) => node.data);

      const rowsWithId = rowsToDelete.filter((row) => row.id);
      const rowsWithoutId = rowsToDelete.filter((row) => !row.id);

      for (const row of rowsWithId) {
        await deleteRow(row.id);
      }
      setRowData((prevData = []) => {
        return prevData.filter((row) => !rowsWithoutId.includes(row));
      });

      setRowErrors((prevErrors = {}) => {
        rowsWithoutId.forEach((row) => {
          delete prevErrors[row.id];
        });
        return { ...prevErrors };
      });

      message.success("Selected rows deleted successfully!");
    } else {
      message.error("Unable to delete rows. Grid is not ready.");
    }
  };

  const handleSave = async (data) => {
    const formattedFormData = { ...data };
    if (id) {
      formattedFormData[idLabel] = id;
    }
    Object.keys(formattedFormData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });
    try {
      if (data.id) {
        const res = await apiService.put(putEndpoint, {
          ...formattedFormData,
          id: data.id,
        });

        if (res.status === 200 && res.data.succeeded) {
          refreshData();

          message.success("Record updated successfully");
        } else if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.message.length > 0
        ) {
          message.error(res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await apiService.post(postEndpoint, formattedFormData);

        if (res.status === 200 && res.data.succeeded) {
          refreshData();

          message.success("Record added successfully");
        }
        if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
          throw new Error("An error occurred while submitting the data.");
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const headers = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 20,
      headerCheckboxSelectionFilteredOnly: true,
      maxHeight: 30,
      flex: 0,
      suppressSizeToFit: true,
    },
    ...fields.map((col, index) => {
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
          params.value
            ? new Date(params.value).toLocaleDateString("en-us")
            : "";

        columnDef.valueParser = (params) => {
          const parseDate = (input) => {
            if (/^\d{5,6}$/.test(input)) {
              const month = parseInt(input.slice(0, 2), 10) - 1;
              const day = parseInt(input.slice(2, 4), 10);
              const year =
                input.length === 5 ? `20${input.slice(4)}` : input.slice(4);
              const parsedDate = new Date(year, month, day);

              if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString();
              }
            }

            const fallbackDate = new Date(input);
            return isNaN(fallbackDate.getTime())
              ? input
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

        if (data.designationId) {
          setSelectedValue(data.designationId);
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
    }),
  ];

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

      // Check if there are existing rows
      gridApiRef.current.forEachNode((node) => {
        editedData.push(node.data);
      });

      console.log("Edited data:", editedData);

      const newRow = fields.reduce((acc, field) => {
        acc[field.value] = "";
        return acc;
      }, {});

      setRowData((prevRowData) => {
        if (!prevRowData) {
          console.error(
            "Previous row data is undefined. Initializing with an empty array."
          );
          prevRowData = [];
        }

        const updatedRowData = [...prevRowData, newRow];
        return updatedRowData;
      });

      message.info("New row added!");
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
    <div className="ag-theme-quartz">
      <div className="text-primary font-montserrat text-base font-semibold mb-2">
        {title}
      </div>
      <div className="flex flex-row gap-5 ml-[-15px]">
        <Button
          onClick={onAddRow}
          variant="text"
          startIcon={<Add />}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          Add Lines
        </Button>
        <Button
          onClick={handleDeleteSelectedRows}
          variant="text"
          startIcon={<Delete />}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        >
          Delete Lines
        </Button>
      </div>
      <div className="" style={{ maxHeight: "500px", width: "100%" }}>
        <AgGridReact
          ref={gridApiRef}
          rowData={rowData}
          columnDefs={headers}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            height: "400px",
            minHehight: "100px",
          }}
          onGridReady={onGridReady}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default BaseInputTable;
