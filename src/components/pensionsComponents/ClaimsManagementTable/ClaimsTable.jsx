"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Divider,
  Drawer,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Close,
  Delete,
  DeleteOutlineOutlined,
  Edit,
  EditOutlined,
  FilterAlt,
  FilterAltOutlined,
  FilterList,
  SortByAlpha,
} from "@mui/icons-material";
import "./ag-theme.css";

// Dummy data generator function
const generateDummyData = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      id: Math.floor(Math.random() * 1000000),
      dateCreated: new Date().toISOString().split("T")[0],
      contactId: `C${1000 + i}`,
      noValue: Math.floor(Math.random() * 1000),
      date: new Date().toISOString().split("T")[0],
      status: i % 2 === 0 ? "Active" : "Inactive",
      action: "View",
    });
  }
  return data;
};

const SchemaCellRenderer = ({ value }) => {
  return (
    <Box sx={{ display: "flex", p: 1, alignItems: "center", gap: 1 }}>
      <Avatar variant="rounded" sx={{ height: 28, width: 28 }} />
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "primary.main" }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const ActionCellRenderer = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
      <IconButton size="small" color="primary">
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" color="secondary">
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

const ClaimsTable = () => {
  const [dummyData, setDummyData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const [sortCriteria, setSortCriteria] = useState(0);

  useEffect(() => {
    setDummyData(generateDummyData());
  }, []);

  const columnDefs = [
    {
      headerName: "Schema",
      field: "schema",
      cellRenderer: SchemaCellRenderer,
      pinned: "left",
      width: 200,
      headerClass: "header-bold",
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: "Date Created",
      headerClass: "header-bold",
      field: "dateCreated",
      filter: true,
    },
    {
      headerName: "Contact",
      field: "contactId",
      headerClass: "header-bold",
      width: 120,
      filter: true,
    },
    {
      headerName: "Id",
      field: "id",
      headerClass: "header-bold",
      width: 120,
      filter: true,
    },
    {
      headerName: "Value",
      field: "noValue",
      headerClass: "header-bold",
      width: 120,
      filter: true,
    },
    {
      headerName: "Date",
      field: "date",
      width: 150,
      headerClass: "header-bold",
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      headerClass: "header-bold",
      width: 120,
      filter: true,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: ActionCellRenderer,
      width: 140,
      headerClass: "header-bold",
    },
  ];

  const defaultColDef = {
    sortable: true,
  };
  const rowData = dummyData.map((row) => ({
    schema: `Agile/${row.id}`,
    dateCreated: row.dateCreated,
    contactId: row.contactId,
    id: row.id,
    noValue: row.noValue,
    date: row.date,
    status: row.status,
    action: row.action,
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const exportData = () => {
    gridApi.exportDataAsCsv();
  };

  return (
    <div className="table-container relative h-[80vh] w-full">
      <div className="h-full w-full">
        <div className="flex justify-between flex-row mt-2">
          <div className="flex gap-2 items-center pl-3">
            <div className="flex items-center">
              <Button sx={{ mb: -1, maxHeight: "25px" }}>
                <IconButton>
                  <Add sx={{ fontSize: "20px" }} color="primary" />
                </IconButton>
                <p className="font-medium text-gray -ml-2 text-sm">Create</p>
              </Button>
            </div>
            <div className="flex items-center">
              <Button sx={{ mb: -1, maxHeight: "24px" }}>
                <IconButton>
                  <EditOutlined sx={{ fontSize: "20px" }} color="primary" />
                </IconButton>
                <p className="font-medium text-gray -ml-2 text-sm">Edit</p>
              </Button>
            </div>
            <div className="flex items-center">
              <Button sx={{ mb: -1, maxHeight: "24px" }}>
                <IconButton>
                  <DeleteOutlineOutlined
                    sx={{ fontSize: "20px" }}
                    color="primary"
                  />
                </IconButton>
                <p className="font-medium text-gray -ml-2 text-sm">View</p>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2 ml-2">
              <Button onClick={() => exportData()} sx={{ maxHeight: "25px" }}>
                <img
                  src="/excel.png"
                  alt="Open in Excel"
                  height={20}
                  width={20}
                />
                <p className="font-medium text-gray text-sm ">Open in Excel</p>
              </Button>
              <div className="">
                <IconButton
                  onClick={() =>
                    setOpenFilter((prevOpenFilter) => !prevOpenFilter)
                  }
                >
                  <Tooltip title="filter items" placement="top">
                    <FilterAlt sx={{ color: "primary.main" }} />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          </div>

          <div className="absolute right-12">
            <Button variant="contained" className="flex gap-1">
              <Add />
              Add New
            </Button>
          </div>
        </div>
        <Divider sx={{ mt: 1, mb: 1 }} />

        <div className="flex">
          {/* Custom Drawer */}
          <Collapse
            in={openFilter}
            sx={{
              bgcolor: "white",
              mt: 2,
              borderRadius: "10px",
              color: "black",
              borderRadius: "10px",
            }}
            timeout="auto"
            unmountOnExit
          >
            <div className="h-[100%] bg-white w-[300px] rounded-md p-3 ">
              <p className="text-md font-medium text-primary p-3">Filter By:</p>
              <Divider sx={{ px: 2 }} />
              <div className="p-3">
                <label className="text-xs font-semibold text-gray-600">
                  Keyword
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="border p-2 bg-gray-100 border-gray-300 rounded-md  text-sm"
                    required
                  />

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
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem>Equal</MenuItem>
                <MenuItem>Contains</MenuItem>
                <MenuItem>Not Equal</MenuItem>
              </Menu>
              <Divider />
              <div className="flex flex-col item-center p-4 mt-3">
                <label className="text-xs font-semibold text-gray-600">
                  Select Column
                </label>
                <select
                  name="role"
                  //value={selectedRole}
                  //onChange={(e) => setSelectedRole(e.target.value)}
                  className="border p-3 bg-gray-100 border-gray-300 rounded-md  text-sm mr-7"
                  required
                >
                  <option value="Board Member">All</option>
                  <option value="Admin">Id</option>
                  <option value="Business Admin">Email Address</option>
                  <option value="Support">Full Name</option>
                </select>
              </div>
              <div className="flex flex-col item-center p-4 mt-3">
                <label className="text-xs font-semibold text-gray-600 w-[100%]">
                  Sort By:
                </label>
                <div className="flex items-center ">
                  {" "}
                  <select
                    name="role"
                    //value={selectedRole}
                    //onChange={(e) => setSelectedRole(e.target.value)}
                    className="border p-3 bg-gray-100 border-gray-300 rounded-md w-[100%]  text-sm "
                    required
                  >
                    <option value="Board Member">All</option>
                    <option value="id">Id</option>
                    <option value="email_address">Email Address</option>
                    <option value="fullName">Full Name</option>
                  </select>
                  <Tooltip
                    title={
                      sortCriteria === 1 ? "Ascending Order" : "Desceding Order"
                    }
                    placement="top"
                  >
                    <IconButton
                      sx={{ mr: "-10px", ml: "-4px" }}
                      onClick={() => {
                        setSortCriteria(sortCriteria === 1 ? 2 : 1);
                      }}
                    >
                      <SortByAlpha />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <Button
              variant="contained"
              sx={{ ml: 2, width: "80%", mr: 2, mt: "-4" }}
            >
              Apply Filters
            </Button>
          </Collapse>
          <div
            className="ag-theme-quartz"
            style={{
              height: "80vh",
              padding: "20px",
              width: openFilter ? "calc(100vw - 300px)" : "100vw",
            }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              frameworkComponents={{
                schemaCellRenderer: SchemaCellRenderer,
              }}
              defaultColDef={defaultColDef}
              paginationPageSize={10}
              rowSelection="multiple"
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsTable;
