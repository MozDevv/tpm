import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import BaseAmountInput from './BaseAmountInput'; // Assuming you have a custom input component

const AmountCellEditor = (props) => {
  const [value, setValue] = useState(props.value || ''); // Track input value

  useEffect(() => {
    setValue(props.value || ''); // Initialize with the provided value
  }, [props.value]);

  // Handle input change and update local state
  const handleAmountChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue); // Update state with new value
  };

  // Trigger the update and stop editing when input is blurred or editing ends
  const stopEditing = () => {
    if (value !== undefined) {
      props.data[props.colDef.field] = value;

      // Notify ag-Grid of the value change
      const rowNode = props.node;
      if (rowNode) {
        props.api.dispatchEvent({
          type: 'cellValueChanged',
          node: rowNode,
          data: props.data,
          colDef: props.colDef,
          newValue: value,
        });
      }
    }

    // Stop editing the cell
    props.api.stopEditing();
  };

  return (
    <TextField
      variant="outlined"
      size="small"
      type="text"
      value={value}
      onChange={handleAmountChange}
      onBlur={stopEditing} // Trigger when the input loses focus
      onKeyPress={(e) => e.key === 'Enter' && stopEditing()} // Trigger when the Enter key is pressed
      fullWidth
      inputProps={{
        style: { textAlign: 'right' }, // Align text to the right
      }}
      InputProps={{
        inputComponent: BaseAmountInput, // Custom input component (e.g., formatted number input)
      }}
      sx={{
        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
          {
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
          },
      }}
    />
  );
};

export default AmountCellEditor;
