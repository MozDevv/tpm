import React, { useEffect, useState } from 'react';
import { Button, Divider, IconButton } from '@mui/material';
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
  filters,
  setLoading,
  excelTitle,
  segmentFilters,
  isIgc = false,
  isOmbudsman,
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

  const handleSelectAllChange = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns);
    }
  };

  useEffect(() => {
    console.log('columns', columns);
  }, [selectedColumns]);

  const handlePageSizeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 1000000) {
      setPageSize(value);
    } else {
      // message.error('Page size must be between 1 and 1,000,000.');
    }
  };

  let segFilter = {};
  const exportToExcel = () => {
    if (selectedColumns.length === 0) {
      message.error('Please select at least one column to export.');
      return;
    }

    // Construct segFilter dynamically
    let segFilter = {};

    // Handle IGC-specific filtering
    if (isIgc && segmentFilters.activeSegment !== -1) {
      segFilter = {
        'filterCriterion.criterions[0].propertyName':
          'igc_stage_type_map.igc_stage',
        'filterCriterion.criterions[0].propertyValue':
          segmentFilters.activeSegment,
        'filterCriterion.criterions[0].criterionType': 0,
      };
    }
    // Handle segmentOptions filtering
    else if (
      segmentFilters.segmentFilterParameter &&
      segmentFilters.activeSegment !== -1
    ) {
      segFilter = {
        [segmentFilters.segmentFilterParameter]: segmentFilters.activeSegment,
      };
    }

    // Handle segmentOptions2 filtering
    if (
      segmentFilters.segmentFilterParameter2 &&
      segmentFilters.activeSegment2 !== -1
    ) {
      segFilter = {
        ...segFilter,
        [segmentFilters.segmentFilterParameter2]: segmentFilters.activeSegment2,
      };
    }

    // Remove filters if both activeSegment and activeSegment2 are -1
    if (
      segmentFilters.activeSegment === -1 &&
      segmentFilters.activeSegment2 === -1
    ) {
      segFilter = {};
    }

    console.log('Filter applied:', segFilter);

    generateExcelTemplateWithApiService(
      fetchApiEndpoint,
      fetchApiService,
      transformData,

      `${fileName}.xlsx`,
      'Sheet1',
      pageSize,
      selectedColumns,
      skipBlankEntries,
      setLoading,
      filters,
      segFilter,
      excelTitle,
      isOmbudsman
    );
  };

  return (
    <div className="p-8">
      <div className="absolute top-2 right-2">
        <IconButton>
          <Close onClick={() => setOpenExcel(false)} />
        </IconButton>
      </div>
      <div className="mb-4 pb-5">
        <h2 className="text-xl text-primary font-semibold mb-2 text-center w-full">
          Generate Excel Report
        </h2>
        <h3 className="text-sm text-primary font-medium text-center w-full">
          Select columns and options to generate your Excel file
        </h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-primary">
          Select Page Size:
        </label>
        <input
          type="number"
          value={pageSize}
          onChange={handlePageSizeChange}
          min="1"
          max="1000000"
          className="w-full p-2 border rounded"
        />
        <Divider sx={{ py: 1 }} />
        <div className="mb-5 mt-4 py-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={skipBlankEntries}
              onChange={() => setSkipBlankEntries(!skipBlankEntries)}
              className="mr-2"
            />
            <label className="block text-sm font-medium text-primary">
              Skip Blank Entries
            </label>
          </label>
        </div>
      </div>

      {/* Column Selection */}
      <div className="mb-4 pt-4">
        <label className="block text-sm font-medium mb-4 text-primary">
          Select Columns to Display:
        </label>
        <div className="mb-2">
          <Checkbox
            checked={selectedColumns.length === columns.length}
            indeterminate={
              selectedColumns.length > 0 &&
              selectedColumns.length < columns.length
            }
            onChange={handleSelectAllChange}
          >
            Select All / Unselect All
          </Checkbox>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 h-[250px] overflow-y-auto">
          {columns.map((column, index) => (
            <div key={column.field} className="w-full mb-2">
              <Checkbox
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnChange(column)}
                //  style={{ whiteSpace: 'nowrap' }} // Prevent line breaks
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
