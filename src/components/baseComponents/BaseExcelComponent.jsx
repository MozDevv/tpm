import React, { useState } from 'react';
import {
  Button,
  TextField,
  FormControlLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Checkbox } from 'antd';

const BaseExcelComponent = ({ columns, handleGenerate }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelected) =>
      prevSelected.includes(column)
        ? prevSelected.filter((col) => col !== column)
        : [...prevSelected, column]
    );
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  return (
    <div className="p-4">
      {/* Page Size Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Page Size:
        </label>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          variant="outlined"
          size="small"
          fullWidth
        >
          {[10, 20, 50, 100].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Column Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Columns to Display:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {columns.map((column, index) => (
            <div key={column.field} className="w-[48%] mb-2">
              <Checkbox
                checked={selectedColumns.includes(column.field)}
                onChange={() => handleColumnChange(column.field)}
              >
                {column.headerName}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={() => handleGenerate({ selectedColumns, pageSize })}
        variant="contained"
        color="primary"
        fullWidth
      >
        Preview and Generate
      </Button>
    </div>
  );
};

export default BaseExcelComponent;
