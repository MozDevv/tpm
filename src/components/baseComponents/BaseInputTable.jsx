import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add, Save, Delete, Edit } from "@mui/icons-material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Create custom editors for different input types
const TextFieldEditor = forwardRef((props, ref) => {
  const { value, onValueChanged } = props;
  const [inputValue, setInputValue] = useState(value || "");

  useImperativeHandle(ref, () => ({
    getValue() {
      return inputValue;
    },
  }));

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChanged(newValue);
  };

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      value={inputValue}
      onChange={handleChange}
    />
  );
});

const SelectEditor = forwardRef((props, ref) => {
  const { value, field, onValueChanged } = props;
  const [selectedValue, setSelectedValue] = useState(
    value || field.default || ""
  );

  useImperativeHandle(ref, () => ({
    getValue() {
      return selectedValue;
    },
  }));

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onValueChanged(newValue);
  };

  return (
    <Select
      variant="outlined"
      size="small"
      value={selectedValue}
      onChange={handleChange}
      fullWidth
    >
      <MenuItem value="">Select {field.label}</MenuItem>
      {field.options.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
});

const SwitchEditor = forwardRef((props, ref) => {
  const { value, onValueChanged } = props;
  const [checked, setChecked] = useState(value || false);

  useImperativeHandle(ref, () => ({
    getValue() {
      return checked;
    },
  }));

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onValueChanged(newChecked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} />}
      label={checked ? "Yes" : "No"}
    />
  );
});

const BaseInputTable = ({ fields, saveRow, validators }) => {
  const [rowData, setRowData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const gridRef = useRef();

  // Define columns based on the fields prop
  const columnDefs = [
    ...fields.map((field) => ({
      headerName: field.label,
      field: field.name,
      editable: true,
      cellEditor:
        field.type === "select"
          ? "selectEditor"
          : field.type === "switch"
          ? "switchEditor"
          : "textFieldEditor", // Define editors based on the type
      cellEditorParams: { field }, // Pass field parameters if needed
    })),
    {
      headerName: "Actions",
      field: "actions",
      cellRendererFramework: (params) => (
        <>
          {editingRow === params.node.rowIndex ? (
            <Button
              startIcon={<Save />}
              onClick={() => handleSaveRow(params.node.rowIndex)}
            >
              Save
            </Button>
          ) : (
            <>
              <Button
                startIcon={<Edit />}
                onClick={() => handleEditRow(params.node.rowIndex)}
              >
                Edit
              </Button>
              <Button
                startIcon={<Delete />}
                onClick={() => handleDeleteRow(params.node.rowIndex)}
              >
                Delete
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  const handleAddRow = () => {
    setRowData([...rowData, {}]);
    setEditingRow(rowData.length);
  };

  const handleEditRow = (index) => {
    setEditingRow(index);
  };

  const handleDeleteRow = (index) => {
    const updatedData = [...rowData];
    updatedData.splice(index, 1);
    setRowData(updatedData);
    setEditingRow(null);
  };

  const handleSaveRow = (index) => {
    const editedRow = gridRef.current.api.getDisplayedRowAtIndex(index).data;
    if (validators && !validateRow(editedRow)) {
      return;
    }

    const updatedData = [...rowData];
    updatedData[index] = editedRow;
    setRowData(updatedData);
    setEditingRow(null);
    saveRow && saveRow(editedRow);
  };

  const validateRow = (row) => {
    const errors = {};
    fields.forEach((field) => {
      const value = row[field.name];
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
      }
      if (validators && validators[field.name]) {
        const error = validators[field.name](value);
        if (error) errors[field.name] = error;
      }
    });
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        onClick={handleAddRow}
        startIcon={<Add />}
        style={{ marginBottom: "10px" }}
      >
        Add Rowi
      </Button>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        editType="fullRow"
        frameworkComponents={{
          textFieldEditor: TextFieldEditor,
          selectEditor: SelectEditor,
          switchEditor: SwitchEditor,
        }}
        stopEditingWhenCellsLoseFocus={true}
      />
    </div>
  );
};

export default BaseInputTable;
