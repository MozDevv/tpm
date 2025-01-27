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
} from '@mui/material';
import { Alert, message, Upload } from 'antd';
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
} from '@mui/icons-material';

const BaseInputCard = ({
  handlePreview,
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  setReFetchData,
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
}) => {
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.default !== undefined ? field.default : '';
    if (field.type === 'switch') {
      acc[field.name] = field.default !== undefined ? field.default : false;
    }
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clickedItem) {
      setFormData(clickedItem);
    } else {
      // Reset form data if no clickedItem
      setFormData({});
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

    if (name === 'bank_id') {
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

  const handleFileUpload = (file) => {
    setFormData({
      ...formData,
      file: file,
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
            formDataObj.append(key, dataToSend[key]);
          });
          if (formData.file) {
            formDataObj.append('file', formData.file);
          }

          dataToSend = formDataObj;
        }
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
          refreshData && refreshData(res.data.data.id);
          fetchData && fetchData();
          message.success('Record saved successfully');
          !refreshData && setOpenBaseCard(false);
          setOpenAction && setOpenAction(false);
          // setReFetchData(true);
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePreviewInBaseInputCard = (file) => {
    handlePreview(file);
  };

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
      {!fields.every((field) => field.disabled) && (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
        {fields.map((field, index) => (
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
                            field.options.find((option) => option.id === value)
                              ?.name
                          }
                        </span>
                      ))}
                    </div>
                  )}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      <Checkbox
                        checked={formData[field.name]?.indexOf(option.id) > -1}
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
                    field.options.find(
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
                    handleFileUpload(file); // Capture the file and store it
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
            ) : field.type === 'date' ? (
              <TextField
                name={field.name}
                type="date"
                variant="outlined"
                size="small"
                error={!!errors[field.name]}
                value={dayjs(formData[field.name]).format('YYYY-MM-DD')}
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
                  field.options.find(
                    (option) => option.id === formData[field.name]
                  ) || null
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
                  field.options.find(
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

      <Divider sx={{ my: 2 }} />
    </div>
  );
};

export default BaseInputCard;
