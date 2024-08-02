import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import endpoints, { apiService } from "../services/setupsApi";
import { message } from "antd";

function CreateBranch(clickedItem, setOpenAction) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const branchFields = [
    { name: "branch_code", label: "Branch Code", type: "text", required: true },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    { name: "address", label: "Address", type: "text", required: true },
  ];
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const data = { ...formData, id: clickedItem.id };
    try {
      const response = await apiService.post(endpoints.createBankBranch, data);
      if (response.status === 201) {
        message.success("Branch created successfully");
      }
    } catch (error) {
      message.error("Failed to create branch", error);
    }
  };
  return (
    <div className="p-3">
      <div className="flex flex-row justify-between px-4 w-full">
        <h2 className="text-lg font-semibold text-primary mb-3">
          Create Branch
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
        {branchFields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600">
              {field.label}
            </label>
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
          </div>
        ))}
      </div>
      <div className="w-full mr-auto">
        <div></div>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            justifyContent: "flex-end",
            mt: 3,
            px: 3,
            //width: "100%",
            ml: "auto",
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default CreateBranch;
