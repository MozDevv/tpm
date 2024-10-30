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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { message } from 'antd';
import dayjs from 'dayjs';

import { useMda } from '@/context/MdaContext';
import { formatNumber } from '@/utils/numberFormatters';
import BaseAmountInput from './BaseAmountInput';
import './autosave.css';
import { Close, Done } from '@mui/icons-material';
import { truncateMessage } from '@/utils/handyFuncs';
import MuiPhoneNumber from 'mui-phone-number';

const BaseAutoSaveInputCard = ({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  inputTitle,
  setSelectedBank,
  selectedLabel,
  setSelectedValue,
  banks,
  getApiEndpoint,
  getApiFunction,
  updateApiEndpoint,
  putApiFunction,
  transformData,
  setClickedItem,
  fieldName,
  options,
  filterKey,
  setResultFunction,
  setOpenDrilldown,
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
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  useEffect(() => {
    if (clickedItem) {
      setFormData(clickedItem);
    } else {
      // Reset form data if no clickedItem
      setFormData({});
    }
  }, [clickedItem]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const handleInputChange = (e) => {
    setUnsavedChanges(true);
    const { name, value, type, checked, multiple } = e.target;

    if (name === selectedLabel) {
      setSelectedValue(value);
    }
    if (type === 'text') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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

    // if (name === filterValue && fields && value) {
    //   const options = fields.find(
    //     (field) => field.name === filterValue
    //   ).options;
    // }

    if (name === 'bank_id' && value) {
      const filteredBranches = banks.filter(
        (branch) => branch.bankId === value
      );

      setSelectedBank(filteredBranches);
    }
    if (name === fieldName && value !== '' && options) {
      console.log('Filtering options...', options);

      const filtered = options.filter((item) => item[filterKey] === value);

      console.log('Filtered options: ', filtered);

      setResultFunction(filtered); // Set the filtered result
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
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
        if (value && !/^[A-Z]\d{9}[A-Z]$/.test(value)) {
          newErrors[field.name] = `${field.label} is not valid`;
        }
      }

      // National ID validation
      if (field.name === 'national_id' && value) {
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

  const [recordId, setRecordId] = useState(clickedItem ? clickedItem.id : null);
  const [saving, setSaving] = useState(false);

  const handleAutoSave = async () => {
    if (validateForm()) {
      setSaving(1);
      setOpenBaseCard(true);
      setUnsavedChanges(false);
      try {
        let res;
        if (recordId === null || recordId === undefined) {
          res = await postApiFunction(apiEndpoint, formData);
          if (res.data && res.data.succeeded) {
            setSaving(2);
            setRecordId(res.data.data);
            // message.success("Record created successfully");

            await getInitialData(res.data.data);
          } else if (res.data.succeeded === false && res.data.messages[0]) {
            setSaving(3);
            message.error(truncateMessage(res.data.messages[0], 100));
          } else {
            setSaving(3);
            message.error('Error saving record');
          }
        } else {
          console.log('Record ID exists, updating...');
          console.log('PUT API Endp oint: ', updateApiEndpoint);

          res = await putApiFunction(updateApiEndpoint, {
            ...formData,
            id: recordId,
          });
          if (res.data.succeeded) {
            setSaving(2);
            // message.success("Record updated successfully");
            await getInitialData(recordId);
          } else if (res.data.succeeded === false && res.data.messages[0]) {
            setSaving(3);
            message.error(truncateMessage(res.data.messages[0], 100));
          } else {
            setSaving(3);
          }
        }
      } catch (error) {
        setSaving(3);
        console.error('Error in auto-save:', error);
      } finally {
      }
    }
  };

  const getInitialData = async (id) => {
    console.log('getInitialData: id: ', id);
    console.log('getInitialData: getApiEndpoint: ', getApiEndpoint);
    console.log('getInitialData: getApiFunction: ', getApiFunction);
    try {
      const res = await getApiFunction(getApiEndpoint(id));
      if (res.status === 200) {
        const data = transformData(res.data.data);
        setClickedItem(data[0]);
        setFormData(data[0]);
        console.log('Get Initial Data Transfomred: ', formData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="py-6 px-15">
      {inputTitle && (
        <p className="text-base mt-[-25px] font-semibold text-primary ml-3">
          {inputTitle}
        </p>
      )}

      {saving === 1 ? (
        <div className="flex justify-between w-full mt-[-10px]  pr-6">
          <div className=""></div>
          <div className="flex flex-row gap-2">
            <span class="loader"></span>
            <p className="text-primary text-sm font-medium">Saving...</p>
          </div>
        </div>
      ) : saving === 2 ? (
        <div className="flex justify-between w-full mt-[-10px]  pr-6">
          <div className=""></div>
          <div className="flex flex-row gap-2 items-center">
            <Done
              sx={{
                fontSize: '20px',
                color: '#006990',
                marginRight: '-3px',
              }}
            />
            <p className="text-primary text-sm font-medium">Saved</p>
          </div>
        </div>
      ) : saving === 3 ? (
        <div className="flex justify-between w-full mt-[-10px]  pr-6">
          <div className=""></div>
          <div className="flex flex-row gap-2 items-center">
            <Close
              sx={{
                fontSize: '20px',
                color: 'crimson',
                marginRight: '-3px',
              }}
            />
            <p className="text-[crimson] text-sm font-medium">Not Saved</p>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 mt-1">
        {fields.map((field, index) => (
          <div
            key={index}
            style={{
              flexDirection: 'column',
              display: field.hide === true ? 'none' : 'flex',
            }}
          >
            <label className="text-xs font-semibold text-gray-600 flex gap-1">
              {field.label}
              {field.required && (
                <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                  *
                </div>
              )}
            </label>
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
                            {' '}
                            <p className=" text-primary font-normal text-[12px]">
                              {option.accountNo}
                            </p>
                            <Typography variant="body2" fontSize={12}>
                              {option.name}
                            </Typography>
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
                  onBlur={handleAutoSave}
                  size="small"
                  fullWidth
                  name={field.name}
                  disabled={field.disabled}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  // helperText={errors[field.name]}
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
                    name={field.name}
                    color="primary"
                    onBlur={handleAutoSave}
                  />
                }
                label={formData[field.name] ? 'Yes' : 'No'}
              />
            ) : field.type === 'date' ? (
              <TextField
                name={field.name}
                type="date"
                variant="outlined"
                onBlur={handleAutoSave}
                size="small"
                error={!!errors[field.name]}
                value={dayjs(formData[field.name]).format('YYYY-MM-DD')}
                // helperText={errors[field.name]}
                onChange={handleInputChange}
                fullWidth
              />
            ) : field.type === 'autocomplete' ? (
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
                    onBlur={handleAutoSave}
                    // helperText={errors[field.name]}
                  />
                )}
                value={
                  field.options.find(
                    (option) => option.id === formData[field.name]
                  ) || null
                }
              />
            ) : field.type === 'drillDown' ? (
              <TextField
                //   name={field.name}
                variant="outlined"
                size="small"
                type="text"
                // value={formData[field.name]}
                onBlur={handleAutoSave}
                disabled={field.disabled}
                onChange={handleAmountChange}
                error={!!errors[field.name]}
                required={field.required}
                fullWidth
                inputProps={{
                  style: { textAlign: 'right' },
                }}
                InputProps={{
                  inputComponent: BaseAmountInput,

                  endAdornment: field.disabled ? (
                    <InputAdornment
                      position="end"
                      sx={{
                        display: 'flex', // Ensure proper layout
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)', // Set background color
                        padding: '0 8px', // Add padding for better appearance
                      }}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          setOpenDrilldown(true);
                        }}
                        style={{
                          color: '#006990',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatNumber(formData[field.name])}
                      </a>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
                    {
                      border: 'none',
                      backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    },
                }}
              />
            ) : field.type === 'amount' ? (
              <TextField
                name={field.name}
                variant="outlined"
                size="small"
                type="text"
                value={formData[field.name]}
                onBlur={handleAutoSave}
                //value={formData[field.name]}
                disabled={field.disabled}
                onChange={handleAmountChange}
                error={!!errors[field.name]}
                // helperText={errors[field.name]}
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
            ) : field.type === 'phonenumber' ? (
              <MuiPhoneNumber
                defaultCountry="ke" // Kenya as the default country
                name={field.name}
                disabled={field.disabled}
                value={formData[field.name]}
                onChange={(value) =>
                  handleInputChange({
                    target: { name: field.name, value },
                  })
                }
                onBlur={handleAutoSave}
                error={!!errors[field.name]}
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
            ) : (
              <TextField
                type={field.type}
                name={field.name}
                onBlur={handleAutoSave}
                variant="outlined"
                size="small"
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                error={!!errors[field.name]}
                // helperText={errors[field.name]}
                required={field.required}
                disabled={field.disabled}
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

export default BaseAutoSaveInputCard;
