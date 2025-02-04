import { useState } from 'react';
import {
  Collapse,
  Divider,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Search, Add, FilterList, SortByAlpha } from '@mui/icons-material';

const FilterComponent = ({ columnDefs, filteredData }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState([]); // To store an array of filter objects
  const [filterType, setFilterType] = useState(2); // Default to 'Includes'
  const [sortColumn, setSortColumn] = useState('');
  const [sortCriteria, setSortCriteria] = useState(1); // Default to Ascending
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([
    columnDefs[0]?.field,
  ]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClose = () => setOpenDialog(false);
  const handleDialogOpen = () => setOpenDialog(true);

  const handleColumnSelect = (col) => {
    setSelectedColumns((prevSelected) =>
      prevSelected.includes(col)
        ? prevSelected.filter((item) => item !== col)
        : [...prevSelected, col]
    );
  };

  const handleApplyFilter = () => {
    setOpenFilter(true);
    setOpenDialog(false);
  };

  const resetFilters = () => {
    setFilters([]); // Reset all filters
    setSortColumn('');
    setSortCriteria(1);
    setSelectedColumns([columnDefs[0]?.field]);
  };

  const handleAddFilter = (column, value, type) => {
    setFilters((prevFilters) => [
      ...prevFilters,
      {
        propertyName: column,
        propertyValue: value,
        criterionType: type,
      },
    ]);
  };

  const handleFilters = async () => {
    const filterParams = filters.reduce((acc, filter, index) => {
      acc[`filterCriterion.criterions[${index}].propertyName`] =
        filter.propertyName;
      acc[`filterCriterion.criterions[${index}].propertyValue`] =
        filter.propertyValue;
      acc[`filterCriterion.criterions[${index}].criterionType`] =
        filter.criterionType || 2; // Default to 'Includes'
      return acc;
    }, {});

    console.log('Filter Parameters:', filterParams);
  };

  return (
    <div>
      {/* Column Selection Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '400px',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle>Select Columns for Filtering</DialogTitle>
        <DialogContent>
          {columnDefs.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={selectedColumns.includes(col.field)}
                  onChange={() => handleColumnSelect(col.field)}
                />
              }
              label={col.headerName}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApplyFilter} color="primary">
            Add Filter(s)
          </Button>
        </DialogActions>
      </Dialog>

      <div className="h-[100%] bg-white w-[300px] rounded-md p-3">
        <div className="flex w-full justify-between items-center">
          <p className="text-md font-medium text-primary p-3">Filter By:</p>
        </div>
        <Divider sx={{ px: 2 }} />

        {/* Loop over filters */}
        {filters.map((filter, index) => (
          <div className="flex flex-col item-center p-4 mt-3" key={index}>
            <label className="text-xs font-semibold text-gray-600">
              {filter.propertyName}:
            </label>
            <div className="flex">
              <input
                type="text"
                className="border p-2 pl-10 bg-gray-100 border-gray-300 rounded-md text-sm w-[100%]"
                value={filter.propertyValue}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[index].propertyValue = e.target.value;
                  setFilters(newFilters);
                }}
                placeholder={`Search ${filter.propertyName}`}
              />
            </div>
          </div>
        ))}

        <Button onClick={handleDialogOpen} startIcon={<Add />}>
          Add Filter(s)
        </Button>

        <Divider sx={{ px: 2 }} />

        {/* Sorting section */}
        <div className="flex flex-col item-center p-4 mt-3">
          <label className="text-xs font-semibold text-gray-600 w-[100%]">
            Sort By:
          </label>
          <div className="flex items-center">
            <select
              name="role"
              value={sortColumn}
              onChange={(e) => setSortColumn(e.target.value)}
              className="border p-3 bg-gray-100 border-gray-300 rounded-md w-[100%] text-sm"
            >
              {columnDefs.map((col) => (
                <option key={col.field} value={col.field}>
                  {col.headerName}
                </option>
              ))}
            </select>
            <Tooltip
              title={
                sortCriteria === 1 ? 'Ascending Order' : 'Descending Order'
              }
              placement="top"
            >
              <IconButton
                onClick={() => setSortCriteria(sortCriteria === 1 ? 2 : 1)}
              >
                <SortByAlpha />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
