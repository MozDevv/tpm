'use client';
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { message } from 'antd';
import {
  Add,
  Api,
  Cancel,
  CloudUpload,
  Delete,
  ExpandLess,
  KeyboardArrowRight,
  Launch,
  MoreVert,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import BaseLoadingOverlay from './BaseLoadingOverlay';
import './editabletable.css';
import { baseValidatorFn } from './BaseValidatorFn';
import { parseDate } from '@/utils/dateFormatter';
import * as XLSX from 'xlsx';
import { VisuallyHiddenInput } from '@/utils/handyComponents';
import CustomSelectCellEditor from './CustomSelectCellEditor';
import AmountCellEditor from './AmountCellEditor';
import { formatNumber } from '@/utils/numberFormatters';
import CustomPhoneNumberCellEditor from './CustomPhoneNumberCellEditor';
import preClaimsEndpoints, {
  apiService as preclaimApiService,
} from '@/components/services/preclaimsApi';

const BaseInputTable = ({
  fields = [],
  validators = {},
  title,
  cap,

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
  fetchChildren,
  filterBy,
  filterCol,
  disableAll,

  scrollableHeight,
  setCurrentRow,
  deleteApiService,
  setSeconded,
  dateOfFirstAppointment,
  isAddMoreFields,
  setTableInputData,
  setOnCloseWarnings,
  retirementDate,
  parentDob,
  scrollable,
}) => {
  const [rowData, setRowData] = useState(() => {
    const defaultRows = Array.from({ length: 2 }, () =>
      fields.reduce((acc, field) => {
        acc[field.value] = '';
        return acc;
      }, {})
    );

    return [...defaultRows, ...initialData];
  });

  const [rowErrors, setRowErrors] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [sectionKey, setSectionKey] = useState(title);
  const [retirementDateCaptured, setRetirementDateCaptured] = useState(false);

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
      ? 'date'
      : data[0]?.startDate
      ? 'startDate'
      : data[0]?.start_date
      ? 'start_date'
      : data[0]?.from_date
      ? 'from_date'
      : data[0]?.fromDate
      ? 'fromDate'
      : null;

    const sortedData = dateField
      ? data.sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]))
      : data.sort((a, b) => a.id - b.id);

    return sortedData;
  };

  const [dataAdded, setDataAdded] = useState(false);

  const [fiscalRecords, setFiscalRecords] = useState([]);

  const getPostAndNatureFiscalRecords = async () => {
    try {
      const res = await preclaimApiService.get(
        preClaimsEndpoints.getPostFiscalRecords(id)
      );
      if (res.status === 200) {
        const fiscalRecords = res.data.data.flatMap((item) => item.records); // Corrected from item.record to item.records
        console.log('Fiscal Records', fiscalRecords);

        // Optional: Sort by date
        const sortedFiscalRecords = fiscalRecords.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setFiscalRecords(sortedFiscalRecords);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    if (dataAdded) {
      try {
        const res = await getApiService(getEndpoint);
        if (res.status === 200) {
          setRowData((prevRowData) => {
            const datePairs = [
              { start: 'date', end: 'end_date' },
              { start: 'startDate', end: 'endDate' },
              { start: 'from_date', end: 'to_date' },
              { start: 'fromDate', end: 'toDate' },
              { start: 'date', end: 'endDate' },
              { start: 'date', end: 'enddate' },
              { start: 'start_date', end: 'end_date' },
              { start: 'date', end: 'date' },
            ];

            const defaultRows = Array.from({ length: 1 }, () =>
              fields.reduce((acc, field) => {
                acc[field.value] = '';
                return acc;
              }, {})
            );

            const sortedData = sortData(res.data.data);

            setOnCloseWarnings && setOnCloseWarnings(false);

            let lastEndDate = null;
            let lastStartDate = null;
            let matchingStartField = null;

            if (sortedData.length > 0) {
              const lastRow = sortedData[sortedData.length - 1];

              for (const { start, end } of datePairs) {
                const endDate = lastRow[end];
                const startDate = lastRow[start];

                if (
                  endDate &&
                  dayjs(endDate).isValid() &&
                  !endDate.includes('1901') &&
                  !endDate.includes('0001')
                ) {
                  lastEndDate = endDate;
                  matchingStartField = start;
                  break;
                }

                if (!endDate && startDate && dayjs(startDate).isValid()) {
                  lastStartDate = startDate;
                  matchingStartField = start;
                }
              }
            }

            if (matchingStartField) {
              if (lastEndDate) {
                const formattedEndDate = dayjs(lastEndDate)
                  .add(1, 'day')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]');
                defaultRows[0][matchingStartField] = formattedEndDate;
              } else if (lastStartDate) {
                const formattedStartDate = dayjs(lastStartDate)
                  .add(1, 'day')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]');
                defaultRows[0][matchingStartField] = formattedStartDate;
              }
            }

            // Check if any end_date exceeds the retirementDate or is same as
            if (retirementDate) {
              const exceedsRetirementDate = sortedData.some((row) =>
                datePairs.some(
                  ({ end }) =>
                    (row[end] &&
                      dayjs(row[end]).isAfter(dayjs(retirementDate))) ||
                    row[end] === retirementDate
                )
              );

              if (exceedsRetirementDate) {
                setRetirementDateCaptured(true);
                return sortedData;
              }
              retirementDateCaptured && setRetirementDateCaptured(false);
            }

            // Determine if we should fetch and append children
            if (fetchChildren) {
              const childrenData = res.data.data
                .map((item) => item[fetchChildren])
                .flat();

              const lastRow = childrenData[childrenData.length - 1];

              const lastMonthName = lastRow?.monthName;

              const startDate = lastRow?.startDate;

              const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ];

              if (lastRow && lastMonthName && startDate) {
                const currentMonthIndex = monthNames.indexOf(lastMonthName);
                const nextMonthDate = dayjs(startDate).add(1, 'month');

                const nextMonthName =
                  monthNames[(currentMonthIndex + 1) % monthNames.length];

                defaultRows[0].monthName = nextMonthName;
                defaultRows[0].startDate = nextMonthDate.format(
                  'YYYY-MM-DDTHH:mm:ss[Z]'
                );
              }

              // Merge sortedData with childrenData
              return [...childrenData, ...defaultRows];
            } else {
              return [...sortedData, ...defaultRows];
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await getApiService(getEndpoint);
        if (res.status === 200) {
          setRowData((prevRowData) => {
            const defaultRows = Array.from({ length: 1 }, () =>
              fields.reduce((acc, field) => {
                acc[field.value] = '';
                return acc;
              }, {})
            );

            setOnCloseWarnings && setOnCloseWarnings(false);
            const sortedData = sortData(res.data.data);

            const datePairs = [
              { start: 'date', end: 'end_date' },
              { start: 'startDate', end: 'endDate' },
              { start: 'from_date', end: 'to_date' },
              { start: 'fromDate', end: 'toDate' },
              { start: 'date', end: 'endDate' },
              { start: 'date', end: 'enddate' },
              { start: 'start_date', end: 'end_date' },
            ];

            if (retirementDate) {
              const exceedsRetirementDate = sortedData.some((row) =>
                datePairs.some(
                  ({ end }) =>
                    (row[end] &&
                      dayjs(row[end]).isAfter(dayjs(retirementDate))) ||
                    row[end] === retirementDate
                )
              );

              if (exceedsRetirementDate) {
                setRetirementDateCaptured(true);
                return sortedData;
              }
              retirementDateCaptured && setRetirementDateCaptured(false);
            }
            // Determine if we should fetch and append children
            if (fetchChildren) {
              const childrenData = res.data.data
                .map((item) => item[fetchChildren])
                .flat();

              // Merge sortedData with childrenData
              return [...childrenData, ...defaultRows];
            } else {
              return [...sortedData, ...defaultRows];
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (title === 'Post and Nature of Service') {
      getPostAndNatureFiscalRecords();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const gridApiRef = useRef(null);

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  const isRowComplete = (row) => {
    return fields.every((field) => {
      // If the field is not required, we don't need to check its value
      if (field.notRequired) {
        return true; // Skip this field since it's not required
      }

      // If the field is required, check if its value is defined, not null, and not an empty string
      return (
        row[field.value] !== undefined &&
        row[field.value] !== null &&
        row[field.value] !== ''
      );
    });
  };

  const deleteRow = async (rowId) => {
    try {
      // const res = await apiService.delete(deleteEndpoint(rowId));
      const res = deleteApiService
        ? await apiService.post(deleteEndpoint(rowId))
        : await apiService.delete(deleteEndpoint(rowId));
      if (
        res.status === 200 ||
        res.status === 204 ||
        res.data.succeeded ||
        res.data.message[0] === 'Record deleted successfully'
      ) {
        refreshData();
        message.success('Record deleted successfully');
        setRowData((prevData) => {
          return prevData.filter((row) => row.id !== rowId);
        });
      } else {
        message.error('An error occurred while deleting the record.');
      }
    } catch (error) {
      console.log(error);
      message.error('An error occurred while deleting the record.');
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

      message.success('Selected rows deleted successfully!');
    } else {
      message.error('Unable to delete rows. Grid is not ready.');
    }
  };

  const mdaId = localStorage.getItem('mdaId');

  const handleSave = async (data) => {
    const formattedFormData = { ...data };

    if (id) {
      formattedFormData[idLabel] = id;
    }
    Object.keys(formattedFormData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes('date')) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          'YYYY-MM-DDTHH:mm:ss[Z]'
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
          message.success('Record updated successfully');
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
          throw new Error('An error occurred while submitting the data.');
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.messages.length > 0
        ) {
          message.error(res.data.messages[0]);
          setCellError(data.id, null, res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await postApiService(postEndpoint, formattedFormData);

        if (res.status === 200 && res.data.succeeded) {
          refreshData();
          refetchDataFromAnotherComponent?.();
          message.success('Record added successfully');

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
          throw new Error('An error occurred while submitting the data.');
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.messages.length > 0
        ) {
          message.error(res.data.messages[0]);
          setCellError(data.id, null, res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      }
    } catch (error) {
      // Log the error and set a generic row error if needed
      setCellError(data.id, null, error.message || 'An unknown error occurred');
      // console.log(error);
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
      cellStyle: { width: '50px', borderRight: '1px solid #f0f0f0' },
    },
    ...fields.map((col, index) => {
      let columnDef = {
        headerName: col.label,
        field: col.value,
        editable: !disableAll && !col.disabled,
        sortable: true,
        headerTooltip: col.label,
        hide: col.hide,
        filter: true,
        headerClass: (params) => {
          const isError = rowErrors[params.column.getColId()];
          return isError ? 'error-header' : '';
        },
        cellRenderer: (params) => {
          const { value, data, colDef } = params;
          const field = colDef.field;
          const rowId = data.id;
          const options = col.options || [];

          const isValidDateString = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
          };

          const hasError = rowErrors[rowId] && rowErrors[rowId][field];
          const error = `
        <div>
  <strong style="display: block; margin-bottom: 8px; padding-left: 15px;">
    <span style="font-size: 1.5em;">⚠️</span> Validation Error
  </strong>
  <span style="font-weight: normal;">
    Your Entry of 
    <strong style="font-weight: bold; color: #d9534f;">
      "${value && isValidDateString(value) ? parseDate(value) : value}"
    </strong>
  </span> 
  is not an acceptable value for 
  <strong>${colDef.headerName}</strong>. 
  <br />
 <div style="color: #d9534f;">${hasError ? rowErrors[rowId][field] : ''}</div>
</div>
        `;

          const formatDate = (dateString) => {
            const date = new Date(dateString);

            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('en-GB');
            }
            return dateString;
          };
          const getNameById = (id) => {
            const selectedField = fields.find(
              (field) => field.value === colDef.field
            );

            if (!selectedField || !selectedField.options) {
              console.log(
                'No matching field or options found for:',
                colDef.field
              );
              return id;
            }

            const selectedOption = selectedField.options.find(
              (option) => option.id === id
            );

            return selectedOption ? selectedOption.name : id;
          };

          const displayValue =
            col.type === 'date'
              ? formatDate(value)
              : col.type === 'select'
              ? getNameById(value)
              : value;

          return hasError ? (
            <Tooltip
              title={<div dangerouslySetInnerHTML={{ __html: error }} />}
              arrow
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#f5f5f5', // Lighter background for better contrast
                    color: '#333', // Darker text for readability
                    fontSize: '0.875rem', // Slightly larger text for better readability
                    padding: '8px', // More spacious padding
                    borderRadius: '8px', // Rounded corners
                    maxWidth: '250px',
                    wordWrap: 'break-word', // Prevent long words from breaking the layout
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Softer shadow
                    transition: 'opacity 0.3s ease-in-out', // Smooth fade-in transition
                  },
                  '& .MuiTooltip-arrow': {
                    color: '#f5f5f5', // Matching the background color of the tooltip
                  },
                },
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {displayValue}
                {hasError && (
                  <IconButton
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'transparent', // Ensure the background is transparent
                      border: 'none', // Remove any borders
                      padding: '4px', // Add a bit of padding for easier clicking
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
                    <Cancel fontSize="small" sx={{ color: '#d9534f' }} />{' '}
                    {/* Clear button with a user-friendly color */}
                  </IconButton>
                )}
              </div>
            </Tooltip>
          ) : (
            <>
              {' '}
              <div>{displayValue}</div>
            </>
          );
        },

        cellStyle: (params) => {
          if (rowErrors[params.data.id]) {
            return {
              border: '1px solid red',
            };
          }
          return {
            fontFamily: 'Montserrat',
            borderRight: '1px solid #f0f0f0',
            fontSize: '13px',
          };
        },
      };

      if (col.type === 'date') {
        columnDef.cellEditor = 'agDateStringCellEditor';

        columnDef.valueFormatter = (params) => {
          if (!params.value) return '';

          // Using dayjs to format the date
          const formattedDate = dayjs(params.value).format('DD/MM/YYYY');
          return formattedDate === 'Invalid Date'
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
      } else if (col.type === 'phone_number') {
        columnDef.cellEditor = CustomPhoneNumberCellEditor;
      } else if (col.type === 'select' && col.options && col.options.length) {
        columnDef.cellEditor = CustomSelectCellEditor;

        columnDef.cellEditorParams = (params) => {
          const { data } = params.node; // Access the current row data
          const dynamicFilterValue = data[filterBy]; // Get dynamic filter value from row data

          // Map options to their ids and names
          const options = col.options.map((option) => option.id);
          const defaultOptions = col.options.map((option) => option.name);

          const isFilteredColumn = col.value === filterCol;

          // Filter options based on dynamicFilterValue
          if (isFilteredColumn && dynamicFilterValue) {
            const filteredOptions = col.options.filter(
              (option) => option[filterBy] === dynamicFilterValue
            );

            return {
              options: filteredOptions, // Pass filtered options to the editor
              defaultValue: params.value, // Pass the current value as default
              rowId: data.id, // Pass the row ID to the editor
            };
          }

          return {
            options: col.options, // Pass all options if not filtered
            defaultValue: params.value, // Pass the current value as default
            rowId: data.id, // Pass the row ID to the editor
          };
        };
      } else if (col.type === 'amount') {
        columnDef.cellEditor = AmountCellEditor;

        columnDef.valueFormatter = (params) => {
          if (!params.value) return '';
          return formatNumber(params.value);
        };

        columnDef.cellRenderer = (params) => {
          const { value } = params;
          return formatNumber(value);
        };
        columnDef.valueParser = (params) => {
          const parsedValue = parseFloat(params.newValue.replace(/,/g, ''));
          return isNaN(parsedValue) ? params.newValue : parsedValue;
        };
      } else if (col.hide) {
        columnDef.hide = true;
      } else if (col.value === 'phone_number') {
        const defaultPhoneNumberValue = '+254';
        columnDef.valueFormatter = (params) => {
          if (!params.value) return '';
          return params.value.startsWith('0')
            ? defaultPhoneNumberValue + params.value.slice(1)
            : params.value;
        };
      }
      const datePairs = [
        { start: 'startDate', end: 'endDate' },
        { start: 'from_date', end: 'to_date' },
        { start: 'fromDate', end: 'toDate' },
        //  { start: 'date', end: 'endDate' },
        { start: 'start_date', end: 'end_date' },
        { start: 'date', end: 'end_date' },
      ];

      const findDatePair = (field) => {
        return datePairs.find(
          (pair) => pair.start === field || pair.end === field
        );
      };

      columnDef.onCellValueChanged = async (params) => {
        const { colDef, data, newValue } = params;
        const field = colDef.field;
        const rowIndex = params.node.rowIndex; // Get the index of the row being edited

        if (field === 'dob' && parentDob && data.dob) {
          const relationshipField = fields.find(
            (f) => f.value === 'relationship_id'
          );
          if (relationshipField) {
            const selectedRelationship = relationshipField.options.find(
              (option) => option.id === data.relationship_id
            );

            if (
              selectedRelationship &&
              /son|daughter/i.test(selectedRelationship.name.toLowerCase())
            ) {
              const parentDobDate = dayjs(parentDob);
              const dobDate = dayjs(data.dob);
              const ageDifference = parentDobDate.diff(dobDate, 'years');

              if (parentDobDate.isAfter(dobDate)) {
                message.error(
                  `Date of Birth must be after the Parent's Date of Birth ${parentDobDate.format(
                    'DD/MM/YYYY'
                  )}.`
                );
                setCellError(
                  data.id,
                  'dob',
                  `Date of Birth must be after the Parent's Date of Birth <strong>${parentDobDate.format(
                    'DD/MM/YYYY'
                  )}</strong>.`
                );
                return;
              } else if (ageDifference < 10) {
                message.error(
                  `The child must be at least 10 years younger than the Parent's Date of Birth ${parentDobDate.format(
                    'DD/MM/YYYY'
                  )}.`
                );
                setCellError(
                  data.id,
                  'dob',
                  `The child must be at least 10 years younger than the Parent's Date of Birth <strong>${parentDobDate.format(
                    'DD/MM/YYYY'
                  )}</strong>.`
                );
                return;
              } else {
                handleClearError(data, 'dob');
              }
            }
          }
        }

        if (field === 'identifier' && data.identifier_type === 1) {
          //!/^[A-Za-z][K]\d+$/.test
          if (!/^[A-Za-z][K]\d+$/.test(newValue)) {
            message.error('Invalid Passport Number');
            setCellError(data.id, 'identifier', 'Invalid Passport Number');
            return;
          } else {
            handleClearError(data, 'identifier');
          }
        } else if (field === 'identifier' && data.identifier_type === 0) {
          if (
            newValue.length < 7 ||
            newValue.length > 10 ||
            !/^\d+$/.test(newValue)
          ) {
            message.error('Invalid National ID');
            setCellError(data.id, 'identifier', 'Invalid National ID');
            return;
          } else {
            handleClearError(data, 'identifier');
          }
        }

        // validate that children born at least 10 months before pensioners death cannot be declared as his/her daughters/sons
        if (field === 'dob' && retirementDate && data.dob) {
          const relationshipField = fields.find(
            (f) => f.value === 'relationship_id'
          );
          if (relationshipField) {
            const selectedRelationship = relationshipField.options.find(
              (option) => option.id === data.relationship_id
            );

            if (
              selectedRelationship &&
              /son|daughter/i.test(selectedRelationship.name.toLowerCase())
            ) {
              const retirementDateDate = dayjs(retirementDate);
              const dobDate = dayjs(data.dob);
              const monthsDifference = retirementDateDate.diff(
                dobDate,
                'months'
              );
              if (monthsDifference < 10) {
                message.error(
                  `Date of Birth must be at least 10 months before the Pensioner's Date of Death ${retirementDateDate.format(
                    'DD/MM/YYYY'
                  )}.`
                );
                setCellError(
                  data.id,
                  'dob',
                  `Date of Birth must be at least 10 months before the Pensioner's Date of Death <strong>${retirementDateDate.format(
                    'DD/MM/YYYY'
                  )}</strong>.`
                );
                return;
              } else {
                handleClearError(data, 'dob');
              }
            }
          }
        }

        //validate date of birth of Uncle/Wife/Husnand cannot be less than 18 years
        if (field === 'dob' && data.dob) {
          const relationshipField = fields.find(
            (f) => f.value === 'relationship_id'
          );
          if (relationshipField) {
            const selectedRelationship = relationshipField.options.find(
              (option) => option.id === data.relationship_id
            );

            if (
              selectedRelationship &&
              /husband|wife|uncle|aunt/i.test(
                selectedRelationship.name.toLowerCase()
              )
            ) {
              const dobDate = dayjs(data.dob);
              const today = dayjs();
              const age = today.diff(dobDate, 'years');
              if (age < 18) {
                message.error(`Date of Birth must be at least 18 years old.`);
                setCellError(
                  data.id,
                  'dob',
                  `Date of Birth must be at least 18 years old.`
                );
                return;
              } else {
                handleClearError(data, 'dob');
              }
            }
          }
        }
        if (field === 'relationship_id' && newValue) {
          const selectedField = fields.find(
            (field) => field.value === 'relationship_id'
          );
          const selectedOption = selectedField.options.find(
            (option) => option.id === newValue
          );
          if (selectedOption) {
            data.gender = selectedOption.gender;
            params.api.refreshCells({
              rowNodes: [params.node],
              columns: ['gender'],
            });
          }
        }

        // if (data.was_pensionable) {
        //   if (cap === 'CAP189') {
        //     data.nature_of_salary_scale = 'P';
        //     data.nature_of_service = 'Permanent';
        //   } else if (cap === 'CAP199') {
        //     data.nature_of_salary_scale = 'P';
        //     data.nature_of_service = 'ReckonableService';
        //   }
        // }

        if (
          dateOfFirstAppointment &&
          rowIndex === 0 &&
          field === 'date' &&
          data.date
        ) {
          const dateOfConfirmation2 = dayjs(dateOfFirstAppointment);
          const startDate = dayjs(data.date);
          if (!startDate.isSame(dateOfConfirmation2, 'day')) {
            console.error('Start date mismatch');
            message.error(
              `Start Date must match the Retiree's Date of First Appointment ${dateOfConfirmation2.format(
                'DD/MM/YYYY'
              )}.`
            );
            setCellError(
              data.id,
              'date',
              `Start Date must match the Retiree's Date of First Appointment <strong>${dateOfConfirmation2.format(
                'DD/MM/YYYY'
              )}</strong>.`
            );
            return;
          } else {
            handleClearError(data, 'date');
          }
        }

        if (setSeconded) {
          if (data.seconded) {
            console.log('Setting current row', data);
            setSeconded(data.seconded);
          } else {
            setSeconded(false);
          }
        }

        setDataAdded(true);
        // if (data.seconded) {
        //   const postField = fields.find((field) => field.value === 'post');
        //   if (postField) {
        //     postField.type = 'text';
        //   }
        // } else{
        //   const postField = fields.find((field) => field.value === 'post');
        //   if (postField) {
        //     postField.type = 'select';
        //   }
        // }
        const datePair = findDatePair(field);

        if (datePair && data[datePair.start] && data[datePair.end]) {
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
              if (field !== 'mobile_number') {
                message.error(`Validation Error on ${field}: ${error}`);
              }
              setCellError(data.id, field, error);
              return;
            } else {
              handleClearError(data, field);
            }
          }
        }
        if (field === 'account_number') {
          const cleanedValue = newValue.replace(/\D/g, '');

          const paddedValue = cleanedValue.padStart(15, '0');

          // Update the data with the cleaned and padded value
          data.account_number = paddedValue;

          // Check if the length of the cleaned value is greater than 15 (if needed)
          if (cleanedValue.length > 15) {
            message.error('Account number cannot exceed 15 digits.');
            setCellError(
              data.id,
              field,
              'Account number cannot exceed 15 digits'
            );
            return;
          } else {
            handleClearError(data, field);
          }
        }

        if (colDef.cellEditor === 'CustomSelectCellEditor') {
          const selectField = fields.find(
            (field) => field.value === colDef.field
          );

          if (selectField && selectField.options) {
            const selectedOption = selectField.options.find(
              (option) => option.name === newValue // Match by name to get the ID
            );

            // If a matching option is found, update the data with the ID
            if (selectedOption) {
              data[colDef.field] = selectedOption.id; // Store ID in data
            } else {
              data[colDef.field] = newValue; // If not found, store the input as is
            }
          }

          // Ensure that the displayed value in the cell corresponds to the name
          columnDef.valueFormatter = (params) => {
            if (!params.value) return ''; // Handle empty or undefined values
            const selectedOption = selectField.options.find(
              (option) => option.id === params.value // Match ID to find the name
            );
            return selectedOption ? selectedOption.name : params.value; // Display name or the value if not found
          };

          // Parse the displayed name back to ID when editing
          columnDef.valueParser = (params) => {
            const selectedOption = selectField.options.find(
              (option) => option.name === params.newValue // Match name to find the ID
            );
            return selectedOption ? selectedOption.id : params.newValue; // Return ID if matched, else raw input
          };

          // Ensure that the initial values (default) are correctly formatted for filtering
          columnDef.getQuickFilterText = (params) => {
            const selectedOption = selectField.options.find(
              (option) => option.id === params.value // Match ID to get the name for filtering
            );
            return selectedOption ? selectedOption.name : params.value; // Use name for filtering
          };
        }

        if (colDef.cellEditor === 'agSelectCellEditor') {
        }
        if (data.parliamentary_term_setup_id) {
          const parliamentarySelectOptions = fields.find(
            (field) => field.value === 'parliamentary_term_setup_id'
          );
          const selectedOption = parliamentarySelectOptions?.options.find(
            (option) => option.id === data.parliamentary_term_setup_id
          );

          const startYear = selectedOption?.start_year; // e.g., 2022
          const startMonth = selectedOption?.start_month; // e.g., 8

          if (startYear && startMonth) {
            // Create a valid JavaScript Date object (Month is zero-indexed, so subtract 1)
            const validDate = new Date(startYear, startMonth - 1, 1);

            // Use the machine's default date format
            const formattedDate = validDate.toLocaleDateString();

            // Store the formatted date in data for ag-Grid
            data.date = formattedDate;
          }
        }

        if (data.designationId) {
          setSelectedValue(data.designationId);
        }

        if (data.salary_amount) {
          data.contribution_amount = 0;
          data.total_emoluments = 0;
          // data.salary_amount = 0;
        }
        if (data.start_date && data.end_date) {
          data.number_of_days = dayjs(data.end_date).diff(
            dayjs(data.start_date),
            'days'
          );
        }

        if (validators[field]) {
          const error = validators[field](newValue);
          if (error) {
            message.error(`Validation Error on ${field}: ${error}`);
          }
        }

        if (isRowComplete(data)) {
          if (isAddMoreFields) {
            setTableInputData((prevData) => [...prevData, data]);
          } else {
            if (data.id) {
              await handleSave(data);
            } else {
              await handleSave(data);
            }
            await refreshData();

            message.success('Row saved successfully!');

            setRowErrors((prevErrors) => {
              const updatedErrors = { ...prevErrors };
              delete updatedErrors[data.id];
              return updatedErrors;
            });
          }
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
          'Please resolve errors in the current line before adding a new line.'
        );
        return;
      }

      const editedData = [];

      gridApiRef.current.forEachNode((node) => {
        editedData.push(node.data);
      });

      const lastRow = editedData[editedData.length - 1];
      let previousEndDate = null;

      const datePairs = [
        { start: 'startDate', end: 'endDate' },
        { start: 'from_date', end: 'to_date' },
        { start: 'fromDate', end: 'toDate' },
        { start: 'date', end: 'endDate' },
        { start: 'start_date', end: 'end_date' },
        { start: 'date', end: 'end_date' },
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
          acc[field.value] = '';
        }
        return acc;
      }, {});

      // Initialize new row errors to an empty object
      const newRowErrors = {};

      // Update row data state
      setRowData((prevRowData) => {
        if (!prevRowData) {
          console.error(
            'Previous row data is undefined. Initializing with an empty array.'
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
      message.error('Unable to add a new row. Grid is not ready.');
    }
  };

  const refreshData = async () => {
    try {
      await fetchData();
    } catch (error) {
      message.error('Error refreshing data: ' + error.message);
    }
  };
  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);

  const onCellKeyDown = (event) => {
    if (event.event.key === 'Enter') {
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
    } else {
      if (event.event.key === 'Delete') {
        console.log('Delete key pressed');
      }
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

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
    };
    reader.readAsArrayBuffer(file);
  };
  const [isFiscalYear, setIsFiscalYear] = useState(false);

  const handleToggle = () => {
    setIsFiscalYear(!isFiscalYear);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="text-primary font-montserrat text-base font-semibold mb-2">
          {title}
        </div>
        <IconButton
          sx={{ ml: '-5px', zIndex: 1, mt: '-6px' }}
          onClick={() => handleToggleSection(sectionKey)}
        >
          {!openSections[sectionKey] ? (
            <KeyboardArrowRight
              sx={{ color: 'primary.main', fontSize: '14px' }}
            />
          ) : (
            <ExpandLess sx={{ color: 'primary.main', fontSize: '14px' }} />
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
              // disabled={disableAll || retirementDateCaptured}
              startIcon={<Add />}
              style={{ marginLeft: '10px', marginBottom: '10px' }}
            >
              New Line
            </Button>
            <Button
              disabled={disableAll}
              onClick={handleDeleteSelectedRows}
              variant="text"
              startIcon={<Delete />}
              style={{ marginLeft: '10px', marginBottom: '10px' }}
            >
              Delete Lines
            </Button>

            {useExcel && (
              <Button
                variant="text"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                sx={{ mt: '-13px' }}
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
            {rowData.length > 1 && title === 'Post and Nature of Service' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '-12px',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isFiscalYear}
                      onChange={handleToggle}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#006990',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                          {
                            backgroundColor: '#006990',
                          },
                        '& .MuiSwitch-switchBase': {
                          color: '#006990',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#006990',
                        },
                      }}
                    />
                  }
                  label=""
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: '#006990',
                    ml: -2,
                  }}
                >
                  {isFiscalYear
                    ? 'View by Fiscal Year'
                    : 'View by Service Years'}
                </Typography>
              </div>
            )}
          </div>

          <div
            className=""
            style={{
              maxHeight: '500px',
              width: '100%',
              height: scrollable || isFiscalYear ? '50vh' : 'auto',
            }}
          >
            <AgGridReact
              ref={gridApiRef}
              rowData={!isFiscalYear ? rowData : fiscalRecords}
              frameworkComponents={{
                customSelectCellEditor: CustomSelectCellEditor, // Register your custom component
              }}
              animateRows={true}
              singleClickEdit={true}
              columnDefs={headers}
              defaultColDef={{
                flex: 1,
                minWidth: 150,
                height: '400px',
                minHehight: '100px',
              }}
              className={disableAll ? 'custom-grid' : ''}
              onCellKeyDown={onCellKeyDown}
              onGridReady={onGridReady}
              loadingOverlayComponent={BaseLoadingOverlay}
              loadingOverlayComponentParams={loadingOverlayComponentParams}
              domLayout={scrollable || isFiscalYear ? 'normal' : 'autoHeight'}
              rowSelection="multiple"
            />
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default BaseInputTable;
