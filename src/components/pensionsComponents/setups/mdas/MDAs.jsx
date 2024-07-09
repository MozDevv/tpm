"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../pensionAwards/pensionAwards.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button, Collapse, Dialog } from "@mui/material";
import CreateNewMDA from "./CreateNewMDA";
import OpenMda from "./OpenMda";
const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
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
    field: "description",
    headerName: "Description",
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

  const fetchMDAs = async () => {
    try {
      const res = await apiService.get(endpoints.mdas);
      const rawData = res.data.data;
      const groupedRowData = rawData.map((item, index) => ({
        no: index + 1,
        code: item?.code,
        name: item?.name,
        description: item?.description,
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

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit(); // Autosize columns to fit grid width
  };

  const [openNewMDA, setOpenNewMDA] = useState(false);

  const [mdaClicked, setMdaClicked] = useState(false);

  const [rowDataClicked, setRowDataClicked] = useState({});
  return (
    <div className="mt-5">
      <div className=" bg-white  rounded-md p-3 ">
        <Dialog
          open={openNewMDA}
          onClose={() => setOpenNewMDA(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: "50%",
              height: "80%",
              maxHeight: "80%",
            },
          }}
        >
          <CreateNewMDA fetchMDAs={fetchMDAs} setOpenNewMDA={setOpenNewMDA} />
        </Dialog>
      </div>
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
        <div className="flex">
          <div
            className="ag-theme-quartz  h-[95vh] pr-5 mt-5 w-full "
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
          <div className="flex h-[80vh]"></div>
        </div>{" "}
      </>
    </div>
  );
}

export default MDAs;
