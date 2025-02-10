import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
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
  ArrowBack,
  FilterList,
  OpenInFull,
  SortByAlpha,
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import { useSearch } from '@/context/SearchContext';
import BaseLoadingOverlay from './BaseLoadingOverlay';
import { useAuth } from '@/context/AuthContext';
import BaseEmptyComponent from './BaseEmptyComponent';

const BaseDrilldown = ({
  columnDefs,
  fetchApiService,
  uploadExcel,
  fetchApiEndpoint,
  setClickedItem,
  setOpenBaseCard,
  openAction,
  transformData,
  openBaseCard,
  openSubGroup,
  onSelectionChange,
  openPostToGL,
  title,
  openDrilldown,
  setOpenDrilldown,
}) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    if (!openPostToGL) {
      fetchData();
    }
  }, [openPostToGL]);

  const fetchData = async (filter) => {
    console.log('fetchData called', fetchApiEndpoint);
    try {
      let res;
      res = await fetchApiService(fetchApiEndpoint, {
        'paging.pageSize': 100000,
      });
      const { data, totalCount, totalPages } = res.data;

      const transformedData = data;

      setRowData(transformedData);
      setTotalRecords(totalCount);
      setTotalPages(totalPages);

      console.log('Data fetched successfully:', transformedData);
    } catch (error) {
      console.log('', error);
      console.error('Error fetching data:', error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [openDrilldown]);

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

    if (onSelectionChange) {
      onSelectionChange(selectedData);
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

  const { searchedKeyword } = useSearch();
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

  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;
  const updatedHandlers = {
    openDetails: () => setDetailsVisible(!isDetailsVisible),
    openInExcel: () => exportData(),
  };

  const exportData = () => {
    gridApi.exportDataAsCsv({
      fileName: `${title}.csv`, // Set the desired file name here
    });
  };

  return (
    <Dialog
      open={openDrilldown}
      maxWidth="lg"
      sx={{
        '& .MuiPaper-root': {
          minHeight: '85vh',
          maxHeight: '75vh',
          minWidth: '70vw',
          maxWidth: '70vw',
          overflow: 'hidden',
        },
        p: 10,
      }}
      onClose={() => setOpenDrilldown(false)}
    >
      <div className="px-10">
        <div className="flex items-center px-2 pt-4 justify-between w-full sticky top-0 z-[99999999] bg-white">
          <div className="flex items-center gap-1 mt-10">
            <IconButton
              sx={{
                border: '1px solid #006990',
                borderRadius: '50%',
                padding: '3px',
                marginRight: '10px',
                color: '#006990',
              }}
              onClick={() => setOpenDrilldown(false)}
            >
              <ArrowBack sx={{ color: '#006990' }} />
            </IconButton>
            <p className="text-lg text-primary font-semibold">{title}</p>
          </div>
          <div className="flex items-center">
            <IconButton>
              <Tooltip>
                <OpenInFull
                  color="primary"
                  sx={{
                    fontSize: '18px',
                    mt: '4px',
                  }}
                />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <div className="ag-theme-quartz w-full h-full" style={{}}>
          <div className="w-[98%] flex flex-col mt-[20px] mb-4 gap-4 ml-2">
            <ListNavigation
              handlers={updatedHandlers}
              permissions={permissions}
            />
            <Divider sx={{ mx: 2 }} />
          </div>

          <div className="px-6 bg-gray-100 min-h-[600px] max-h-[600px] h-[200px]">
            <AgGridReact
              noRowsOverlayComponent={BaseEmptyComponent}
              columnDefs={columnDefs}
              rowData={filteredData}
              pagination={false}
              domLayout="normal"
              alwaysShowHorizontalScroll={true}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
                onGridReady(params);
              }}
              animateRows={true}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              className="custom-grid ag-theme-quartz"
              onRowClicked={(e) => {
                console.log('e.data', e.data);
                setOpenBaseCard(true);
                setClickedItem(e.data);
              }}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BaseDrilldown;
