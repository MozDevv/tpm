"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import endpoints, { apiService } from "@/components/services/setupsApi";

import { Button, Checkbox, Dialog, MenuItem, TextField } from "@mui/material";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
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
    field: "created_date",
    headerName: "Created Date",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "roles",
    headerName: "Roles",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
];
function TablesSetups() {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [departments, setDepartments] = useState([]); // [1]
  const pageSize = 10; // Number of records per page

  useEffect(() => {
    fetchData();
  }, [pageNumber]); // Fetch data whenever pageNumber changes

  const fetchData = async () => {
    try {
      const res = await apiService.get(endpoints.getTables, {
        paging: { pageNumber, pageSize },
      });
      const { data, totalCount } = res.data;
      //setDepartments(data);
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
      id: item.tableId,
      name: item.name,
      description: transformString(item.description),
      created_date: item.created_date,
      roles: item.roles,
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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openCreateDepartment, setOpenCreateDepartment] = useState(false);

  const handleCreateDepartment = () => {
    setOpenCreateDepartment(true);
  };

  const createDepartment = async () => {
    if (name === "" || description === "") {
      return;
    }
    try {
      const res = await apiService.post(endpoints.createDepartment, {
        name: name,
        description: description,
        // roles: roles,
      });

      if (res.status === 201) {
        setOpenCreateDepartment(false);
        fetchData();
      }
      console.log("res", res);
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: "75vh", width: "98%" }}>
      <>
        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              padding: "40px",
              maxWidth: "500px",
              width: "100%",
            },
          }}
          open={openCreateDepartment}
          onClose={() => setOpenCreateDepartment(false)}
        >
          <div className="flex w-full justify-between max-h-8 mb-3">
            {" "}
            <p className="text-base text-primary font-semibold mb-5">Setups</p>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={createDepartment}
            >
              <p className="text-xs">Create Department</p>
            </Button>
          </form>
        </Dialog>
        <div className="p-3 mb-4 flex justify-between items-center">
          <div className="">
            {" "}
            <p className="font-semibold text-[25px] text-primary">Tables</p>
            <p className="text-gray-500 text-sm mt-2">
              List of all current Tables
            </p>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateDepartment}
            sx={{ maxHeight: "40px" }}
          >
            Create Department
          </Button>
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
    </div>
  );
}

export default TablesSetups;
