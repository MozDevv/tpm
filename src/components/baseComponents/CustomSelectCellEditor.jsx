import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

const CustomPopper = (props) => {
  const isAccountId =
    props.colDef.field === 'accountId' || props.colDef.field === 'pensionerNo';
  return (
    <Popper
      {...props}
      placement="bottom-start"
      sx={{
        width: isAccountId ? '400px !important' : 'inherit', // Extend width only for 'accountId'
        zIndex: 1300,
      }}
    >
      {isAccountId && (
        <li className="flex items-center gap-[65px] px-[1px] py-2 bg-gray-100">
          <p className="text-xs font-normal">No.</p>
          <p className="text-xs font-normal ml-[50px]">Name</p>
        </li>
      )}
      {props.children}
    </Popper>
  );
};

const CustomSelectCellEditor = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.value || ''); // Allow falsy values
  const options = props.options || [];
  const isAccountId = props.colDef.field === 'accountId'; // Check if the field is 'accountId'

  const isPensionerNo = props.colDef.field === 'pensionerNo'; // Check if the field is 'pensionerNo'

  useEffect(() => {
    setSelectedValue(props.value !== undefined ? props.value : ''); // Accept falsy values
  }, [props.value]);

  const handleChange = (event, newValue) => {
    const newSelectedValue = newValue ? newValue.id : '';

    if (newSelectedValue !== undefined) {
      props.data[props.colDef.field] = newSelectedValue;

      const rowNode = props.node;
      if (rowNode) {
        props.api.dispatchEvent({
          type: 'cellValueChanged',
          node: rowNode,
          data: props.data,
          colDef: props.colDef,
          newValue: newSelectedValue,
        });
      }
    }

    props.api.stopEditing();
  };

  // Customize render option for 'accountId' field
  const renderOption = (props, option, { selected }) => (
    <div>
      <li
        {...props}
        style={{
          border: 'none',
          boxShadow: 'none',
          backgroundColor: selected ? '#B2E9ED' : 'white',
        }}
      >
        <Box
          sx={{
            width: '100%',
            pr: '40px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
            <p className="text-primary font-normal text-[12px]">
              {option.name}
            </p>
            <p className="text-[11px]">{option.accountName}</p>
          </Box>
        </Box>
      </li>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: '3px',
        zIndex: 1000,
      }}
    >
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        value={options.find((option) => option.id === selectedValue) || null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            autoFocus
            style={{ height: '56px' }}
            InputProps={{
              ...params.InputProps,
              style: { padding: '4px 8px', height: '100%' },
            }}
            InputLabelProps={{
              style: { margin: '0px', padding: '0px' },
            }}
          />
        )}
        filterOptions={(options, state) => {
          return options.filter((option) =>
            isAccountId
              ? option.accountName
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              : isPensionerNo
              ? option.name
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              : option.name
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
          );
        }}
        renderOption={isAccountId || isPensionerNo ? renderOption : undefined}
        PopperComponent={(popperProps) => (
          <CustomPopper {...popperProps} colDef={props.colDef} />
        )}
        ListboxProps={{
          sx: {
            padding: 0,
            '& ul': {
              padding: 0,
              margin: 0,
            },
          },
        }}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default CustomSelectCellEditor;
