"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../pensionAwards/pensionAwards.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Box, Button, Collapse, Dialog, Pagination } from "@mui/material";
import CreateNewMDA from "./CreateNewMDA";
import OpenMda from "./OpenMda";
const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
    hide: true,
  },
  {
    field: "code",
    headerName: "Code",
    headerClass: "prefix-header",
    width: 200,
    filter: true,
  },
  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "employerType",
    headerName: "Employer Type",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "shortName",
    headerName: "Short Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "pensionCap",
    headerName: "Pension Cap",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];
function MDAs() {
  const [rowData, setRowData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 18;
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchMDAs = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        "paging.pageNumber": pageNumber,
        "paging.pageSize": pageSize,
      });
      const rawData = res.data.data;

      setTotalPages(res.data.totalPages);

      console.log("first", res.data.data);
      setTotalRecords(res.data.totalCount);
      const groupedRowData = rawData.map((item, index) => ({
        no: index + 1,
        code: item?.code,
        name: item?.name,
        employerType: item?.employer_type === 0 ? "Ministry" : "Department",
        description: item?.description,
        shortName: item?.short_name,
        pensionCapId: item?.pensionCap.id,
        id: item?.id,
        pensionCap: item?.pensionCap.name,
      }));
      setRowData(groupedRowData); // Use setRowData instead of applyTransaction
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMDAs();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit(); // Autosize columns to fit grid width
  };

  const [openNewMDA, setOpenNewMDA] = useState(false);

  const [mdaClicked, setMdaClicked] = useState(false);

  const [rowDataClicked, setRowDataClicked] = useState({});
  return (
    <div className="mt-5">
      <Dialog
        open={openNewMDA}
        onClose={() => setOpenNewMDA(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "50%",
            // height: "70%",
            maxHeight: "80%",
          },
        }}
      >
        <CreateNewMDA fetchMDAs={fetchMDAs} setOpenNewMDA={setOpenNewMDA} />
      </Dialog>

      {mdaClicked && (
        <>
          <OpenMda
            rowClicked={rowDataClicked}
            mdaClicked={mdaClicked}
            setMdaClicked={setMdaClicked}
          />
        </>
      )}
      <>
        <div className="mb-2">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenNewMDA(true)}
          >
            Add new
          </Button>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex">
            <div
              className="ag-theme-quartz h-[70vh]  pr-5 mt-5 w-full "
              // style={{ width: openNewMDA ? "calc(100vw - 350px)" : "100vw" }}
            >
              <AgGridReact
                domLayout="autoHeight"
                rowData={rowData}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                onRowClicked={(e) => {
                  setMdaClicked(true);
                  setRowDataClicked(e.data);
                }}
              />
            </div>
          </div>{" "}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </div>
      </>
    </div>
  );
}

export default MDAs;
