import React, { useEffect, useState } from 'react';
import { Button, MenuItem, Select, Divider, IconButton } from '@mui/material';
import { Checkbox, message } from 'antd';
import { Close } from '@mui/icons-material';
import { generateExcelTemplateWithApiService } from '@/utils/excelHelper';

const BaseExcelComponent = ({
  columns,
  fetchApiService,
  fetchApiEndpoint,
  transformData,
  fileName,
  setOpenExcel,
}) => {
  // Initialize selectedColumns with all columns by default
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [pageSize, setPageSize] = useState(10);
  const [skipBlankEntries, setSkipBlankEntries] = useState(false);

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelected) =>
      prevSelected.includes(column)
        ? prevSelected.filter((col) => col !== column)
        : [...prevSelected, column]
    );
    console.log('Selected Columns:', selectedColumns);
  };

  useEffect(() => {
    console.log('columns', columns);
  }, [selectedColumns]);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  const exportToExcel = () => {
    if (selectedColumns.length === 0) {
      message.error('Please select at least one column to export.');
      return;
    }

    generateExcelTemplateWithApiService(
      fetchApiEndpoint,
      fetchApiService,
      transformData,
      `${fileName}.xlsx`,
      'Sheet1',
      pageSize,
      selectedColumns,
      skipBlankEntries
    );
  };

  return (
    <div className="p-8">
      <div className="absolute top-2 right-2">
        <IconButton>
          <Close onClick={() => setOpenExcel(false)} />
        </IconButton>
      </div>
      .
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
        <Divider sx={{ py: 1 }} />
        <div className="mb-5 mt-4 py-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={skipBlankEntries}
              onChange={() => setSkipBlankEntries(!skipBlankEntries)}
              className="mr-2"
            />
            <label className="block text-sm font-medium">
              Skip Blank Entries
            </label>
          </label>
        </div>
      </div>
      {/* Column Selection */}
      <div className="mb-4 pt-4">
        <label className="block text-sm font-medium mb-2">
          Select Columns to Display:
        </label>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {columns.map((column, index) => (
            <div key={column.field} className="w-full mb-2">
              <Checkbox
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnChange(column)}
                style={{ whiteSpace: 'nowrap' }} // Prevent line breaks
              >
                {column.headerName}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
      {/* Generate Button */}
      <div className="mt-10">
        <Button
          onClick={exportToExcel}
          variant="contained"
          color="primary"
          fullWidth
        >
          Generate Excel File
        </Button>
      </div>
    </div>
  );
};

export default BaseExcelComponent;
