import React, { useState, useEffect } from "react";

export default function SearchableSelectEditor(params) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    // Initialize with the default options
    setFilteredOptions(params.options);
  }, [params.options]);

  const onInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    console.log("value**************** from searchable select editor", value);

    // Filter options based on the input value
    const filtered = params.options.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const onOptionSelect = (event) => {
    const selectedValue = event.target.value;
    params.stopEditing();
    params.onSelect(selectedValue);
  };

  return (
    <div>
      <input
        type="select"
        value={inputValue}
        onChange={onInputChange}
        placeholder="Type to search..."
        style={{ width: "100%" }}
      />
      <select size={5} style={{ width: "100%" }} onChange={onOptionSelect}>
        {filteredOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
