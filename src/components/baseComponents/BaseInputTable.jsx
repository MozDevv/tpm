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
import { Button, Collapse, Divider, IconButton, Tooltip } from "@mui/material";
import { message } from "antd";
import {
  Add,
  Api,
  Cancel,
  CloudUpload,
  Delete,
  ExpandLess,
  KeyboardArrowRight,
} from "@mui/icons-material";
import dayjs from "dayjs";
import BaseLoadingOverlay from "./BaseLoadingOverlay";
import "./editabletable.css";
import { baseValidatorFn } from "./BaseValidatorFn";
import { parseDate } from "@/utils/dateFormatter";
import * as XLSX from "xlsx";
import { VisuallyHiddenInput } from "@/utils/handyComponents";

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
  useExcel,
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
  const [openSections, setOpenSections] = useState({});
  const [sectionKey, setSectionKey] = useState(title);

  const handleToggleSection = (key) => {
    setOpenSections((prevOpenSections) => {
      return {
        ...prevOpenSections,
        [key]: !prevOpenSections[key],
      };
    });
  };

  const sortData = (data) => {
    const dateField = data[0]?.date
      ? "date"
      : data[0]?.startDate
      ? "startDate"
      : data[0]?.start_date
      ? "start_date"
      : data[0]?.from_date
      ? "from_date"
      : data[0]?.fromDate
      ? "fromDate"
      : null;

    const sortedData = dateField
      ? data.sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))
      : data.sort((a, b) => a.id - b.id);

    return sortedData;
  };

  const [dataAdded, setDataAdded] = useState(false);
  const fetchData = async () => {
    console.log(
      "Fetching Data from Editable Table",
      getEndpoint,
      getApiService
    );
    if (dataAdded) {
      try {
        const res = await getApiService(getEndpoint);
        if (res.status === 200) {
          console.log("Fetched Data from Editable Table", res.data.data);

          setRowData((prevRowData) => {
            const datePairs = [
              { start: "startDate", end: "endDate" },
              { start: "from_date", end: "to_date" },
              { start: "fromDate", end: "toDate" },
              { start: "date", end: "endDate" },
              { start: "date", end: "enddate" },
              { start: "start_date", end: "end_date" },
            ];

            const defaultRows = Array.from({ length: 1 }, () =>
              fields.reduce((acc, field) => {
                acc[field.value] = "";
                return acc;
              }, {})
            );

            const sortedData = sortData(res.data.data);

            let lastEndDate = null;
            let matchingStartField = null;
            if (sortedData.length > 0) {
              const lastRow = sortedData[sortedData.length - 1];

              console.log("Last Row:", lastRow);

              for (const { start, end } of datePairs) {
                if (lastRow[end]) {
                  lastEndDate = lastRow[end];
                  matchingStartField = start;
                  break;
                }
              }

              console.log("Last End Date Before Formatting:", lastEndDate);
            }

            if (lastEndDate && matchingStartField) {
              const formattedEndDate = dayjs(lastEndDate)
                .add(1, "day")
                .format("YYYY-MM-DDTHH:mm:ss[Z]");

              defaultRows[0][matchingStartField] = formattedEndDate;
            }

            console.log("Default Rows:", defaultRows);

            return [...sortedData, ...defaultRows];
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
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
      if (
        res.status === 200 ||
        res.status === 204 ||
        res.data.succeeded ||
        res.data.message[0] === "Record deleted successfully"
      ) {
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

    console.log("Formatted Form Data:", formattedFormData);
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

    console.log("Formatted Form Data After Date Handling:", formattedFormData);

    console.log("Formatted Form Data:", formattedFormData);
    try {
      if (data.id) {
        const res = await putApiService(putEndpoint, {
          ...formattedFormData,
          id: data.id,
        });

        if (res.status === 200 && res.data.succeeded) {
          refreshData();
          message.success("Record updated successfully");
          // Clear errors upon successful submission
          setRowErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[data.id];
            return updatedErrors;
          });
        } else if (
          res?.data?.validationErrors &&
          res?.data?.validationErrors?.length > 0
        ) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);

              setCellError(data.id, error.field, err);
            });
          });
          throw new Error("An error occurred while submitting the data.");
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.message.length > 0
        ) {
          message.error(res.data.message[0]);
          setCellError(data.id, null, res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await postApiService(postEndpoint, formattedFormData);

        if (res.status === 200 && res.data.succeeded) {
          refreshData();
          refetchDataFromAnotherComponent?.();
          message.success("Record added successfully");

          // Clear errors upon successful submission

          setRowErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[data.id];
            return updatedErrors;
          });
        } else if (
          res?.data?.validationErrors &&
          res?.data?.validationErrors?.length > 0
        ) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);

              setCellError(data.id, error.field, err);
            });
          });
          throw new Error("An error occurred while submitting the data.");
        }
      }
    } catch (error) {
      // Log the error and set a generic row error if needed
      setCellError(data.id, null, error.message || "An unknown error occurred");
      console.log(error);
      throw error;
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
          const options = col.options || [];

          // console.log("Params", params);
          // console.log("COL", colDef);
          // console.log("DATA", data);
          const isValidDateString = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
          };

          const hasError = rowErrors[rowId] && rowErrors[rowId][field];
          const error = `
          <div>
            <strong style="display: block; margin-bottom: 8px;">⚠️ Validation Error:</strong>
            <span style="font-weight: normal;">Your Entry of 
              <strong style="">"${
                value && isValidDateString(value) ? parseDate(value) : value
              }</strong>
          
            "</span> is not an acceptable value for 
            <strong>${colDef.headerName}</strong>. 
            ${hasError ? rowErrors[rowId][field] : ""}
          </div>
        `;

          const formatDate = (dateString) => {
            const date = new Date(dateString);

            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString("en-GB");
            }
            return dateString;
          };
          const getNameById = (id) => {
            const selectedField = fields.find(
              (field) => field.value === colDef.field
            );

            if (!selectedField || !selectedField.options) {
              console.log(
                "No matching field or options found for:",
                colDef.field
              );
              return id;
            }

            const selectedOption = selectedField.options.find(
              (option) => option.id === id
            );

            // console.log("Selected Option:", selectedOption);

            return selectedOption ? selectedOption.name : id;
          };

          const displayValue =
            col.type === "date"
              ? formatDate(value)
              : col.type === "select"
              ? getNameById(value)
              : value;

          return (
            <div style={{ position: "relative", display: "flex" }}>
              {hasError && (
                <Tooltip
                  title={<div dangerouslySetInnerHTML={{ __html: error }} />}
                  arrow
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        //   borderLeft: "2px solid crimson",
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
              {displayValue}
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

        columnDef.valueFormatter = (params) => {
          if (!params.value) return "";

          // Using dayjs to format the date
          const formattedDate = dayjs(params.value).format("DD/MM/YYYY");
          return formattedDate === "Invalid Date"
            ? params.value
            : formattedDate;
        };

        columnDef.valueParser = (params) => {
          const parseDate = (input) => {
            // Parsing logic as per your requirements
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
      const datePairs = [
        { start: "startDate", end: "endDate" },
        { start: "from_date", end: "to_date" },
        { start: "fromDate", end: "toDate" },
        { start: "date", end: "endDate" },
        { start: "start_date", end: "end_date" },
      ];

      const findDatePair = (field) => {
        return datePairs.find(
          (pair) => pair.start === field || pair.end === field
        );
      };

      columnDef.onCellValueChanged = async (params) => {
        const { colDef, data, newValue } = params;
        const field = colDef.field;

        setDataAdded(true);

        const datePair = findDatePair(field);

        if (datePair) {
          const currentStartDate = data[datePair.start];
          const currentEndDate = data[datePair.end];

          const startDate =
            field === datePair.start ? newValue : currentStartDate;
          const endDate = field === datePair.end ? newValue : currentEndDate;

          const error = baseValidatorFn.endDate(endDate, startDate);
          if (error) {
            message.error(`Validation Error on ${field}: ${error}`);
            setCellError(data.id, field, error);
            return;
          } else {
            handleClearError(data, field);
          }
        } else {
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
        if (data.start_date && data.end_date) {
          data.number_of_days = dayjs(data.end_date).diff(
            dayjs(data.start_date),
            "days"
          );
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
      let hasErrors = false;

      gridApiRef.current.forEachNode((node) => {
        const rowId = node.data.id;
        if (rowErrors[rowId] && Object.keys(rowErrors[rowId]).length > 0) {
          hasErrors = true;
          return;
        }
      });

      if (hasErrors) {
        message.error(
          "Please resolve errors in the current line before adding a new line."
        );
        return;
      }

      const editedData = [];

      gridApiRef.current.forEachNode((node) => {
        editedData.push(node.data);
      });

      console.log("Edited data:", editedData);

      const lastRow = editedData[editedData.length - 1];
      let previousEndDate = null;

      const datePairs = [
        { start: "startDate", end: "endDate" },
        { start: "from_date", end: "to_date" },
        { start: "fromDate", end: "toDate" },
        { start: "date", end: "endDate" },
        { start: "start_date", end: "end_date" },
      ];

      // Loop through date pairs to find a filled end date
      for (const { start, end } of datePairs) {
        if (lastRow && lastRow[end]) {
          previousEndDate = lastRow[end];
          break;
        }
      }

      // Initialize new row data
      const newRow = fields.reduce((acc, field) => {
        // Auto-populate start date field with the previous end date if available
        if (
          previousEndDate &&
          datePairs.some((pair) => pair.start === field.value)
        ) {
          acc[field.value] = previousEndDate;
        } else {
          acc[field.value] = "";
        }
        return acc;
      }, {});

      // Initialize new row errors to an empty object
      const newRowErrors = {};

      // Update row data state
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

      // Update row errors state
      setRowErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors[newRow.id] = newRowErrors; // Assuming newRow has an id
        return updatedErrors;
      });

      // message.info("New row added!");
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
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("JSON Data:", jsonData);
      console.log("Sheet Name:", sheetName);
      console.log("Sheet Data:", sheet);

      setRowData((prevData) => {
        const transformedData = jsonData.map((item) => {
          return fields.reduce((acc, field) => {
            acc[field.value] = item[field.label];
            return acc;
          }, {});
        });

        return [...transformedData, ...prevData];
      });
      if (jsonData.length > 0) {
        for (const row of jsonData) {
          setTimeout(async () => {
            await handleSave(row);
          }, 1500);
        }
      }
      console.log("Row Data:", rowData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="text-primary font-montserrat text-base font-semibold mb-2">
          {title}
        </div>
        <IconButton
          sx={{ ml: "-5px", zIndex: 1, mt: "-6px" }}
          onClick={() => handleToggleSection(sectionKey)}
        >
          {!openSections[sectionKey] ? (
            <KeyboardArrowRight
              sx={{ color: "primary.main", fontSize: "14px" }}
            />
          ) : (
            <ExpandLess sx={{ color: "primary.main", fontSize: "14px" }} />
          )}
        </IconButton>
        <hr className="flex-grow border-blue-500 border-opacity-20 mt-[-5px]" />
      </div>
      <Collapse in={!openSections[sectionKey]} timeout="auto" unmountOnExit>
        <div className="ag-theme-quartz">
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

            {useExcel && (
              <Button
                variant="text"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                sx={{ mt: "-13px" }}
                component="label"
                role={undefined}
              >
                Import excel
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                />
              </Button>
            )}
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
      </Collapse>
    </>
  );
};

export default BaseInputTable;
