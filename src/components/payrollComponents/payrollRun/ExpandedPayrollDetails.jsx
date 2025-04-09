const {
  default: BaseEmptyComponent,
} = require('@/components/baseComponents/BaseEmptyComponent');
const { Search, Replay } = require('@mui/icons-material');
const { Button, Box, Pagination } = require('@mui/material');
const { AgGridReact } = require('ag-grid-react');

export const ExpandedPayrollDetails = ({
  eligibleColDefs,
  elgiblePensioners,
  totalPages,
  pageNumber,
  handlePaginationChange,
  handleSearchColumns,
  setSearchText,
  setSelectedColumn,
  theme,
  handleResetFilters,
  notTable = false,
}) => {
  return (
    <div className="px-5 ag-theme-quartz pt-4">
      <div>
        <div
          className="bg-white p-6 mb-3 rounded-lg"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
          }}
        >
          <form className="flex items-center gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className={`block text-sm font-medium ${
                  theme.palette.mode === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                What are you looking for?
              </label>
              <input
                type="text"
                id="search"
                placeholder={`Search by ${eligibleColDefs
                  .slice(0, 4)
                  .map((col) => col.headerName.toLowerCase())
                  .join(', ')} etc`}
                onChange={(e) => setSearchText(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="columns"
                className={`block text-sm font-medium ${
                  theme.palette.mode === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                Columns
              </label>
              <select
                id="columns"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-full focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedColumn(e.target.value)}
              >
                {eligibleColDefs.map((col, index) => (
                  <option key={index} value={col.field}>
                    {col.headerName}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Search />}
              onClick={handleSearchColumns}
              sx={{
                mt: 3,
              }}
            >
              Search by Columns
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Replay />}
              onClick={handleResetFilters}
              sx={{
                mt: 3,
              }}
            >
              Reset Search
            </Button>
          </form>
        </div>
      </div>
      {!notTable && (
        <div className="ag-theme-quartz  h-[45vh]">
          <AgGridReact
            noRowsOverlayComponent={BaseEmptyComponent}
            columnDefs={eligibleColDefs}
            rowData={elgiblePensioners}
            pagination={false}
            domLayout="normal"
            alwaysShowHorizontalScroll={true}
            animateRows={true}
            rowSelection="multiple"
            className="custom-grid ag-theme-quartz"
            onRowClicked={(e) => {
              console.log('Row clicked:', e.data);
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: '40px',
            }}
          >
            <Pagination
              showFirstButton
              showLastButton
              count={totalPages}
              page={pageNumber}
              onChange={handlePaginationChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </div>
      )}
    </div>
  );
};
