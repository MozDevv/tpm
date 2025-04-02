/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Button,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Launch,
  Add,
  Search,
  CallMade,
  MoreHoriz,
} from '@mui/icons-material';
import BaseDrawer from './BaseDrawer';
import BaseInputCard from '../baseComponents/BaseInputCard';
import {
  Assignment,
  HourglassEmpty,
  Repeat,
  CheckCircle,
} from '@mui/icons-material';
import {
  //   CheckCircle,
  //   HourglassEmpty,
  Loop,
  LockOpen,
} from '@mui/icons-material';

import ListNavigation from './ListNavigation';
// import { Divide } from 'feather-icons-react/build/IconComponents';
import BaseLoadingOverlay from './BaseLoadingOverlay';
import { apiService } from '../services/api';
import './crm.css';
import BaseEmptyComponent from './BaseEmptyComponent';

function BaseCRMTable({
  columnDefs,
  fetchApiEndpoint,
  handlers,
  transformData,
  fetchApiService,
  title,
  hasFilters = true,
  addBtnTitle,
  setOpenBaseCard,
  openBaseCard,
  menuItems = [],
  menuHandlers = {},
  postApiFunction,
  fields,
  clickedItem,
  isSecondaryTable = false,
  selectedRows = [],
  reportItems = [],
  scrollable = true,
  setClickedItem,
  onSelectionChanged,
}) {
  const theme = useTheme();
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [openBaseCard]);

  const fetchData = async () => {
    try {
      const res = await fetchApiService(fetchApiEndpoint, {});
      const { data, totalCount } = res.data;
      setRowData(transformData(data));
    } catch (error) {
      console.error('Error fetching data:', error.response);
    }
  };

  const filterData = () => {
    let data = rowData;
    if (selectedCategory !== 'All') {
      data = data.filter((row) => row[selectedCategory.toLowerCase()]);
    }
    if (searchText) {
      data = data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    setRowData(data);
  };

  useEffect(() => {
    filterData();
  }, [selectedCategory, searchText]);

  const [clickedRow, setClickedRow] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    // params.api.sizeColumnsToFit();
  };
  const exportToExcel = () => {
    gridApi.exportDataAsCsv({
      fileName: `${currentTitle}.csv`, // Set the desired file name here
    });
  };

  // Default menu handlers
  const defaultMenuHandlers = {
    [`View ${title}`]: (data) => console.log('Viewing:', data),
    [`Add ${title}`]: (data) => console.log('Editing:', data),
    [`Delete ${title}`]: (data) => console.log('Deleting:', data),
    ...menuHandlers, // Allow adding custom handlers
  };

  const categories = ['Low', 'Normal', 'High', 'Urgent'];
  const ticketTypes = [
    /** */
    /**{
        WALK_IN,
        DIRECT_BOOKING,
        RESERVATION,
        FOLLOW_UP
    } */
    {
      id: 0,
      name: 'Walk In',
    },
    {
      id: 1,
      name: 'Direct Booking',
    },
    {
      id: 2,
      name: 'Reservation',
    },
    {
      id: 3,
      name: 'Follow Up',
    },
  ];
  const stats = [
    {
      value: '3.2k',
      label: 'Open',
      icon: <LockOpen className="text-purple-500" />,
    },
    {
      value: '1.8k',
      label: 'Pending',
      icon: <HourglassEmpty className="text-orange-500" />,
    },
    {
      value: '970',
      label: 'Re-assigned',
      icon: <Loop className="text-green-500" />,
    },
    {
      value: '5.4k',
      label: 'Closed',
      icon: <CheckCircle className="text-teal-500" />,
    },
  ];

  const ticketInitiators = [
    /**  {
        SYSTEM_USER,
        SELF_SERVICE,
        API_INTERGRATION,
        AGENT_ASSISTED
    } */

    {
      id: 0,
      name: 'System User',
    },
    {
      id: 1,
      name: 'Self Service',
    },
    {
      id: 2,
      name: 'API Integration',
    },
    {
      id: 3,
      name: 'Agent Assisted',
    },
  ];
  useEffect(() => {
    filterData();
  }, [selectedCategory, searchText]);

  const customIcons = {
    menu: `
      <svg style="width: 16px; height: 16px; opacity: 0.7; color: grey;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>`,
    filter: `
      <svg style="width: 16px; height: 16px; opacity: 0.7; color: grey;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>`,
  };

  // Customize AG Grid Theme with Custom Icons

  const gridOptions = {
    icons: customIcons,
    columnDefs,
    defaultColDef: {
      filter: true,
      editable: true,
    },
    rowData,
    sideBar: true,
  };

  const filteredColumnDefs = columnDefs.filter(
    (col) => col.field !== 'actions'
  );

  const updatedColumnDefs = [...filteredColumnDefs];

  const adjustedHandlers = {
    ...handlers,
    delete: () => {},
  };
  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);

  return (
    <div
      className={`${
        theme.palette.mode === 'dark'
          ? 'ag-theme-quartz-dark'
          : 'ag-theme-quartz'
      }`}
      style={{ height: 550, width: '100%' }}
    >
      <div className="pt-10 pb-4">
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            pb: 3,
            color: theme.palette.mode === 'dark' ? 'text.gray' : 'primary.main',
          }}
        >
          {title}
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white shadow rounded-xl p-6"
            >
              <div>
                <h3 className="text-xl font-bold text-primary">{stat.value}</h3>
                <p className="text-gray-500 text-lg mt-2">{stat.label}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Search and Filters Section */}
        {hasFilters && (
          <div>
            <div
              className={`${
                theme.palette.mode === 'dark' ? 'bg-dark-light' : 'bg-white'
              } p-6 shadow rounded-lg`}
            >
              <form className="flex items-center gap-8">
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
                    placeholder={`Search by ${columnDefs
                      .slice(0, 4)
                      .map((col) => col.headerName.toLowerCase())
                      .join(', ')} etc`}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border ${
                      theme.palette.mode === 'dark'
                        ? 'border-gray-600 bg-dark-light text-gray-300'
                        : 'border-gray-300 bg-white text-gray-700'
                    } rounded-full focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label
                    htmlFor="category"
                    className={`block text-sm font-medium ${
                      theme.palette.mode === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    Priority
                  </label>
                  <select
                    id="category"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      theme.palette.mode === 'dark'
                        ? 'border-gray-600 bg-dark-light text-gray-300'
                        : 'border-gray-300 bg-white text-gray-700'
                    } rounded-full focus:ring-blue-500 focus:border-blue-500`}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label
                    htmlFor="status"
                    className={`block text-sm font-medium ${
                      theme.palette.mode === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    TicketType
                  </label>
                  <select
                    id="status"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      theme.palette.mode === 'dark'
                        ? 'border-gray-600 bg-dark-light text-gray-300'
                        : 'border-gray-300 bg-white text-gray-700'
                    } rounded-full focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {ticketTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className={`block text-sm font-medium ${
                      theme.palette.mode === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    Ticket Initiator
                  </label>
                  <select
                    id="status"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      theme.palette.mode === 'dark'
                        ? 'border-gray-600 bg-dark-light text-gray-300'
                        : 'border-gray-300 bg-white text-gray-700'
                    } rounded-full focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {ticketTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <Button
                  sx={{
                    mt: 3,
                  }}
                  onClick={() => {
                    setOpenBaseCard(true);
                    setClickedItem(null);
                  }}
                  size="large"
                  variant="contained"
                  startIcon={<Add />}
                >
                  New
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      <AgGridReact
        columnDefs={columnDefs.map((col) => ({
          ...col,
          headerTooltip: col.headerName,
        }))}
        rowData={rowData}
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
  );
}

export default BaseCRMTable;
