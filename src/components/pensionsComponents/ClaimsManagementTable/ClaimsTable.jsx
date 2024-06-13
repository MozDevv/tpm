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
  TextField,
  InputAdornment,
  Button,
  Divider,
} from "@mui/material";
import "./ag-theme.css";
import {
  Add,
  Create,
  Delete,
  DeleteOutlineOutlined,
  Edit,
  EditOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { fi } from "@faker-js/faker";

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

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const exportData = () => {
    gridApi.exportDataAsCsv();
  };

  return (
    <div className="h-[100%]  w-[100%]">
      <div className="flex justify-between flex-row mt-2">
        <div className="flex gap-3 items-center pl-3">
          <div className="flex items-center">
            <Button sx={{ mb: -1, maxHeight: "24px" }}>
              <IconButton>
                <Add sx={{ fontSize: "20px" }} color="primary" />
              </IconButton>
              <p className="font-normal text-black -ml-2 text-sm">Create</p>
            </Button>
          </div>
          <div className="flex items-center">
            <Button sx={{ mb: -1, maxHeight: "24px" }}>
              <IconButton>
                <EditOutlined sx={{ fontSize: "20px" }} color="primary" />
              </IconButton>
              <p className="font-normal text-black -ml-2 text-sm">Edit</p>
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
              <p className="font-normal text-black -ml-2 text-sm">View</p>
            </Button>
          </div>
          <div className="flex items-center gap-1 mt-2 ml-2">
            <Button onClick={() => exportData()} sx={{ maxHeight: "25px" }}>
              <img
                src="/excel.png"
                alt="Open in Excel"
                height={20}
                width={20}
              />
              <p className="font-normal text-sm text-black">Open in Excel</p>
            </Button>
          </div>
        </div>
        <div className="absolute right-12">
          <Button variant="contained" className="flex gap-1">
            <Add />
            Add New
          </Button>
        </div>
      </div>
      <Divider sx={{ mt: 2, mb: 1 }} />
      <div
        className="ag-theme-quartz"
        style={{ height: "80%", padding: "20px", width: "80vw" }}
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
  );
};

export default ClaimsTable;
