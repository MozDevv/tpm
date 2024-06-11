"use client";
import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { rowDataDummy } from "./colDefsData";
import { Dialog, Typography } from "@mui/material";
import "./ag-theme.css";
import OpenReciept from "./OpenReciept";

const NumberComponent = (p) => {
  return (
    <>
      <p className="mt-1 cursor-pointer items-center text-sm font-semibold text-primary">
        {p.value}
      </p>
    </>
  );
};

export const colDefsData = [
  {
    field: "no",
    cellRenderer: NumberComponent,
    headerClass: "header-bold",
    pinned: "left",
    width: 90,
  },
  { field: "date", headerClass: "header-bold" },
  { field: "paymentNarration", headerClass: "header-bold" },
  { field: "paymode", headerClass: "header-bold" },
  { field: "checkNumber", headerClass: "header-bold" },
  { field: "recievedFrom", headerClass: "header-bold" },
  { field: "createdBy", headerClass: "header-bold" },
  { field: "postedBy", headerClass: "header-bold" },
  { field: "postedDate", headerClass: "header-bold" },
];

function CuesTable() {
  const [colDefs, setColDefs] = useState(colDefsData);
  const [rowData, setRowData] = useState(rowDataDummy);

  const [openDialog, setOpenDialog] = useState(false);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
    };
  }, []);

  const handleCellClicked = (params) => {
    if (params.colDef.field === "no") {
      setOpenDialog(true);
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: "75%" }}>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            margin: 0,
            width: "80vw",
            height: "100vh",
            padding: "50px",
            outline: "none",
          },
        }}
      >
        <OpenReciept />
      </Dialog>
      <AgGridReact
        defaultColDef={defaultColDef}
        rowData={rowData}
        columnDefs={colDefs}
        onCellClicked={handleCellClicked}
      />
    </div>
  );
}

export default CuesTable;
