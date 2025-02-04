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
import {
  Search,
  Add,
  FilterList,
  SortByAlpha,
  DoNotDisturbOn,
} from '@mui/icons-material';

const FilterComponent = ({
  columnDefs,
  filteredData,
  onApplyFilters,
  fetchData,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState(columnDefs[0]?.field || ''); // Default to the first column
  const [filterType, setFilterType] = useState(2); // Default to 'Includes'
  const [sortColumn, setSortColumn] = useState('');
  const [sortCriteria, setSortCriteria] = useState(1); // Default to Ascending
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([
    columnDefs[0]?.field,
  ]); // Pre-select the first column
  const [openDialog, setOpenDialog] = useState(false);

  // Filter values state for each column
  const [filterValues, setFilterValues] = useState(
    columnDefs.reduce((acc, col) => {
      acc[col.field] = ''; // Initialize filter value for each column
      return acc;
    }, {})
  );

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
    handleFilters(); // Apply the filter when user clicks on Add Filter(s)
  };

  const resetFilters = () => {
    setFilterColumn('');
    setSortColumn('');
    setSortCriteria(1);
    setSelectedColumns([columnDefs[0]?.field]); // Reset to only the first column selected
    setFilterValues(
      columnDefs.reduce((acc, col) => {
        acc[col.field] = ''; // Reset filter values for all columns
        return acc;
      }, {})
    );

    fetchData();
  };

  const handleFilterChange = (col, value) => {
    setFilterValues((prevState) => ({
      ...prevState,
      [col]: value,
    }));
  };

  const handleFilters = () => {
    const filterParams = selectedColumns.reduce((acc, col, index) => {
      const filterValue = filterValues[col]; // Get the filter value for the column
      if (filterValue) {
        acc[`filterCriterion.criterions[${index}].propertyName`] = col; // Using the column name as propertyName
        acc[`filterCriterion.criterions[${index}].propertyValue`] = filterValue; // Using the value entered by the user
        acc[`filterCriterion.criterions[${index}].criterionType`] =
          filterType || 2; // Default to 'Includes' (2)
      }
      return acc;
    }, {});

    //console.log('Filter Parameters:', filterParams);
    onApplyFilters(filterParams); // Pass filterParams to the parent component
  };

  // Remove filter for a selected column
  const removeFilter = (col) => {
    setSelectedColumns((prevSelected) =>
      prevSelected.filter((item) => item !== col)
    );
    setFilterValues((prevState) => {
      const newState = { ...prevState };
      delete newState[col]; // Remove the filter value for the column
      return newState;
    });
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

        {/* Filter Section for the Selected Columns */}
        {selectedColumns.map((col) => (
          <div className="flex flex-col item-center p-4 mt-3" key={col}>
            <label className="text-xs font-semibold text-gray-600 flex items-center justify-between mr-10">
              {columnDefs.find((c) => c.field === col)?.headerName}:
              <Tooltip title="Remove Filter">
                <IconButton onClick={() => removeFilter(col)}>
                  <DoNotDisturbOn
                    sx={{
                      fontSize: '15px',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </label>
            <div className="flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="border p-2 pl-10 bg-gray-100 border-gray-300 rounded-md text-sm w-[98%]"
                  value={filterValues[col]}
                  onChange={(e) => handleFilterChange(col, e.target.value)}
                  placeholder={`Search ${
                    columnDefs.find((c) => c.field === col)?.headerName
                  }`}
                />
              </div>

              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <FilterList />
              </IconButton>
            </div>
          </div>
        ))}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left', // Change to 'left' if it's displaced to the right
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left', // Change to 'left' if it's displaced to the right
          }}
        >
          <MenuItem
            onClick={() => {
              setFilterType(2);
              setAnchorEl(null);
            }}
          >
            Includes
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFilterType(0);
              setAnchorEl(null);
            }}
          >
            Matches Exactly
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFilterType(1);
              setAnchorEl(null);
            }}
          >
            Does Not Match
          </MenuItem>
        </Menu>

        <Button onClick={handleDialogOpen} startIcon={<Add />}>
          Add Filter(s)
        </Button>
        <Divider sx={{ px: 2 }} />

        {/* Sort Section */}
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

        <div className="flex flex-col w-full mt-32 ">
          <Button
            variant="contained"
            sx={{ ml: 2, width: '80%', mr: 2, mt: '-24px' }}
            onClick={handleFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2, width: '80%', mr: 2, mt: 2 }}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
