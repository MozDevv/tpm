import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomSelectCellEditor = (props) => {
  const options = props.options || [];

  // State for the selected value
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    // Set the selected value when props.value changes or when options change
    if (options.length > 0) {
      const initialValue = props.value || options[0].id; // Default to the first option if no value is provided
      setSelectedValue(initialValue);
    }
  }, [props.value, options]);

  // AG Grid calls this to get the value from the editor
  const stopEditing = () => {
    // Send the new value back to AG Grid
    props.api.stopEditing();
  };

  // Call stopEditing on change
  const handleChange = (event, newValue) => {
    const newSelectedValue = newValue ? newValue.id : "";

    // Only update if newSelectedValue is not empty
    if (newSelectedValue) {
      // Update the current row data directly
      props.data[props.colDef.field] = newSelectedValue;

      const rowNode = props.node;

      // Check if the rowNode is valid
      if (rowNode) {
        // Manually trigger the cellValueChanged event
        props.api.dispatchEvent({
          type: "cellValueChanged",
          node: rowNode,
          data: props.data,
          colDef: props.colDef,
          newValue: newSelectedValue,
        });
      } else {
        console.error("Row node not found for ID:", props.data.id);
      }
    }

    // Stop editing
    props.api.stopEditing();
  };

  // Focus event handler to set the first option as the selected value
  const handleFocus = () => {
    if (options.length > 0) {
      const firstOption = options[0].id;
      setSelectedValue(firstOption); // Set to the first option
      props.data[props.colDef.field] = firstOption; // Update data directly

      const rowNode = props.node;
      props.api.dispatchEvent({
        type: "cellValueChanged",
        node: rowNode,
        data: props.data,
        colDef: props.colDef,
        newValue: firstOption,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginTop: "3px",
        zIndex: 1000,
      }}
    >
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        value={options.find((option) => option.id === selectedValue) || null}
        onChange={handleChange} // Handle change on selection
        onFocus={handleFocus} // Handle focus to set the first option
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            style={{ height: "56px" }}
            InputProps={{
              ...params.InputProps,
              style: { padding: "4px 8px", height: "100%" },
            }}
            InputLabelProps={{
              style: { margin: "0px", padding: "0px" },
            }}
          />
        )}
        filterOptions={(options, state) => {
          return options.filter((option) =>
            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
          );
        }}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default CustomSelectCellEditor;
