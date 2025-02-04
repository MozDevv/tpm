import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import ListNavigation from '@/components/baseComponents/ListNavigation';
import { useRouter } from 'next/navigation';
import {
  Add,
  FilterList,
  Launch,
  Search,
  SortByAlpha,
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import { useSearch } from '@/context/SearchContext';
import BaseLoadingOverlay from './BaseLoadingOverlay';
import BaseEmptyComponent from './BaseEmptyComponent';
import { Checkbox, message } from 'antd';
import axios from 'axios';
import FilterComponent from './FilterComponent';

const BaseTable = ({
  columnDefs,
  reportItems,
  fetchApiService,
  uploadExcel,
  fetchApiEndpoint,
  pageSize = 100,
  handlers,
  breadcrumbTitle,
  currentTitle,
  setClickedItem,
  setOpenBaseCard,
  openAction,
  transformData,
  refreshData,
  openBaseCard,
  isSecondaryTable,
  isMaintenance,
  id,
  openSubGroup,
  onSelectionChange,
  openPostToGL,
  scrollable,
  clickedItem,
  openApproveDialog,
  deleteApiEndpoint,
  deleteApiService,
  isPayroll,
}) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [userClicked, setUserClicked] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterType, setFilterType] = useState(2);
  const [sortColumn, setSortColumn] = useState('');
  const [sortCriteria, setSortCriteria] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [totalPages, setTotalPages] = useState(1);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteItem = async () => {
    try {
      const res = await deleteApiService(deleteApiEndpoint);
      console.log('Delete response:', res); // Log the response for debugging
      if (res.status === 200 || res.status === 201 || res.data.succeeded) {
        message.success(`${currentTitle} deleted successfully`);
        fetchData();
        setIsDialogOpen(false);
        setOpenBaseCard(false);
      } else {
        console.error('Delete failed:', res);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const adjustedHandlers = {
    ...handlers,
    filter: () => setOpenFilter(!openFilter),
    openInExcel: () => exportToExcel(),
    ...(handlers.delete ? { delete: handleDeleteItem } : {}),
  };

  const router = useRouter();
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    fetchData();
  }, [pageNumber, openBaseCard, openAction]);

  useEffect(() => {
    if (!openPostToGL) {
      fetchData();
    }
  }, [openPostToGL]);

  const handleApplyFilters = async (filterParams) => {
    await fetchData(filterParams);
  };

  const fetchData = async (filter) => {
    console.log('fetchData called', fetchApiEndpoint);
    console.log('isPayroll', isPayroll);
    try {
      let res;
      if (isPayroll) {
        const res = await fetchApiService(fetchApiEndpoint);
        if (res && res.data) {
          const transformedData = transformData(res.data);
          setRowData(transformedData);
        } else {
          console.error('Data is undefined or null:', res);
          setRowData([]); // Set an empty array if data is undefined or null
        }
      } else {
        res = await fetchApiService(fetchApiEndpoint, {
          'paging.pageNumber': pageNumber,
          'paging.pageSize': 10,
          ...filter,
        });
        const { data, totalCount, totalPages } = res.data;

        const transformedData = transformData(data);

        setRowData(transformedData);
        setTotalRecords(totalCount);
        setTotalPages(totalPages);

        console.log('Data fetched successfully:', transformedData);
      }
    } catch (error) {
      console.log('', error);

      console.error('Error fetching data:', error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [uploadExcel, refreshData]);
  useEffect(() => {
    if (!openApproveDialog) {
      fetchData();
    }
  }, [openApproveDialog]);

  const resetFilters = () => {
    setFilterColumn('');
    setFilterValue('');
    setFilterType(2);
    setSortColumn('');
    //setSortCriteria(1);
    fetchData();
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

    if (onSelectionChange) {
      onSelectionChange(selectedData);
    }
    if (!clickedItem) {
      setClickedItem(selectedData[0]);
    }
  };

  const handlePaginationChange = (e, newPage) => {
    console.log('newPage', newPage);
    console.log('***********************');
    console.log('e', e);
    setPageNumber(newPage);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };
  const exportToExcel = () => {
    gridApi.exportDataAsCsv({
      fileName: `${currentTitle}.csv`, // Set the desired file name here
    });
  };

  const { searchedKeyword, setSearchedKeyword } = useSearch();
  const [filteredData, setFilteredData] = useState(rowData);

  const applyKeywordFilter = () => {
    if (!searchedKeyword) {
      setFilteredData(rowData);
      return;
    }

    const lowercasedKeyword = searchedKeyword.toLowerCase();

    const filtered = rowData.filter((row) =>
      Object.values(row).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(lowercasedKeyword)
      )
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    // Apply keyword filter when searchedKeyword changes
    applyKeywordFilter();
  }, [rowData, searchedKeyword]);

  useEffect(() => {
    if (openSubGroup) {
      fetchData();
    }
  }, [openSubGroup]);

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: '1px', flexDirection: 'column' }}>
          <h6
            style={{
              fontSize: '20px',
              color: '#006990',
              fontWeight: 700,
              marginTop: '20px',
              marginLeft: '15px',
              marginBottom: '-10px',
            }}
          >
            {breadcrumbTitle}
          </h6>
          <CustomBreadcrumbsList currentTitle={currentTitle} />
          <div className="w-[80vw] ml-3 mt-2">
            <ListNavigation
              handlers={!isSecondaryTable ? adjustedHandlers : handlers}
              selectedRows={selectedRows}
              reportItems={reportItems}
              clickedItem={clickedItem}
            />
            <Divider sx={{ mt: 2, mb: '-8px' }} />
          </div>
        </Box>
      </Box>
      <div className="flex gap-2">
        {' '}
        <Collapse
          in={openFilter}
          sx={{
            bgcolor: 'white',
            mt: 2,
            borderRadius: '10px',
            color: 'black',
            borderRadius: '10px',
            // maxHeight: "70vh",
          }}
          timeout="auto"
          unmountOnExit
        >
          {/* <div className="h-[100%] bg-white w-[300px] rounded-md p-3 ">
            <div className="flex w-full justify-between items-center">
              <p className="text-md font-medium text-primary p-3">Filter By:</p>
            </div>
            <Divider sx={{ px: 2 }} />
            <div className="flex flex-col item-center p-4 mt-3">
              <label className="text-xs font-semibold text-gray-600">
                Choose Column for Filtering:
              </label>
              <select
                name="role"
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="border p-3 bg-gray-100 border-gray-300 rounded-md  text-sm mr-7"
                required
              >
                {columnDefs.map((col) => (
                  <option value={col.field}>{col.headerName}</option>
                ))}
              </select>
            </div>
            <div className="p-3">
              <label className="text-xs font-semibold text-gray-600">
                Enter Keyword
              </label>
              <div className="flex">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="border p-2 pl-10 bg-gray-100 border-gray-300 rounded-md text-sm w-[98%]"
                    required
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder={`Search ${
                      filteredData.length > 0
                        ? `"${filteredData[0][columnDefs[0].field]}"`
                        : ''
                    }`}
                  />
                </div>

                <IconButton onClick={handleClick}>
                  <FilterList />
                </IconButton>
              </div>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
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

            <Button startIcon={<Add />}>Add Filter(s)</Button>
            <Divider />
            <div className="flex flex-col item-center p-4 mt-3">
              <label className="text-xs font-semibold text-gray-600 w-[100%]">
                Sort By:
              </label>
              <div className="flex items-center ">
                {' '}
                <select
                  name="role"
                  value={sortColumn}
                  onChange={(e) => setSortColumn(e.target.value)}
                  className="border p-3 bg-gray-100 border-gray-300 rounded-md w-[100%]  text-sm "
                  required
                >
                  {columnDefs.map((col) => (
                    <option value={col.field}>{col.headerName}</option>
                  ))}
                </select>
                <Tooltip
                  title={
                    sortCriteria === 1 ? 'Ascending Order' : 'Desceding Order'
                  }
                  placement="top"
                >
                  <IconButton
                    sx={{ mr: '-10px', ml: '-4px' }}
                    onClick={() => {
                      setSortCriteria(sortCriteria === 1 ? 2 : 1);
                    }}
                  >
                    <SortByAlpha />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div> */}
          <FilterComponent
            columnDefs={columnDefs}
            filteredData={filteredData}
            onApplyFilters={handleApplyFilters}
            fetchData={fetchData}
          />
        </Collapse>
        <div className="flex justify-around flex-col">
          <div
            className="ag-theme-quartz"
            style={{
              height: '65vh',

              maxHeight: '85%',
              overflowY: 'auto',
              width: openFilter ? 'calc(100vw - 500px)' : '80vw',
            }}
          >
            <AgGridReact
              columnDefs={columnDefs.map((col) => ({
                ...col,
                headerTooltip: col.headerName,
                // cellRenderer:
                //   col.cellRenderer || col.valueFormatter
                //     ? undefined
                //     : (params) => {
                //         if (typeof params.data[col.field] === 'boolean') {
                //           return (
                //             <div className="ml-11">
                //               <Checkbox
                //                 checked={params.data[col.field]}
                //                 className="custom-checkbox"
                //                 onChange={(e) => {
                //                   // Prevent the checkbox state from changing
                //                   params.node.setDataValue(
                //                     params.colDef.field,
                //                     params.value
                //                   );
                //                 }}
                //               />
                //             </div>
                //           );
                //         }
                //         return params.value; // Default renderer for non-boolean columns
                //       },
              }))}
              rowData={filteredData}
              pagination={false}
              domLayout={scrollable ? 'normal' : 'autoHeight'}
              alwaysShowHorizontalScroll={true}
              loadingOverlayComponent={BaseLoadingOverlay}
              loadingOverlayComponentParams={loadingOverlayComponentParams}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
                onGridReady(params);
                gridApiRef.current.api.showLoadingOverlay();
              }}
              rowSelection="multiple"
              className=""
              onSelectionChanged={onSelectionChanged}
              onRowClicked={(e) => {
                setClickedItem(e.data);
              }}
              onCellDoubleClicked={(e) => {
                console.log('e.data', e.data);
                setOpenBaseCard(true);
                setClickedItem(e.data);
              }}
            />
          </div>
          {/* PAGINATION */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
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
      </div>
    </div>
  );
};

export default BaseTable;
