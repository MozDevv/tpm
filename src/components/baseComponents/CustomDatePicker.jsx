import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function CustomDatePicker({
  field,
  formData,
  handleInputChange,
  errors,
}) {
  const handleDateChange = (date, dateString) => {
    // Convert to dd/mm/yyyy format
    const formattedDate = date ? dayjs(dateString).format("DD/MM/YYYY") : "";

    handleInputChange({
      target: { name: field.name, value: formattedDate },
    });
  };

  return (
    <DatePicker
      value={
        formData[field.name] ? dayjs(formData[field.name], "DD/MM/YYYY") : null
      }
      onChange={handleDateChange}
      allowClear
      inputReadOnly={false} // Allows typing in the input field
      style={{
        width: "100%",
        height: "32px",
        borderRadius: "4px",
        border: "1px solid #d9d9d9",
      }}
      dropdownStyle={{ padding: "0" }}
      size="small"
      status={errors[field.name] ? "error" : ""}
      placeholder="Select date"
      disabled={field.disabled} // Control the disabled state
      format="DD/MM/YYYY" // Set the date format
    />
  );
}
