"use client";
import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { colDefsDataCharts, rowDataCharts } from "../chartsData/ChartsData";

const flattenData = (data, level = 0) =>
  data.flatMap((item) => [
    { ...item, level },
    ...(item.children ? flattenData(item.children, level + 1) : []),
  ]);

// Flatten the data
const flattenedData = flattenData(rowDataCharts);

const IndentCellRenderer = (params) => {
  // Determine the row level based on the node's depth
  const level = params.node.depth;

  // Apply indentation and styling based on the level
  const style = {
    paddingLeft: `${level * 20}px`, // Adjust indentation as needed
    fontWeight: level > 0 ? "bold" : "normal",
  };

  return <div style={style}>{params.value}</div>;
};
function ChartsOfAccountsList() {
  const gridOptions = useMemo(() => {
    return {
      components: {
        indentCellRenderer: IndentCellRenderer, // Register the component with a name
      },
    };
  }, []);

  const columnDefs = colDefsDataCharts.map((colDef) => ({
    ...colDef,
    // Use cellRenderer to apply the custom renderer
    cellRenderer: "indentCellRenderer",
  }));

  return (
    <div className="ag-theme-quartz" style={{ height: "100vh", width: "99%" }}>
      <AgGridReact
        rowData={flattenedData}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
      />
    </div>
  );
}

export default ChartsOfAccountsList;
