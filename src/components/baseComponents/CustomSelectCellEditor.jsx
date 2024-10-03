import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";
import Box from "@mui/material/Box";

const CustomSelectCellEditor = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.value || ""); // Allow falsy values
  const options = props.options || [];
  const isAccountId = props.colDef.field === "accountId"; // Check if the field is 'accountId'

  useEffect(() => {
    setSelectedValue(props.value !== undefined ? props.value : ""); // Accept falsy values
  }, [props.value]);

  const handleChange = (event, newValue) => {
    console.log("newValue", newValue);
    const newSelectedValue = newValue ? newValue.id : "";

    if (newSelectedValue !== undefined) {
      props.data[props.colDef.field] = newSelectedValue;

      const rowNode = props.node;
      if (rowNode) {
        props.api.dispatchEvent({
          type: "cellValueChanged",
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
    <div className="">
      <li
        {...props}
        style={{
          border: "none",
          boxShadow: "none",
          backgroundColor: selected ? "#B2E9ED" : "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
            pr: "40px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
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
        onChange={handleChange}
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
            isAccountId
              ? option.accountName
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              : option.name
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
          );
        }}
        renderOption={isAccountId ? renderOption : undefined}
        ListboxProps={{
          sx: {
            padding: 0,
            "& ul": {
              padding: 0,
              margin: 0,
            },
          },
        }}
        PopperComponent={
          isAccountId
            ? (props) => (
                <Popper
                  {...props}
                  disablePortal={false} // Allow portal rendering (set to true if needed)
                  sx={{
                    width: "500px", // Increase the width beyond the input field (e.g., 500px)
                    maxWidth: "500px", // Control the maximum width
                    zIndex: 1300, // Ensure it renders above other components if needed
                  }}
                  modifiers={[
                    {
                      name: "flip",
                      enabled: true,
                      options: {
                        altBoundary: true,
                        rootBoundary: "viewport",
                        padding: 8,
                      },
                    },
                    {
                      name: "preventOverflow",
                      enabled: true,
                      options: {
                        mainAxis: true,
                        tether: true,
                        padding: 8,
                        boundary: "window",
                      },
                    },
                  ]}
                >
                  <li className="flex items-center gap-[5px] px-[1px] py-2 bg-gray-100">
                    <p className="text-xs font-normal">No.</p>
                    <p className="text-xs font-normal">Name</p>
                  </li>
                  {props.children}
                </Popper>
              )
            : undefined
        }
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default CustomSelectCellEditor;
