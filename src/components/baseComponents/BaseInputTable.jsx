"use client";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Button, Divider, IconButton, Tooltip } from "@mui/material";
import { message } from "antd";
import { Add, Api, Cancel, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import BaseLoadingOverlay from "./BaseLoadingOverlay";
import "./editabletable.css";
import { baseValidatorFn } from "./BaseValidatorFn";

const BaseInputTable = ({
  fields = [],
  validators = {},
  title,
  id,
  idLabel,
  initialData = [],
  apiService,
  putApiService,
  postApiService,
  getApiService,
  postEndpoint,
  putEndpoint,
  getEndpoint,
  deleteEndpoint,
  setSelectedValue,
  refetchDataFromAnotherComponent,
}) => {
  const [rowData, setRowData] = useState(() => {
    const defaultRows = Array.from({ length: 2 }, () =>
      fields.reduce((acc, field) => {
        acc[field.value] = "";
        return acc;
      }, {})
    );

    return [...defaultRows, ...initialData];
  });

  const [rowErrors, setRowErrors] = useState({});

  const sortData = (data) => {
    const dateField = data[0]?.date
      ? "date"
      : data[0]?.startDate
      ? "startDate"
      : data[0]?.start_date
      ? "start_date"
      : null;

    const sortedData = dateField
      ? data.sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))
      : data.sort((a, b) => a.id - b.id);

    return sortedData;
  };

  const fetchData = async () => {
    console.log(
      "Fetching Data from Editable Table",
      getEndpoint,
      getApiService
    );
    try {
      const res = await getApiService(getEndpoint);
      if (res.status === 200) {
        console.log("Fecthed Data from Editable Table", res.data.data);
        //  setRowData(res.data.data);
        setRowData((prevRowData) => {
          const defaultRows = Array.from({ length: 1 }, () =>
            fields.reduce((acc, field) => {
              acc[field.value] = "";
              return acc;
            }, {})
          );

          const sortedData = sortData(res.data.data);
          return [...sortedData, ...defaultRows];
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gridApiRef = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
    console.log("Grid is ready, API set:", gridApiRef.current);
  }, []);

  const isRowComplete = (row) => {
    return fields.every((field) => {
      return (
        row[field.value] !== undefined &&
        row[field.value] !== null &&
        row[field.value] !== ""
      );
    });
  };

  const deleteRow = async (rowId) => {
    try {
      const res = await apiService.delete(deleteEndpoint(rowId));
      if (res.status === 200 && res.data.succeeded) {
        refreshData();
        message.success("Record deleted successfully");
        setRowData((prevData) => {
          return prevData.filter((row) => row.id !== rowId);
        });
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

  const mdaId = localStorage.getItem("mdaId");

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
        const res = await putApiService(putEndpoint, {
          ...formattedFormData,
          id: data.id,
        });

        if (res.status === 200 && res.data.succeeded) {
          refreshData();

          message.success("Record updated successfully");
        } else if (
          res?.data?.validationErrors &&
          res?.data?.validationErrors?.length > 0
        ) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
            setRowErrors((prevErrors) => {
              return { ...prevErrors, [data.id]: true };
            });
          });
          throw new Error("An error occurred while submitting the data.");
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.message.length > 0
        ) {
          setRowErrors((prevErrors) => {
            return { ...prevErrors, [data.id]: true };
          });
          message.error(res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await postApiService(postEndpoint, formattedFormData);

        if (res.status === 200 && res.data.succeeded) {
          refreshData();
          refetchDataFromAnotherComponent?.();
          message.success("Record added successfully");
        }
        if (
          res?.data?.validationErrors &&
          res?.data?.validationErrors?.length > 0
        ) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
          setRowErrors((prevErrors) => {
            return { ...prevErrors, [data.id]: true };
          });
          throw new Error("An error occurred while submitting the data.");
        }
      }
    } catch (error) {
      setRowErrors((prevErrors) => {
        return { ...prevErrors, [data.id]: true };
      });
      console.log(error);
      throw error;
    } finally {
    }
  };
  const setCellError = (rowId, field, error) => {
    setRowErrors((prevErrors) => ({
      ...prevErrors,
      [rowId]: {
        ...prevErrors[rowId],
        [field]: error,
      },
    }));
  };
  const handleClearError = (data, field) => {
    setRowErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[data.id]) {
        delete updatedErrors[data.id][field];
        if (Object.keys(updatedErrors[data.id]).length === 0) {
          delete updatedErrors[data.id];
        }
      }
      return updatedErrors;
    });
  };

  const headers = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 10,
      headerCheckboxSelectionFilteredOnly: true,
      maxWidth: 40,
      flex: 0,
      suppressSizeToFit: true,
      cellStyle: { width: "50px", borderRight: "1px solid #f0f0f0" },
    },
    ...fields.map((col, index) => {
      let columnDef = {
        headerName: col.label,
        field: col.value,
        editable: !col.disabled,
        sortable: true,

        filter: true,
        headerClass: (params) => {
          const isError = rowErrors[params.column.getColId()];
          return isError ? "error-header" : "";
        },
        cellRenderer: (params) => {
          const { value, data, colDef } = params;
          const field = colDef.field;
          const rowId = data.id;

          // Check for error related to the specific cell field
          const hasError = rowErrors[rowId] && rowErrors[rowId][field];
          const error = `Your Entry of "${value}" is not valid. ${
            hasError ? rowErrors[rowId][field] : ""
          }`;

          return (
            <div style={{ position: "relative", display: "flex" }}>
              {hasError && (
                <Tooltip
                  title={error}
                  arrow
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        fontSize: "0.75rem",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        maxWidth: "200px",
                        wordWrap: "break-word",
                      },
                    },
                  }}
                >
                  <IconButton
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    size="small"
                    onClick={() => {
                      // Clear the error
                      setRowErrors((prevErrors) => {
                        const updatedErrors = { ...prevErrors };
                        if (updatedErrors[rowId]) {
                          delete updatedErrors[rowId][field];
                          if (Object.keys(updatedErrors[rowId]).length === 0) {
                            delete updatedErrors[rowId];
                          }
                        }
                        return updatedErrors;
                      });
                    }}
                  >
                    <Cancel fontSize="small" sx={{ color: "crimson" }} />
                  </IconButton>
                </Tooltip>
              )}
              {params.value}
            </div>
          );
        },

        cellStyle: (params) => {
          if (rowErrors[params.data.id]) {
            return {
              border: "1px solid red",
            };
          }
          return {
            borderRight: "1px solid #f0f0f0",
          };
        },
      };

      if (col.type === "date") {
        columnDef.cellEditor = "agDateStringCellEditor";

        // Format the date to 'dd/mm/yyyy'
        columnDef.valueFormatter = (params) => {
          if (!params.value) return "";

          const date = new Date(params.value);
          if (isNaN(date.getTime())) return params.value;

          // Format to 'dd/mm/yyyy'
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();

          return `${day}/${month}/${year}`;
        };

        columnDef.valueParser = (params) => {
          const parseDate = (input) => {
            // Parse 'MMDDYY' or 'MMDDYYYY' formats
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

            // Attempt fallback parsing
            const fallbackDate = new Date(input);
            return isNaN(fallbackDate.getTime())
              ? input
              : fallbackDate.toISOString();
          };

          // Parse the user input into a date
          return parseDate(params.newValue);
        };
      } else if (col.type === "select" && col.options && col.options.length) {
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
      } else if (col.hide) {
        columnDef.hide = true;
      } else if (col.value === "phone_number") {
        const defaultPhoneNumberValue = "+254";
        columnDef.valueFormatter = (params) => {
          if (!params.value) return "";
          return params.value.startsWith("0")
            ? defaultPhoneNumberValue + params.value.slice(1)
            : params.value;
        };
      }

      columnDef.onCellValueChanged = async (params) => {
        const { colDef, data, newValue } = params;
        const field = colDef.field;

        const validator = baseValidatorFn[field];
        if (validator) {
          const error = validator(newValue);
          if (error) {
            message.error(`Validation Error on ${field}: ${error}`);
            setCellError(data.id, field, error);
            return;
          } else {
            handleClearError(data, field);
          }
        }

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

          columnDef.valueFormatter = (params) => {
            if (!params.value) return ""; // Handle empty or undefined values
            const selectedOption = col.options.find(
              (option) => option.id === params.value
            );
            return selectedOption ? selectedOption.name : params.value; // Display name or the value if not found
          };

          // Parse displayed name back to ID
          columnDef.valueParser = (params) => {
            const selectedOption = col.options.find(
              (option) => option.name === params.newValue
            );
            return selectedOption ? selectedOption.id : params.newValue; // Return ID if matched, else raw input
          };

          // Ensure that the initial values (default) are correctly formatted
          columnDef.getQuickFilterText = (params) => {
            const selectedOption = col.options.find(
              (option) => option.id === params.value
            );
            return selectedOption ? selectedOption.name : params.value; // Use name for filtering
          };
        }
        if (colDef.cellEditor === "agSelectCellEditor") {
        }

        if (data.designationId) {
          setSelectedValue(data.designationId);
        }

        if (data.total_emoluments) {
          data.contribution_amount =
            (data.total_emoluments * 0.02).toFixed(2) * 1;
        }

        console.log("Cell Value Changed:", params);
        console.log("Updated Data:", data);

        if (validators[field]) {
          const error = validators[field](newValue);
          if (error) {
            message.error(`Validation Error on ${field}: ${error}`);
          }
        }

        if (isRowComplete(data)) {
          if (data.id) {
            await handleSave(data);
          } else {
            await handleSave(data);
          }
          await refreshData();

          message.success("Row saved successfully!");

          setRowErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[data.id];
            return updatedErrors;
          });
        }
      };

      return columnDef;
    }),
  ];

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
      await fetchData();
    } catch (error) {
      message.error("Error refreshing data: " + error.message);
    }
  };
  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "Loading..." };
  }, []);

  const onCellKeyDown = (event) => {
    if (event.event.key === "Enter") {
      event.api.stopEditing(); // Stop editing the current cell

      event.api.tabToNextCell();

      const nextCell = event.api.getFocusedCell();

      if (nextCell) {
        event.api.startEditingCell({
          rowIndex: nextCell.rowIndex,
          colKey: nextCell.column.getId(),
        });
      }
      event.event.preventDefault();
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
          New Line
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
          onCellKeyDown={onCellKeyDown}
          onGridReady={onGridReady}
          loadingOverlayComponent={BaseLoadingOverlay}
          loadingOverlayComponentParams={loadingOverlayComponentParams}
          domLayout="autoHeight"
          rowSelection="multiple"
          singleClickEdit={true}
        />
      </div>
    </div>
  );
};

export default BaseInputTable;
