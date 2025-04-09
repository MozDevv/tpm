import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  Backdrop,
  Box,
  Button,
  Collapse,
  Dialog,
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
import { Checkbox, message, Segmented } from 'antd';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import BaseExcelComponent from './BaseExcelComponent';

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
  excelTitle,
  isIgc,
  segmentFilterParameter = null,
  segmentOptions,
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

  const [openExcel, setOpenExcel] = useState(false);

  const adjustedHandlers = {
    ...handlers,
    filter: () => setOpenFilter(!openFilter),
    openInExcel: () => setOpenExcel(true),
    ...(handlers.delete ? { delete: handleDeleteItem } : {}),
  };

  const router = useRouter();
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const [activeSegment, setActiveSegment] = useState(0);

  useEffect(() => {
    // Check if segment filtering is enabled
    if (segmentFilterParameter && activeSegment !== -1) {
      const filter = isIgc
        ? {
            'filterCriterion.criterions[0].propertyName':
              'igc_stage_type_map.igc_stage',
            'filterCriterion.criterions[0].propertyValue': activeSegment,
            'filterCriterion.criterions[0].criterionType': 0,
          }
        : segmentFilterParameter
        ? {
            [segmentFilterParameter]: activeSegment,
          }
        : {};

      console.log('filter', filter);
      console.log('activeSegment', activeSegment);

      fetchData(filter);
    } else if (!openPostToGL || !openApproveDialog || openSubGroup) {
      // Fetch data when specific states change
      fetchData();
    } else {
      // Default fetch without filters
      fetchData();
    }
  }, [
    pageNumber,
    openBaseCard,
    openAction,
    activeSegment,
    uploadExcel,
    refreshData,
    openPostToGL,
    openApproveDialog,
    openSubGroup,
    segmentFilterParameter,
    isIgc,
  ]);

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
        console.log('res', res);
        if (res && res.data) {
          const transformedData = transformData(res.data);
          setRowData(transformedData);
        } else {
          console.error('Data is undefined or null:', res);
          setRowData([]); // Set an empty array if data is undefined or null
        }
      } else {
        const res = await fetchApiService(fetchApiEndpoint, {
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

      console.error('Error fetching data:', error);
    }
  };

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
    const selectedData = event.api.getSelectedRows();
    if (onSelectionChange) {
      onSelectionChange(selectedData);
    }
    if (!clickedItem && selectedData.length > 0) {
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

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);

  const [excelLoading, setExcelLoading] = useState(false);

  setTimeout(() => {
    if (gridApiRef.current.api) {
      gridApiRef.current.api.hideOverlay();
    }
  }, 50000);

  return (
    <div>
      {excelLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 999999 }}
          open={excelLoading}
          onClick={() => setExcelLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Generating Excel File
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      <Dialog open={openExcel} onClose={() => setOpenExcel(false)} sx={{}}>
        <BaseExcelComponent
          setOpenExcel={setOpenExcel}
          fetchApiService={fetchApiService}
          fetchApiEndpoint={fetchApiEndpoint}
          columns={columnDefs.map((col) => ({
            headerName: col.headerName,
            field: col.field,
          }))}
          transformData={transformData}
          fileName={currentTitle}
          setLoading={setExcelLoading}
          excelTitle={excelTitle}
        />
      </Dialog>
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
          <FilterComponent
            columnDefs={columnDefs}
            filteredData={filteredData}
            onApplyFilters={handleApplyFilters}
            fetchData={fetchData}
          />
        </Collapse>
        <div className="flex justify-around flex-col">
          {isIgc ? (
            <div className="pl-2">
              <Segmented
                options={[
                  { label: 'All', value: -1 },
                  { label: 'Verification', value: 0 },
                  { label: 'Validation', value: 1 },
                  { label: 'Approval', value: 2 },
                  { label: 'Assessment Data Capture', value: 3 },
                  { label: 'Assessment Approval', value: 4 },
                  { label: 'Directorate', value: 5 },
                  { label: 'Controller Of Budget', value: 6 },
                  { label: 'Finance', value: 7 },
                ]}
                value={activeSegment}
                onChange={(value) => setActiveSegment(value)}
                className="custom-segmented"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <style>{`
      .custom-segmented {
        font-family: 'Montserrat', sans-serif;
      }
      
      .custom-segmented .ant-segmented-item {
        padding: 3px 16px;
        font-size: 13px;
        color: #000000;
        background-color: transparent !important;
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        z-index: 1;
        position: relative;
      }
      
      .custom-segmented .ant-segmented-item-selected {
        color: #006990 !important;
        font-weight: 600;
        background-color: transparent !important;
      }
      
      .custom-segmented .ant-segmented-item:hover:not(.ant-segmented-item-selected) {
        color: #006990;
      }
      
      .custom-segmented .ant-segmented-thumb {
        background-color: rgba(0, 105, 144, 0.2) !important;
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      
      /* Fix for the active item's background */
      .custom-segmented .ant-segmented-item-selected::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 105, 144, 0.2);
        border-radius: 6px;
        z-index: -1;
      }
    `}</style>
            </div>
          ) : segmentFilterParameter && segmentOptions ? (
            <div className="pl-2">
              <Segmented
                options={segmentOptions}
                value={activeSegment}
                onChange={(value) => setActiveSegment(value)}
                className="custom-segmented"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <style>{`
    .custom-segmented {
      font-family: 'Montserrat', sans-serif;
    }
    
    .custom-segmented .ant-segmented-item {
      padding: 3px 16px;
      font-size: 13px;
      color: #000000;
      background-color: transparent !important;
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      z-index: 1;
      position: relative;
    }
    
    .custom-segmented .ant-segmented-item-selected {
      color: #006990 !important;
      font-weight: 600;
      background-color: transparent !important;
    }
    
    .custom-segmented .ant-segmented-item:hover:not(.ant-segmented-item-selected) {
      color: #006990;
    }
    
    .custom-segmented .ant-segmented-thumb {
      background-color: rgba(0, 105, 144, 0.2) !important;
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    /* Fix for the active item's background */
    .custom-segmented .ant-segmented-item-selected::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 105, 144, 0.2);
      border-radius: 6px;
      z-index: -1;
    }
  `}</style>
            </div>
          ) : null}
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
              noRowsOverlayComponent={BaseEmptyComponent}
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
