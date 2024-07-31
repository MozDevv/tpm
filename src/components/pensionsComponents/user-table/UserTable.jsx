import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { Box, Button } from "@mui/material";
import Link from "next/link";
import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import { Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import ListNavigation from "@/components/baseComponents/ListNavigation";

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

  const handleFilters = async () => {
    const filter = status
      ? {
          "filterCriterion.criterions[0].propertyName": "notification_status",
          "filterCriterion.criterions[0].propertyValue": status,
          "filterCriterion.criterions[0].criterionType": 0,
        }
      : {
          ...(filterColumn && {
            "filterCriterion.criterions[0].propertyName": filterColumn,
          }),
          ...(filterValue && {
            "filterCriterion.criterions[0].propertyValue": filterValue,
          }),
          ...(filterType && {
            "filterCriterion.criterions[0].criterionType": filterType,
          }),
        };
    const sort = {
      ...(sortColumn && {
        "sortProperties.propertyName": sortColumn,
      }),
      ...(sortCriteria !== 0 && {
        "sortProperties.sortCriteria": sortCriteria,
      }),
    };

    await fetchData(sort, filter);
  };

  const fetchData = async (sort, filter) => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers, {
        "paging.pageNumber": pageNumber,
        "paging.pageSize": pageSize,
        ...sort,
        ...filter,
      });
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

  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => exportData(),
    // create: () => router.push("/pensions/preclaims/listing/new"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => setOpenNotification(true),
  };
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    // fetchAllPreclaims();

    setGridApi(params.api);
    gridApiRef.current = params;
    //  params.api.sizeColumnsToFit();
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: "1px", flexDirection: "column" }}>
          <h6
            style={{
              fontSize: "20px",
              color: "#006990",
              fontWeight: 700,
              marginTop: "20px",
              marginLeft: "15px",
              marginBottom: "-10px",
            }}
          >
            User Management
          </h6>
          <CustomBreadcrumbsList currentTitle="Manage Users" />
          <div className="w-[80vw]">
            <ListNavigation handlers={handlers} />
          </div>
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
            onGridReady(params);
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
