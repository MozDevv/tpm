"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import "./pensionAwards.css";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "prefix",
    headerName: "Prefix",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "start_date",
    headerName: "Start Date",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "end_date",
    headerName: "End Date",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "pensionCap",
    headerName: "Pension Cap",
    headerClass: "prefix-header",
    filter: true,
  },
];
function PensionAwards() {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page

  useEffect(() => {
    fetchData();
  }, [pageNumber]); // Fetch data whenever pageNumber changes

  const fetchData = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards, {
        paging: { pageNumber, pageSize },
      });
      const { data, totalCount } = res.data;
      const transformedData = transformData(data);
      setRowData(transformedData);
      setTotalRecords(totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1 + (pageNumber - 1) * pageSize,
      prefix: transformString(item.prefix),
      name: item.name,
      description: transformString(item.description),
      start_date: item.start_date,
      end_date: item.end_date,
      pensionCap: item.pensionCap.name,
    }));
  };

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const handlePaginationChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  return (
    <div className="ag-theme-quartz" style={{ height: "75vh", width: "98%" }}>
      <div className="p-3 mb-4">
        <p className="font-semibold text-[25px] text-primary">Pension Awards</p>
        <p className="text-gray-500 text-sm mt-2">
          List of available pension awards
        </p>
      </div>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        domLayout="autoHeight"
        paginationPageSize={pageSize}
        onPaginationChanged={(params) =>
          handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
        }
        onGridReady={onGridReady}
      />
    </div>
  );
}

export default PensionAwards;
