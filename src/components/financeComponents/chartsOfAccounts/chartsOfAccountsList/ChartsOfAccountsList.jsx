"use client";
import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { colDefsDataCharts, rowDataCharts } from "../chartsData/ChartsData";

const flattenData = (data, level = 0) =>
  data.flatMap((item) => [
    { ...item, level },
    ...(item.children ? flattenData(item.children, level + 1) : []),
  ]);

// Flatten the data
const flattenedData = flattenData(rowDataCharts);

const IndentCellRenderer = ({ value, data }) => (
  <div
    style={{
      paddingLeft: `${data.level * 40}px`,
      fontWeight: data.children ? "bold" : "normal",
    }}
  >
    {value}
  </div>
);

function ChartsOfAccountsList() {
  const frameworkComponents = {
    indentCellRenderer: IndentCellRenderer,
  };

  const adjustedColumnDefs = colDefsDataCharts.map((colDef) => ({
    ...colDef,
    headerComponent: "indentCellRenderer", // Use the registered component name
  }));

  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={flattenedData}
        columnDefs={adjustedColumnDefs}
        frameworkComponents={frameworkComponents}
      />
    </div>
  );
}

export default ChartsOfAccountsList;
