import React, { useState, useEffect } from "react";

const DatePickerEditor = ({ value, onValueChange, onEditingStopped }) => {
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : "");

  // Function to parse shorthand date inputs like 22024 to 2/20/2024
  const parseDate = (input) => {
    if (/^\d{4}$/.test(input)) {
      // Format: MMYY
      return new Date(`20${input.slice(2)}`, input.slice(0, 2) - 1);
    } else if (/^\d{5,6}$/.test(input)) {
      // Format: MMDDYY or MMDDYYYY
      const month = parseInt(input.slice(0, 2), 10) - 1;
      const day = parseInt(input.slice(2, 4), 10);
      const year = input.length === 5 ? `20${input.slice(4)}` : input.slice(4);
      return new Date(year, month, day);
    }
    return new Date(input); // fallback
  };

  // Format date into MM/DD/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const handleBlur = () => {
    const parsedDate = parseDate(inputValue);
    if (!isNaN(parsedDate)) {
      onValueChange(parsedDate.toISOString());
      setInputValue(formatDate(parsedDate));
    }
    onEditingStopped();
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => e.key === "Enter" && handleBlur()}
    />
  );
};

export default DatePickerEditor;
