import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  Checkbox,
  ListItemText,
  Autocomplete,
  Box,
  Typography,
  ListItem,
  Popper,
  Dialog,
  IconButton,
} from '@mui/material';
import { Alert, message, Table, Upload } from 'antd';
import dayjs from 'dayjs';
import { Button as AntButton } from 'antd';

import { useMda } from '@/context/MdaContext';
import { formatNumber } from '@/utils/numberFormatters';
import BaseAmountInput from './BaseAmountInput';
import { truncateMessage } from '@/utils/handyFuncs';
import CustomDatePicker from './CustomDatePicker';
import {
  UploadFileOutlined,
  UploadOutlined,
  Upload as MuiUpload,
  Launch,
  Add,
  Delete,
  Close,
} from '@mui/icons-material';
import MuiPhoneNumber from 'mui-phone-number';
import financeEndpoints, { apiService } from '../services/financeApi';
import {
  useAutopopulateNameStore,
  useFilteredDataStore,
} from '@/zustand/store';
import { BASE_CORE_API } from '@/utils/constants';
import { baseInputValidator } from './BaseInputValidator';
import BaseCollapse from './BaseCollapse';
import BaseEdmsViewer from './BaseEdmsViewer';

const BaseInputCard = ({
  handlePreview,
  fields,
  apiEndpoint,
  setImportOpen,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  inputTitle,
  id,
  idLabel,
  setSelectedBank,
  setOpenAction,
  isBranch,
  selectedLabel,
  setSelectedValue,
  fetchData,
  setPostedData,
  banks,
  refreshData,
  setInputData,
  disableAll,
  tableInputData,
  tableInputObjectKey,
  isAddMoreFields,
  setCloseProp,
  setClickedItem,
  setReFetchData,
  openBaseCard,
  isImported,
}) => {
  const initialFormData = fields.reduce((acc, field) => {
    if (field.name === 'suspensionDate') {
      // Set the suspensionDate to the last day of the current month
      acc[field.name] = dayjs().endOf('month').format('YYYY-MM-DD');
    } else if (field.name === 'uploadDate') {
      // Set the uploadDate to the current date
      acc[field.name] = dayjs().format('YYYY-MM-DD'); // Format as needed
    } else {
      acc[field.name] = field.default !== undefined ? field.default : '';
      if (field.type === 'switch') {
        acc[field.name] = field.default !== undefined ? field.default : false;
      }
    }
    return acc;
  }, {});

  const [formData, setFormData] = useState({ ...initialFormData });

  useEffect(() => {
    console.log("Base Input Card: formData', formData,", formData);
    console.log('Form Data type: ', formData.suspensionDate);
  }, [formData]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!openBaseCard) {
      setImportOpen && setImportOpen(false);
    }
  }, [openBaseCard]);

  useEffect(() => {
    if (clickedItem) {
      setFormData((prev) => ({
        ...prev,
        ...clickedItem,
      }));
    } else {
      // Reset form data if no clickedItem
      setFormData(initialFormData);
    }
  }, [clickedItem]);

  useEffect(() => {
    if (setInputData) {
      setInputData(clickedItem);
    }
  }, [clickedItem]);

  useEffect(() => {
    if (formData.pensionAwardId) {
      setFormData((prev) => ({
        ...prev,
        pensionCap: formData.pensionAwardId,
      }));
    }
  }, [formData.pensionAwardId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, multiple } = e.target;

    setInputData &&
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));

    if (name === selectedLabel) {
      setSelectedValue(value);
    }
    if (type === 'text') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
    if (type === 'number') {
      if (value === '') {
        setFormData((prev) => ({
          ...prev,
          [name]: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value * 1,
        }));
      }
    }

    ///if AccountingPeriodId is selected, set the accounting period start and end date

    if (name === 'accountingPeriodId' && value) {
      const selectedAccountingPeriod = fields
        .find((field) => field.name === 'accountingPeriodId')
        .options.find((option) => option.id === value);

      if (selectedAccountingPeriod) {
        setFormData((prev) => ({
          ...prev,
          startDate: selectedAccountingPeriod.startDate,
          endDate: selectedAccountingPeriod.endDate,
        }));
      }
    }

    if (name === 'receiptTypeId' && value) {
      const selectedReceiptType = fields
        .find((field) => field.name === 'receiptTypeId')
        .options.find((option) => option.id === value);

      if (selectedReceiptType) {
        setFormData((prev) => ({
          ...prev,
          chartOfAccountId: selectedReceiptType.accountId,
        }));
      }
    }

    // Assuming 'banks' is your data array and 'branch_id' is the id of the branch you're filtering by
    if (name === 'bank_id' && banks && value) {
      // Find the bank that has a branch matching the given branch_id
      const bankWithBranch = banks.find(
        (bank) => bank.branches.some((branch) => branch.id === value) // assuming 'value' is the branch_id
      );

      if (bankWithBranch) {
        setSelectedBank(bankWithBranch.bank_id); // Set the selected bank's ID
        setFormData((prev) => ({
          ...prev,
          bank_id: bankWithBranch.bank_id, // Update the form with the filtered bank's ID
        }));
      } else {
        // Handle the case where no matching bank is found
        setSelectedBank(null);
        setFormData((prev) => ({
          ...prev,
          bank_id: null,
        }));
      }
      console.log('formData', formData);
    }

    if (name === 'bank_id' || name === 'bankId') {
      setSelectedBank(value);
    }

    if (multiple) {
      const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    const field = fields.find((f) => f.name === name);
    if (field) {
      const fieldErrors = baseInputValidator(field, value, formData);

      setErrors((prev) => {
        const updatedErrors = { ...prev, ...fieldErrors };

        // Remove the error for the current field if validation passes
        if (!fieldErrors[field.name]) {
          delete updatedErrors[field.name];
        }

        return updatedErrors;
      });
    }
    setIsEditing(true);
    // validateForm();
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.replace(/,/g, ''),
    }));
  };

  const handleFileUpload = (file, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: file,
    });
  };

  const { mdaId } = useMda();

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation

      if (field.name === 'accountCode' && value) {
      }
      if (field.name === 'accountName' && value) {
      }

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }

      // Date validation
      // if (field.type === "date" && value) {
      //   if (!dayjs(value, "YYYY-MM-DD", true).isValid()) {
      //     newErrors[field.name] = `${field.label} is not a valid date`;
      //   } else {
      //     formData[field.name] = dayjs(value).toISOString();
      //   }
      // }

      if ((field.type === 'date' || field.name === 'dob') && value) {
        if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
          newErrors[field.name] = `${field.label} is not a valid date`;
        } else {
          formData[field.name] = dayjs(value).format('YYYY-MM-DDTHH:mm:ss[Z]');
        }
      }
      // KRA PIN validation
      if (field.name === 'kra_pin' && value) {
        const kraPinPattern = /^[A-Z]{1}[0-9]{9}[A-Z]{1}$/;
        if (value && !/^[A-Z]\d{9}[A-Z]$/.test(value)) {
          newErrors[field.name] = `${field.label} is not valid`;
        }
      }

      // National ID validation
      if (field.name === 'national_id' && value) {
        const nationalIdPattern = /^[0-9]{8}$/; // Adjust the pattern as per your requirements
        if (value && !/^\d+$/.test(value)) {
          newErrors[field.name] = `${field.label} is not valid`;
        }
      }

      // Email validation
      if ((field.name === 'email' || field.name === 'email_address') && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = `${field.label} is not a valid email`;
        }
      }

      // Phone number validation
      if (field.name === 'phone_number' && value) {
        const phoneNumberPattern = /^\+?[0-9]{10,13}$/; // Adjust pattern for your locale
        if (value && !/^\d+$/.test(value)) {
          newErrors[field.name] = `${field.label} is not a valid phone number`;
        }
      }

      if (field.type === 'number' && value) {
        formData[field.name] = value * 1;
      }

      if (field.type === 'switch' && value === undefined) {
        formData[field.name] = false;
      }

      if (field.name === 'mda_id' && field.hide) {
        formData[field.name] = mdaId;
      }

      // Account number validation
      if (field.name === 'account_number' && value) {
        const accountNumberPattern = /^[0-9]{10,20}$/; // Adjust pattern for account number format
        if (!accountNumberPattern.test(value)) {
          newErrors[
            field.name
          ] = `${field.label} is not a valid account number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (formData.total_emoluments) {
      setFormData((prev) => ({
        ...prev,
        contribution_amount: (prev.total_emoluments * 0.02).toFixed(2),
      }));
    }
  }, [formData.total_emoluments]);

  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    console.log('Base Input Card: form data to be sent: ', formData);

    console.log('Base Input Card: apiEndpoint: ', apiEndpoint);
    console.log('Base Input Card: postApiFunction: ', postApiFunction);

    if (validateForm()) {
      try {
        let dataToSend = {};

        // Filter out null or undefined values
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            dataToSend[key] = formData[key];
          }
        });
        if (isAddMoreFields) {
          if (tableInputData && tableInputObjectKey) {
            dataToSend[tableInputObjectKey] = tableInputData;
          } else if (
            tableInputData &&
            tableInputData.length > 0 &&
            !tableInputObjectKey
          ) {
            dataToSend = { ...dataToSend, ...tableInputData[0] };
          } else {
            dataToSend = { ...dataToSend };
          }
        }

        const formattedFormData = { ...dataToSend };
        Object.keys(formattedFormData).forEach((key) => {
          const value = formattedFormData[key];

          if (dayjs(value).isValid() && key.includes('date')) {
            console.log(`Formatting Date for Key: ${key}, Value: ${value}`);
            formattedFormData[key] = dayjs(value).format(
              'YYYY-MM-DDTHH:mm:ss[Z]'
            );
            console.log(`Formatted Date: ${formattedFormData[key]}`);
          }
        });

        dataToSend = formattedFormData;

        // if (dataToSend.accountName) {
        //   dataToSend.glAccountName = dataToSend.accountName;
        //   delete dataToSend.accountName;
        // }

        // if (dataToSend.accountNo) {
        //   dataToSend.glAccountNo = dataToSend.accountNo;
        //   delete dataToSend.accountNo;
        // }

        console.log('DATA TO SEND: ', dataToSend);

        if (id && idLabel) {
          if (isBranch) {
            dataToSend[idLabel] = id;
          } else {
            dataToSend = { ...dataToSend, prospective_pensioner_id: id.id };
          }
        }

        console.log('DATA TO SEND: ', dataToSend);
        if (!useRequestBody) {
          const formDataObj = new FormData();

          Object.keys(dataToSend).forEach((key) => {
            const value = dataToSend[key];

            // Handle attachments array separately
            if (key === 'attachments' && Array.isArray(value)) {
              value.forEach((attachment, index) => {
                if (attachment.file && attachment.name) {
                  console.log("'Attachment: ', attachment);", attachment);
                  formDataObj.append(
                    `attachments[${index}].Name`,
                    attachment.name
                  );
                  formDataObj.append(
                    `attachments[${index}].File`,
                    attachment.file
                  );
                }
              });
            } else {
              // Append all other primitive fields
              formDataObj.append(key, value);
            }
          });

          dataToSend = formDataObj;
        }

        console.log('FormData to be sent: ', dataToSend);
        if (setPostedData) {
          setPostedData(dataToSend);
        }

        const res = await postApiFunction(apiEndpoint, dataToSend);
        setIsEditing(false);

        console.log('Data  ', res.data);

        if (
          res.data.succeeded === false &&
          res.data.messages &&
          res.data.messages.length > 0
        ) {
          setSaveError(res.data.messages[0]);
          message.error(res.data.messages[0]);
          return;
        } else if (
          res.status === 201 ||
          res.status === 200 ||
          res.status === 204 ||
          res.data.succeeded === true
        ) {
          setClickedItem &&
            setClickedItem({ ...formattedFormData, id: res.data.data });

          refreshData && refreshData(res.data.data.id);
          setReFetchData && setReFetchData((prev) => prev + 1);
          fetchData && fetchData();
          setCloseProp && setCloseProp(false);
          message.success('Record saved successfully');
          !refreshData && setOpenBaseCard(false);
          setOpenAction && setOpenAction(false);
          // setReFetchData(true);
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } else {
      message.error('Please fill in all required fields');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePreviewInBaseInputCard = (file) => {
    handlePreview(file);
  };
  const { setFilteredData } = useFilteredDataStore();

  const handleOnBlur = async (name) => {
    try {
      const res = await apiService.get(financeEndpoints.getReceiptsByNo(name));
      if (res.status === 200) {
        const receipt = res.data.data[0];
        const data = {
          returnDate: receipt?.recieptDate,
          totalAmount: receipt?.totalAmount,
          bankId: receipt?.receiptLines[0]?.bankId,
          bankBranchId: receipt?.receiptLines[0]?.bankBranchId,
          receiptTypeId: receipt?.receiptLines[0]?.receiptTypeId,
          paymentMethodId: receipt?.receiptLines[0]?.paymentMethodId,
          eftNo: receipt?.receiptLines[0]?.chequeOrEftNo,
          crAccountId: receipt?.receiptLines[0]?.crAccountId,
          drAccountId: receipt?.receiptLines[0]?.drAccountId,
        };
        setFormData((prev) => {
          return {
            ...prev,
            ...data,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]); // Tracks selected rows for deletion
  const [previewContent, setPreviewContent] = useState(null); // Content for the preview modal
  const [previewOpen, setPreviewOpen] = useState(false); // Controls the preview modal visibility

  return (
    <div className="py-6 px-15">
      {inputTitle && (
        <p className="text-base mt-[-25px] font-semibold text-primary ml-3">
          {inputTitle}
        </p>
      )}

      {saveError && (
        <div className="w-full mb-2">
          <Alert
            message={truncateMessage(saveError, 70)}
            type="error"
            showIcon
            closable
          />
        </div>
      )}
      {formData.lockoutEnabled && (
        <div className="mb-4">
          <Alert
            message="User Account is locked"
            type="warning"
            showIcon
            closable
          />
        </div>
      )}
      {!disableAll && (
        <>
          {' '}
          {(!fields.every((field) => field.disabled) || disableAll) && (
            <div className="flex justify-end gap-2 mr-5">
              {!isEditing && clickedItem ? (
                <Button variant="contained" onClick={handleEdit}>
                  Edit
                </Button>
              ) : (
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
        {fields
          .sort((a, b) =>
            a.type === 'textarea' ? 1 : b.type === 'textarea' ? -1 : 0
          )
          .map((field, index) => (
            <div
              key={index}
              style={{
                flexDirection: 'column',
                display: field.hide === true ? 'none' : 'flex',
              }}
            >
              {field.type === 'file' && field.fileName ? (
                <>
                  <label className="text-xs font-semibold text-gray-600 mb-2">
                    {field.label}
                  </label>
                </>
              ) : field.type === 'attachments' ? (
                <></>
              ) : (
                <label className="text-xs font-semibold text-gray-600">
                  {field.label}
                </label>
              )}
              {field.type === 'select' ? (
                field.multiple ? (
                  <Select
                    multiple
                    size="small"
                    name={field.name}
                    value={formData[field.name] || []}
                    onChange={handleInputChange}
                    renderValue={(selected) => (
                      <div>
                        {selected.map((value) => (
                          <span key={value} style={{ margin: 2 }}>
                            {
                              field?.options?.find(
                                (option) => option.id === value
                              )?.name
                            }
                          </span>
                        ))}
                      </div>
                    )}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <Checkbox
                          checked={
                            formData[field.name]?.indexOf(option.id) > -1
                          }
                        />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                ) : field.table ? (
                  <Autocomplete
                    options={field.options}
                    getOptionLabel={(option) =>
                      field.searchByAccountNo ? option.accountNo : option.name
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: field.name,
                          value: newValue ? newValue.id : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        fullWidth
                        name={field.name}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                      />
                    )}
                    value={
                      field?.options?.find(
                        (option) => option.id === formData[field.name]
                      ) || null
                    }
                    renderOption={(props, option, { selected }) => (
                      <div className="">
                        <li
                          {...props}
                          style={{
                            border: 'none',
                            boxShadow: 'none',
                            backgroundColor: selected ? '#B2E9ED' : 'white',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              pr: '40px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 3,
                              }}
                            >
                              <p
                                className="text-primary font-normal text-[12px] items-start"
                                style={{ alignSelf: 'flex-start' }}
                              >
                                {option.name}
                              </p>
                              <p
                                className="text-[12px] items-center"
                                style={{ alignSelf: 'flex-center' }}
                              >
                                {option.accountNo}
                              </p>
                            </Box>
                          </Box>
                        </li>
                      </div>
                    )}
                    ListboxProps={{
                      sx: {
                        padding: 0,
                        '& ul': {
                          padding: 0,
                          margin: 0,
                        },
                        // Additional styling for the listbox
                      },
                    }}
                    PopperComponent={(props) => (
                      <Popper {...props}>
                        {/* Header */}
                        <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
                          <p className="text-xs font-normal">No.</p>
                          <p className="text-xs font-normal">Name</p>
                        </li>
                        {props.children}
                      </Popper>
                    )}
                  />
                ) : (
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    fullWidth
                    name={field.name}
                    disabled={field.disabled || disableAll}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  >
                    <MenuItem value="">Select {field.label}</MenuItem>
                    {field?.options?.map((option) => (
                      <MenuItem key={option?.id} value={option?.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              ) : field.type === 'searchInput' ? (
                <TextField
                  type="text"
                  name={field.name}
                  variant="outlined"
                  size="small"
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  disabled={field.disabled || disableAll}
                  fullWidth
                  onBlur={async () => {
                    if (field.name !== 'searchInput') {
                      return;
                    }
                    if (!formData.searchInput) {
                      setErrors({ searchInput: 'Search input is required' });
                      return;
                    }

                    // Manually construct the query string
                    const queryString = `search_input=${
                      formData.searchInput
                    }&claim_id=${
                      formData.searchType === 'claim_id'
                    }&national_id=${
                      formData.searchType === 'national_id'
                    }&personal_number=${
                      formData.searchType === 'personal_number'
                    }`;

                    try {
                      const response = await apiService.get(
                        `${BASE_CORE_API}api/claims/SearchClaims?${queryString}&paging.pageSize=100000`
                      );
                      if (response.status === 200) {
                        if (response.data.data.length === 0) {
                          message.error('No results found');
                          return;
                        }
                        setFilteredData(response.data.data || []);
                        message.success('Search completed successfully');
                      } else {
                        message.error('No results found');
                      }
                    } catch (error) {
                      console.error(error);
                      message.error('An error occurred while searching');
                    }
                  }}
                />
              ) : field.type === 'radio' ? (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData[field.name] === true}
                      onChange={handleInputChange}
                      disabled={field.disabled || disableAll}
                      name={field.name}
                      color="primary"
                    />
                  }
                  label={
                    formData[field.name] ? field.switchTrue : field.switchFalse
                  }
                />
              ) : field.type === 'switch' ? (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData[field.name] === true}
                      onChange={handleInputChange}
                      disabled={field.disabled || disableAll}
                      name={field.name}
                      color="primary"
                    />
                  }
                  label={formData[field.name] ? 'Yes' : 'No'}
                />
              ) : field.type === 'file' && field.fileName ? (
                <div className="flex justify-between ">
                  <Upload
                    beforeUpload={(file) => {
                      handleFileUpload(file, field.name); // Capture the file and store it
                      handlePreview && handlePreview(file);
                      return false; // Prevent the auto-upload, we'll handle it manually
                    }}
                  >
                    <AntButton
                      icon={
                        <MuiUpload
                          sx={{
                            fontSize: '20px',
                          }}
                        />
                      }
                    >
                      Click to Upload
                    </AntButton>
                  </Upload>
                  {formData[field.name] && handlePreview && (
                    <div className="mb-4">
                      <AntButton
                        onClick={() =>
                          handlePreviewInBaseInputCard(formData[field.name])
                        }
                        type="primary"
                        style={{
                          backgroundColor: '#006990',
                          borderColor: '#006990',
                        }}
                        icon={
                          <Launch
                            sx={{
                              fontSize: '20px',
                            }}
                          />
                        }
                      >
                        Preview File
                      </AntButton>
                    </div>
                  )}
                </div>
              ) : field.type === 'phone_number' ? (
                <MuiPhoneNumber
                  defaultCountry="ke" // Kenya as the default countr
                  name={field.name}
                  variant="outlined"
                  size="small"
                  error={!!errors[field.name]}
                  value={formData[field.name] || ''}
                  defaultValue={''}
                  helperText={errors[field.name]}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: field.name, value: e },
                    })
                  }
                  disabled={field.disabled || disableAll}
                  dropdownClass="custom-dropdown" // Custom class for the dropdown
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '120px', // Set max height for the dropdown
                        overflowY: 'auto',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                />
              ) : field.type === 'phone_number' ? (
                <MuiPhoneNumber
                  defaultCountry="ke" // Kenya as the default country
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: field.name,
                        value,
                      },
                    })
                  }
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  disabled={field.disabled || disableAll}
                  variant="outlined"
                  size="small"
                  fullWidth
                  dropdownClass="custom-dropdown" // Custom class for the dropdown
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '120px', // Set max height for the dropdown
                        overflowY: 'auto',
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                />
              ) : field.type === 'datetime' ? (
                <TextField
                  name={field.name}
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  error={!!errors[field.name]}
                  value={
                    formData[field.name]
                      ? dayjs(formData[field.name]).format('YYYY-MM-DDTHH:mm')
                      : ''
                  }
                  defaultValue={''}
                  helperText={errors[field.name]}
                  onChange={handleInputChange}
                  disabled={field.disabled || disableAll}
                  fullWidth
                />
              ) : field.type === 'date' ? (
                <TextField
                  name={field.name}
                  type="date"
                  variant="outlined"
                  size="small"
                  error={!!errors[field.name]}
                  value={
                    formData[field.name]
                      ? dayjs(formData[field.name]).format('YYYY-MM-DD')
                      : ''
                  }
                  defaultValue={''}
                  helperText={errors[field.name]}
                  onChange={handleInputChange}
                  disabled={field.disabled || disableAll}
                  fullWidth
                />
              ) : // <CustomDatePicker
              //   field={field}
              //   formData={formData}
              //   handleInputChange={handleInputChange}
              //   errors={errors}
              //
              field.type === 'autocomplete' ? (
                <Autocomplete
                  disabled={field.disabled || disableAll}
                  options={field.options}
                  getOptionLabel={(option) => option?.name?.toString()}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: field.name,
                        value: newValue ? newValue.id : '',
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      name={field.name}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      onBlur={(event) => {
                        if (
                          field.name === 'receiptNo' ||
                          field.name === 'recieptNo'
                        ) {
                          handleOnBlur(params.inputProps.value);
                        }
                      }}
                    />
                  )}
                  value={
                    (field.options &&
                      field?.options?.find(
                        (option) => option.id === formData[field.name]
                      )) ||
                    null
                  }
                />
              ) : field.type === 'amount' ? (
                <TextField
                  name={field.name}
                  variant="outlined"
                  size="small"
                  type="text"
                  value={formData[field.name]}
                  //value={formData[field.name]}
                  disabled={field.disabled || disableAll}
                  onChange={handleAmountChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  fullWidth
                  inputProps={{
                    style: { textAlign: 'right' }, // Aligns the text to the right
                  }}
                  InputProps={{
                    inputComponent: BaseAmountInput,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                      {
                        border: 'none',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                      },
                  }}
                />
              ) : field.type === 'table' ? (
                <Autocomplete
                  options={field.options}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: field.name,
                        value: newValue ? newValue.id : '',
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      name={field.name}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                    />
                  )}
                  value={
                    field?.options?.find(
                      (option) => option.id === formData[field.name]
                    ) || null
                  }
                  renderOption={(props, option, { selected }) => (
                    <div className="">
                      <li
                        {...props}
                        style={{
                          border: 'none',
                          boxShadow: 'none',
                          backgroundColor: selected ? '#B2E9ED' : 'white',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            pr: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                              '&:hover': {
                                backgroundColor: '#e0f7fa',
                              },
                            }}
                          >
                            <p
                              className="text-primary font-normal text-[12px] leading-5"
                              style={{ margin: 0 }}
                            >
                              {option.row1}
                            </p>
                            <p
                              className="text-[12px] text-gray-700"
                              style={{ margin: 0 }}
                            >
                              {option.row2}
                            </p>
                          </Box>
                        </Box>
                      </li>
                    </div>
                  )}
                  ListboxProps={{
                    sx: {
                      padding: 0,
                      '& ul': {
                        padding: 0,
                        margin: 0,
                      },
                      // Additional styling for the listbox
                    },
                  }}
                  PopperComponent={(props) => (
                    <Popper {...props}>
                      {/* Header */}
                      <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
                        <p className="text-xs font-normal">{field.row1}</p>
                        <p className="text-xs font-normal">{field.row2}</p>
                      </li>

                      {props.children}
                    </Popper>
                  )}
                />
              ) : field.type === 'attachments' ? (
                <></>
              ) : field.type === 'textarea' ? (
                <TextField
                  name={field.name}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={4} // Adjust the number of rows as needed
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  disabled={field.disabled || disableAll}
                  fullWidth
                />
              ) : (
                <TextField
                  type={field.type}
                  name={field.name}
                  variant="outlined"
                  size="small"
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  disabled={field.disabled || disableAll}
                  fullWidth
                />
              )}
            </div>
          ))}
      </div>
      {previewOpen && (
        <BaseEdmsViewer
          doc={previewContent}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      <Divider sx={{ my: 2 }} />

      <div className="px-2">
        {fields.map((field, index) =>
          field.type === 'attachments' ? (
            <BaseCollapse name="Attachments">
              <div className="px-5" key={index}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <Button
                    onClick={() => {
                      const newAttachment = {
                        name: `File ${formData.attachments?.length + 1 || 1}`,
                        description: '',
                        file: null,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        attachments: [
                          ...(prev.attachments || []),
                          newAttachment,
                        ],
                      }));
                    }}
                    variant="text"
                    startIcon={<Add />}
                    style={{ marginRight: '20px' }}
                  >
                    New Document
                  </Button>
                  <Button
                    onClick={() => {
                      const updatedAttachments = formData.attachments.filter(
                        (_, index) => !selectedRows.includes(index)
                      );
                      setFormData((prev) => ({
                        ...prev,
                        attachments: updatedAttachments,
                      }));
                      setSelectedRows([]);
                    }}
                    variant="text"
                    startIcon={<Delete />}
                  >
                    Delete Document
                  </Button>
                </div>

                {/* Attachments Table */}
                <Table
                  columns={
                    clickedItem?.attachments?.length > 0
                      ? [
                          {
                            title: 'File Name',
                            dataIndex: 'fileName',
                            key: 'fileName',
                            width: '50%',
                            render: (text) => <span>{text}</span>, // Display the file name
                          },
                          {
                            title: 'Preview',
                            key: 'preview',
                            width: '50%',
                            render: (_, record) => (
                              <Button
                                style={{
                                  backgroundColor: '#006990',
                                  color: 'white',
                                  border: 'none',
                                  padding: '2px 10px',
                                }}
                                startIcon={
                                  <Launch
                                    sx={{
                                      fontSize: '14px',
                                    }}
                                  />
                                }
                                onClick={() => {
                                  // Pass the edmsFileId to the ViewerPage component
                                  setPreviewContent(record);
                                  setPreviewOpen(true);
                                }}
                              >
                                Preview
                              </Button>
                            ),
                          },
                        ]
                      : [
                          {
                            title: 'File Name',
                            dataIndex: 'name',
                            key: 'name',
                            width: '30%',
                            render: (text, record, index) => (
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={record.name}
                                onChange={(e) => {
                                  const updatedAttachments = [
                                    ...formData.attachments,
                                  ];
                                  updatedAttachments[index].name =
                                    e.target.value; // Update the name
                                  setFormData((prev) => ({
                                    ...prev,
                                    attachments: updatedAttachments,
                                  }));
                                }}
                              />
                            ),
                          },
                          {
                            title: 'Upload',
                            key: 'upload',
                            width: '30%',
                            render: (_, record, index) => (
                              <Upload
                                name={record.name}
                                onChange={(info) => {
                                  const updatedAttachments = [
                                    ...formData.attachments,
                                  ];
                                  updatedAttachments[index].file =
                                    info.file.originFileObj;
                                  setFormData((prev) => ({
                                    ...prev,
                                    attachments: updatedAttachments,
                                  }));
                                }}
                                fileList={[]}
                                // fileList={record.file ? [record.file] : []}
                                beforeUpload={(file) => {
                                  const isLt2MB = file.size / 1024 / 1024 < 2;
                                  if (!isLt2MB) {
                                    message.error(
                                      `${file.name} is larger than 2MB. Please upload a smaller file.`
                                    );
                                  }
                                  return isLt2MB;
                                }}
                              >
                                <Button startIcon={<UploadOutlined />}>
                                  Upload
                                </Button>
                              </Upload>
                            ),
                          },
                          {
                            title: 'File(s)',
                            key: 'files',
                            width: '30%',
                            render: (_, record) =>
                              record.file ? (
                                <span>{record.file.name}</span> // Display the uploaded file name
                              ) : (
                                <span style={{ color: 'gray' }}>
                                  No file uploaded
                                </span> // Placeholder if no file is uploaded
                              ),
                          },

                          {
                            title: 'Preview',
                            key: 'preview',
                            width: '30%',
                            render: (_, record) => {
                              const file = record.file;
                              return file ? (
                                <Button
                                  style={{
                                    backgroundColor: '#006990',
                                    color: 'white',
                                    border: 'none',
                                    padding: '2px 10px',
                                  }}
                                  startIcon={
                                    <Launch
                                      sx={{
                                        fontSize: '14px',
                                      }}
                                    />
                                  }
                                  onClick={() => {
                                    const file =
                                      record.file?.originFileObj || record.file;
                                    if (!file) {
                                      message.error(
                                        'No file available for preview.'
                                      );
                                      return;
                                    }

                                    setPreviewContent(
                                      <embed
                                        src={URL.createObjectURL(file)}
                                        type="application/pdf"
                                        width="100%"
                                        height="1000px"
                                      />
                                    );
                                    setPreviewOpen(true);
                                  }}
                                >
                                  Preview
                                </Button>
                              ) : (
                                <Button disabled>Preview</Button>
                              );
                            },
                          },
                        ]
                  }
                  dataSource={formData.attachments}
                  pagination={false}
                  rowKey={(record, index) => index}
                  rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys) => {
                      setSelectedRows(selectedRowKeys);
                    },
                  }}
                  className="antcustom-table"
                />
              </div>
            </BaseCollapse>
          ) : null
        )}
      </div>
    </div>
  );
};

export default BaseInputCard;
