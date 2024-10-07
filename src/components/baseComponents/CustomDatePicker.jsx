import React, { useState } from "react";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

export default function EasyDatePicker({
  field,
  formData,
  handleInputChange,
  errors,
}) {
  const [inputValue, setInputValue] = useState(formData[field.name] || "");

  const formatInputDate = (value) => {
    // Remove any non-numeric characters
    const cleanedValue = value.replace(/\D/g, "");

    // Handle short inputs
    if (cleanedValue.length === 4) {
      // MMYY format: Assume 01 for January and the year as the last two digits
      const month = cleanedValue.substring(0, 2);
      const year = `20${cleanedValue.substring(2, 4)}`; // Assumes 2000s
      return `${month}/01/${year}`; // Defaulting to the first day of the month
    } else if (cleanedValue.length === 6) {
      // MMDDYY format: Use the first two digits for month, next two for day, and last two for year
      const month = cleanedValue.substring(0, 2);
      const day = cleanedValue.substring(2, 4);
      const year = `20${cleanedValue.substring(4, 6)}`; // Assumes 2000s
      return `${month}/${day}/${year}`;
    } else if (cleanedValue.length === 8) {
      // MMDDYYYY format: full date
      return `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(
        2,
        4
      )}/${cleanedValue.substring(4, 8)}`;
    }

    return cleanedValue;
  };

  const handleDateChange = (e) => {
    // Update inputValue without formatting
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const formattedDate = formatInputDate(inputValue);

    // Convert to a proper date if the input is valid
    const date = dayjs(formattedDate, "MM/DD/YYYY", true);
    if (date.isValid()) {
      const formattedValue = date.format("MM/DD/YYYY");
      setInputValue(formattedValue);
      handleInputChange({
        target: { name: field.name, value: formattedValue },
      });
    } else {
      setInputValue(""); // Clear input on invalid date
      handleInputChange({
        target: { name: field.name, value: "" },
      });
    }
  };

  const handleKeyDown = (e) => {
    // If Enter is pressed, format the date
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <TextField
      value={inputValue}
      onChange={handleDateChange} // Update value without formatting
      onBlur={handleBlur} // Format on blur
      onKeyDown={handleKeyDown} // Format on Enter key
      placeholder="MM/DD/YYYY"
      error={!!errors[field.name]}
      helperText={errors[field.name]}
      variant="outlined"
      fullWidth
      size="small"
      inputProps={{ maxLength: 10 }}
    />
  );
}
