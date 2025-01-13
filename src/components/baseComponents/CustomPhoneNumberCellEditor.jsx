import React, { useState } from 'react';
import MuiPhoneNumber from 'mui-phone-number';

const CustomPhoneNumberCellEditor = (props) => {
  const { value, api, node, column } = props;
  const [phoneNumber, setPhoneNumber] = useState(value);

  const handleChange = (newValue) => {
    setPhoneNumber(newValue);
    node.setDataValue(column.colId, newValue);
  };

  return (
    <MuiPhoneNumber
      defaultCountry="ke" // Kenya as the default country
      name="phoneNumber"
      value={phoneNumber}
      onChange={handleChange}
      variant="outlined"
      size="medium" // Adjust size to medium or large
      fullWidth
      InputProps={{
        style: {
          fontSize: '13px', // Adjust font size
        },
      }}
      dropdownClass="custom-dropdown" // Custom class for the dropdown
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: '120px', // Set max height for the dropdown
            overflowY: 'auto',
          },
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
      }}
    />
  );
};

export default CustomPhoneNumberCellEditor;
