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
} from "@mui/material";
import { message } from "antd";
import dayjs from "dayjs";

import { useMda } from "@/context/MdaContext";

const BaseInputCard = ({
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

  useEffect(() => {
    if (clickedItem) {
      setFormData(clickedItem);
    } else {
      // Reset form data if no clickedItem
      setFormData({});
    }
  }, [clickedItem]);

  const handleInputChange = (e) => {
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

  const handleSave = async () => {
    console.log("Base Input Card: form data to be sent: ", formData);

    console.log("Base Input Card: apiEndpoint: ", apiEndpoint);
    console.log("Base Input Card: postApiFunction: ", postApiFunction);

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

          if (dayjs(value).isValid() && key.includes("date")) {
            console.log(`Formatting Date for Key: ${key}, Value: ${value}`);
            formattedFormData[key] = dayjs(value).format(
              "YYYY-MM-DDTHH:mm:ss[Z]"
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

        console.log("DATA TO SEND: ", dataToSend);

        if (id && idLabel) {
          if (isBranch) {
            dataToSend[idLabel] = id;
          } else {
            dataToSend = { ...dataToSend, prospective_pensioner_id: id.id };
          }
        }

        console.log("DATA TO SEND: ", dataToSend);

        if (!useRequestBody) {
          const formDataObj = new FormData();
          Object.keys(dataToSend).forEach((key) => {
            formDataObj.append(key, dataToSend[key]);
          });

          dataToSend = formDataObj;
        }
        if (setPostedData) {
          setPostedData(dataToSend);
        }

        const res = await postApiFunction(apiEndpoint, dataToSend);
        setIsEditing(false);

        console.log("Data  ", res.data);

        if (
          res.status === 201 ||
          res.status === 200 ||
          res.status === 204 ||
          res.data.succeeded === true
        ) {
          fetchData && fetchData();
          message.success("Record saved successfully");
          setOpenBaseCard(false);
          setOpenAction && setOpenAction(false);
          // setReFetchData(true);
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="py-6 px-15">
      {inputTitle && (
        <p className="text-base mt-[-25px] font-semibold text-primary ml-3">
          {inputTitle}
        </p>
      )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
        {fields.map((field, index) => (
          <div
            key={index}
            style={{
              flexDirection: "column",
              display: field.hide === true ? "none" : "flex",
            }}
          >
            <label className="text-xs font-semibold text-gray-600">
              {field.label}
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
              ) : (
                <TextField
                  select
                  variant="outlined"
                  size="small"
                  fullWidth
                  name={field.name}
                  disabled={field.disabled}
                  value={formData[field.name] || field.default}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                >
                  <MenuItem value="">Select {field.label}</MenuItem>
                  {field?.options?.map((option) => (
                    <MenuItem key={option?.name} value={option?.id}>
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
                  />
                }
                label={formData[field.name] ? "Yes" : "No"}
              />
            ) : field.type === "date" ? (
              <TextField
                name={field.name}
                type="date"
                variant="outlined"
                size="small"
                error={!!errors[field.name]}
                value={dayjs(formData[field.name]).format("YYYY-MM-DD")}
                helperText={errors[field.name]}
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
                    helperText={errors[field.name]}
                  />
                )}
                value={
                  field.options.find(
                    (option) => option.id === formData[field.name]
                  ) || null
                }
              />
            ) : (
              <TextField
                type={field.type}
                name={field.name}
                variant="outlined"
                size="small"
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
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

export default BaseInputCard;
