"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Avatar, Typography, Box, IconButton } from "@mui/material";
import "./ag-theme.css";
import { Create, Delete, Edit } from "@mui/icons-material";

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
    <Box sx={{ display: "flex", justifyContent: "center", gap: "3px" }}>
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
    },
    {
      headerName: "Date Created",
      headerClass: "header-bold",
      field: "dateCreated",
    },
    {
      headerName: "Contact",
      field: "contactId",
      headerClass: "header-bold",
      width: 120,
    },
    { headerName: "Id", field: "id", headerClass: "header-bold", width: 120 },
    {
      headerName: "Value",
      field: "noValue",
      headerClass: "header-bold",
      width: 120,
    },
    {
      headerName: "Date",
      field: "date",
      width: 150,
      headerClass: "header-bold",
    },
    {
      headerName: "Status",
      field: "status",
      headerClass: "header-bold",
      width: 120,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: ActionCellRenderer,
      width: 140,
      headerClass: "header-bold",
    },
  ];

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

  return (
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
        paginationPageSize={10}
      />
    </div>
  );
};

export default ClaimsTable;
