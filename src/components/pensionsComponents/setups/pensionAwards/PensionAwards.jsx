"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import endpoints, { apiService } from "@/components/services/setupsApi";

import { Button, Checkbox, Dialog, MenuItem, TextField } from "@mui/material";
import MapPensionerAwards from "./MapPensionerAwards";
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
  const [openAward, setOpenAward] = useState(false);
  const [rowClicked, setRowClicked] = useState();

  const [required, setRequired] = useState(false);

  const [documentTypes, setDocumentTypes] = useState([]); // [1]

  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes);

      console.log(res.data.data);

      setDocumentTypes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: "75vh", width: "98%" }}>
      {openAward ? (
        <MapPensionerAwards />
      ) : (
        <>
          <Dialog
            sx={{
              "& .MuiDialog-paper": {
                padding: "40px",
                maxWidth: "500px",
                width: "100%",
              },
            }}
            open={openAward}
            onClose={() => setOpenAward(false)}
          >
            <div className="flex w-full justify-between max-h-8 mb-3">
              {" "}
              <p className="text-base text-primary font-semibold mb-5">
                Pension Award
              </p>
              <Button variant="contained" color="primary">
                <p className="text-xs"> Map to Document Type</p>
              </Button>
            </div>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="end_date"
                  name="end_date"
                  value={rowClicked?.name}
                  // onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="end_date"
                  name="end_date"
                  value={rowClicked?.description}
                  // onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end_date"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Pension Cap
                </label>
                <input
                  type="text"
                  id="end_date"
                  name="end_date"
                  value={rowClicked?.pensionCap}
                  // onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-xs font-medium text-gray-700"
                >
                  Pension Award
                </label>

                <TextField
                  select
                  variant="outlined"
                  size="small"
                  fullWidth
                  // name="extension"
                  value={documentTypes}
                  onChange={(e) => setDocumentTypes(e.target.value)}
                  className="mt-1 block w-full  rounded-md border-gray-400"
                >
                  <MenuItem value="none">Select Terms of Service</MenuItem>
                  {Array.isArray(documentTypes) &&
                    documentTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                  <label className="block text-xs font-medium text-gray-700">
                    Required
                  </label>
                  <Checkbox checked={required} color="primary" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <label className="block text-xs font-medium text-gray-700">
                    Pensioner Upload
                  </label>
                  <Checkbox checked={required} color="primary" />
                </div>
              </div>
            </form>
          </Dialog>
          <div className="p-3 mb-4">
            <p className="font-semibold text-[25px] text-primary">
              Pension Awards
            </p>
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
            onRowClicked={(e) => {
              setOpenAward(true);
              setRowClicked(e.data);
              console.log(e.data);
            }}
            onGridReady={onGridReady}
          />
        </>
      )}
    </div>
  );
}

export default PensionAwards;
