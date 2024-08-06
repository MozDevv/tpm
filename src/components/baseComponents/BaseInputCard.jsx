import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { message } from "antd";

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
  setOpenAction,
}) => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clickedItem) {
      // Populate form data with clickedItem values directly
      setFormData(clickedItem);
    } else {
      // Reset form data if no clickedItem
      setFormData({});
    }
  }, [clickedItem]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsEditing(true);
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (
        field.required &&
        (formData[field.name] === undefined ||
          formData[field.name] === null ||
          formData[field.name] === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

        if (id && idLabel) {
          dataToSend[idLabel] = id;
        }

        if (!useRequestBody) {
          const formDataObj = new FormData();
          Object.keys(dataToSend).forEach((key) => {
            formDataObj.append(key, dataToSend[key]);
          });
          dataToSend = formDataObj;
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
          message.success("Record saved successfully");
          // setOpenBaseCard(false);
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
          <div key={index} className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              {field.label}
            </label>
            {field.type === "select" ? (
              <TextField
                select
                variant="outlined"
                size="small"
                fullWidth
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
              >
                <MenuItem value="">Select {field.label}</MenuItem>
                {field?.options?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            ) : field.type === "switch" ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData[field.name] || false}
                    onChange={handleInputChange}
                    name={field.name}
                    color="primary"
                  />
                }
                label={formData[field.name] ? "Yes" : "No"}
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
