import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { message } from "antd";
import dayjs from "dayjs";

import { useMda } from "@/context/MdaContext";
import { formatNumber } from "@/utils/numberFormatters";
import BaseAmountInput from "./BaseAmountInput";
import "./autosave.css";
import { Done } from "@mui/icons-material";

const BaseAutoSaveInputCard = ({
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
  getApiEndpoint,
  getApiFunction,
  updateApiEndpoint,
  putApiFunction,
  transformData,
  openBaseCard,
  setClickedItem,
}) => {
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.default !== undefined ? field.default : "";
    if (field.type === "switch") {
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
    if (type === "text") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
    if (type === "number") {
      if (value === "") {
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
    if (name === "bank_id" && banks && value) {
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
      console.log("formData", formData);
    }

    if (name === "bank_id") {
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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setIsEditing(true);
    // validateForm();
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.replace(/,/g, ""),
    }));
  };

  const { mdaId } = useMda();
  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation

      if (field.name === "accountCode" && value) {
      }
      if (field.name === "accountName" && value) {
      }
      if (
        field.required &&
        (value === undefined || value === null || value === "")
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

      if ((field.type === "date" || field.name === "dob") && value) {
        if (!dayjs(value, "YYYY-MM-DD", true).isValid()) {
          newErrors[field.name] = `${field.label} is not a valid date`;
        } else {
          formData[field.name] = dayjs(value).format("YYYY-MM-DDTHH:mm:ss[Z]");
        }
      }
      // KRA PIN validation
      if (field.name === "kra_pin" && value) {
        const kraPinPattern = /^[A-Z]{1}[0-9]{9}[A-Z]{1}$/;
        if (value && !/^[A-Z]\d{9}[A-Z]$/.test(value)) {
          newErrors[field.name] = `${field.label} is not valid`;
        }
      }

      // National ID validation
      if (field.name === "national_id" && value) {
        const nationalIdPattern = /^[0-9]{8}$/; // Adjust the pattern as per your requirements
        if (value && !/^\d+$/.test(value)) {
          newErrors[field.name] = `${field.label} is not valid`;
        }
      }

      // Email validation
      if ((field.name === "email" || field.name === "email_address") && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = `${field.label} is not a valid email`;
        }
      }

      // Phone number validation
      if (field.name === "phone_number" && value) {
        const phoneNumberPattern = /^\+?[0-9]{10,13}$/; // Adjust pattern for your locale
        if (value && !/^\d+$/.test(value)) {
          newErrors[field.name] = `${field.label} is not a valid phone number`;
        }
      }

      if (field.type === "number" && value) {
        formData[field.name] = value * 1;
      }

      if (field.type === "switch" && value === undefined) {
        formData[field.name] = false;
      }

      if (field.name === "mda_id" && field.hide) {
        formData[field.name] = mdaId;
      }

      // Account number validation
      if (field.name === "account_number" && value) {
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

  const handleEdit = () => {
    setIsEditing(true);
  };

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
            setRecordId(res.data.data);
            // message.success("Record created successfully");

            await getInitialData(res.data.data);
          }
        } else {
          console.log("Record ID exists, updating...");
          console.log("PUT API Endpoint: ", updateApiEndpoint);

          res = await putApiFunction(updateApiEndpoint, {
            ...formData,
            id: recordId,
          });
          if (res.data.succeeded) {
            // message.success("Record updated successfully");
            await getInitialData(recordId);
          }
        }
      } catch (error) {
        console.error("Error in auto-save:", error);
      } finally {
        setSaving(2);
      }
    }
  };

  const getInitialData = async (id) => {
    console.log("getInitialData: id: ", id);
    console.log("getInitialData: getApiEndpoint: ", getApiEndpoint);
    console.log("getInitialData: getApiFunction: ", getApiFunction);
    try {
      const res = await getApiFunction(getApiEndpoint(id));
      if (res.status === 200) {
        const data = transformData(res.data.data);
        setClickedItem(data[0]);
        setFormData(data[0]);
        console.log("Get Initial Data Transfomred: ", formData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
                fontSize: "20px",
                color: "#006990",
                marginRight: "-3px",
              }}
            />
            <p className="text-primary text-sm font-medium">Saved</p>
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
              flexDirection: "column",
              display: field.hide === true ? "none" : "flex",
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
            {field.type === "select" ? (
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
                        value: newValue ? newValue.id : "",
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
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: selected ? "#B2E9ED" : "white",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            pr: "40px",

                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 3,
                            }}
                          >
                            {" "}
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
                      "& ul": {
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
            ) : field.type === "switch" ? (
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
                label={formData[field.name] ? "Yes" : "No"}
              />
            ) : field.type === "date" ? (
              <TextField
                name={field.name}
                type="date"
                variant="outlined"
                onBlur={handleAutoSave}
                size="small"
                error={!!errors[field.name]}
                value={dayjs(formData[field.name]).format("YYYY-MM-DD")}
                // helperText={errors[field.name]}
                onChange={handleInputChange}
                fullWidth
              />
            ) : field.type === "autocomplete" ? (
              <Autocomplete
                options={field.options}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: field.name,
                      value: newValue ? newValue.id : "",
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
            ) : field.type === "amount" ? (
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
                  style: { textAlign: "right" }, // Aligns the text to the right
                }}
                InputProps={{
                  inputComponent: BaseAmountInput,
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                    {
                      border: "none",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
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
                value={formData[field.name] || ""}
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
