import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const AutocompleteSelectCellEditor = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // For menu positioning
  const inputRef = useRef(null);

  useEffect(() => {
    // Set initial value for the editor
    setInputValue(props.value ? props.value : '');
    setFilteredOptions(props.options);

    // Focus on the input when editor is opened
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.value, props.options]);

  // Filter options based on the input value
  useEffect(() => {
    if (inputValue) {
      const filtered = props.options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(props.options);
    }
  }, [inputValue, props.options]);

  // Return the selected value to the grid
  const onSelectOption = (option) => {
    props.api.stopEditing();
    props.onValueChanged(option.id);
  };

  // Handle key press to select an option with Enter
  const onKeyPress = (event) => {
    if (event.key === 'Enter' && filteredOptions.length) {
      onSelectOption(filteredOptions[0]);
    }
  };

  // Handle input focus to show options
  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle input blur to hide options
  const handleBlur = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relative autocomplete-select-editor">
      <TextField
        inputRef={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={onKeyPress}
        fullWidth
        variant="outlined"
        size="small"
        className="mb-2"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem', // Tailwind's rounded-md
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && filteredOptions.length > 0}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: '200px',
            width: '200px',
          },
        }}
        className="absolute z-10" // Tailwind for positioning
      >
        {filteredOptions.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => onSelectOption(option)}
            style={{ cursor: 'pointer' }}
            className="hover:bg-gray-100" // Tailwind hover effect
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AutocompleteSelectCellEditor;
