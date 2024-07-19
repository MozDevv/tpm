import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { Box, Button } from "@mui/material";
import Link from "next/link";
import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import { Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const columnDefs = [
  { field: "no", headerName: "No", width: 90, filter: true },
  { field: "userName", headerName: "Email", filter: true, width: 200 },
  {
    field: "employeeNumber",
    headerName: "Employee Number",
    filter: true,
    width: 150,
  },
  { field: "email", headerName: "Email", filter: true, width: 250 },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    filter: true,
    width: 150,
  },
  {
    field: "roleId",
    headerName: "Role ID",
    filter: true,
    width: 250,
    hide: true,
  },

  {
    field: "defaultPasswordChanged",
    headerName: "Default Password Changed",
    filter: true,
    width: 200,
  },
];

function SimplifiedTable() {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 30; // Number of records per page

  const router = useRouter();

  const [userClicked, setUserClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pageNumber]); // Fetch data whenever pageNumber changes

  const fetchData = async () => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers);
      const { data, totalCount } = res.data;

      console.log("Users", data);
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
      id: item.id,
      userName: item.userName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      roleId: item.roleId,
      employeeNumber: item.employeeNumber,
      defaultPasswordChanged: item.defaultPasswordChanged ? "Yes" : "No",
    }));
  };

  const handlePaginationChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleClickUser = (user) => {
    router.push(`/pensions/users/user-info?id=${user.id}`);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{ display: "flex", gap: "6px", flexDirection: "column", mb: 1 }}
        >
          <h6 style={{ fontSize: "20px", color: "#006990", fontWeight: 700 }}>
            User Management
          </h6>
          <h6 style={{ fontSize: "12px", color: "gray", mb: 1 }}>
            Manage all your users in one place
          </h6>
        </Box>
        <Link href="/pensions/users/newUser">
          <Button
            //onClick={() => setDrawerOpen(true)}
            variant="contained"
            size="small"
            sx={{ mr: 4, mt: 3 }}
            startIcon={<Person />}
          >
            Add new User
          </Button>
        </Link>
      </Box>
      <div className="ag-theme-quartz" style={{ height: "75vh", width: "98%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={false}
          domLayout="autoHeight"
          paginationPageSize={pageSize}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
          onPaginationChanged={(params) =>
            handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
          }
          onRowClicked={(e) => {
            setUserClicked(e.data);
            handleClickUser(e.data);
            console.log(e.data);
          }}
        />
      </div>
    </div>
  );
}

export default SimplifiedTable;
