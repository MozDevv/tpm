import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FilterList, SortByAlpha } from "@mui/icons-material";
import CustomBreadcrumbsList from "../CustomBreadcrumbs/CustomBreadcrumbsList";
import ListNavigation from "./ListNavigation";

const BaseTable = ({
  columnDefs,
  fetchApiService,
  fetchApiEndpoint,
  pageSize = 10,
  handlers,
  breadcrumbTitle,
  currentTitle,
  setClickedItem,
  setOpenBaseCard,
  openAction,
  transformData,
  refreshData,
  openBaseCard,
}) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("EQUAL");
  const [sortColumn, setSortColumn] = useState("");
  const [sortCriteria, setSortCriteria] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const fetchData = async (sort, filter) => {
    try {
      const res = await fetchApiService(fetchApiEndpoint, {
        "paging.pageNumber": pageNumber,
        "paging.pageSize": pageSize,
        ...sort,
        ...filter,
      });

      const { data, totalCount, totalPages } = res.data;

      const transformedData = transformData(data);
      setRowData(transformedData);
      setTotalRecords(totalCount);
      setTotalPages(totalPages);

      console.log("Data fetched successfully:", transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Consolidated useEffect hook to avoid multiple calls
  useEffect(() => {
    fetchData();
  }, [openBaseCard, openAction]);

  const handlePaginationChange = (newPageNumber) => {
    if (pageNumber !== newPageNumber) {
      setPageNumber(newPageNumber);
      fetchData();
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
  };

  const exportToExcel = () => {
    gridApiRef.current.api.exportDataAsCsv();
  };

  const adjustedHandlers = {
    ...handlers,
    filter: () => setOpenFilter(!openFilter),
    openInExcel: () => exportToExcel(),
  };

  const handleFilters = async () => {
    const filter = {
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
      ...(sortColumn && { "sortProperties.propertyName": sortColumn }),
      ...(sortCriteria !== 0 && {
        "sortProperties.sortCriteria": sortCriteria,
      }),
    };

    await fetchData(sort, filter);
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
            {breadcrumbTitle}
          </h6>
          <CustomBreadcrumbsList currentTitle={currentTitle} />
          <div className="w-[80vw]">
            <ListNavigation handlers={adjustedHandlers} />
          </div>
        </Box>
      </Box>
      <div className="flex gap-2">
        <Collapse
          in={openFilter}
          sx={{
            bgcolor: "white",
            mt: 2,
            borderRadius: "10px",
            color: "black",
            borderRadius: "10px",
          }}
          timeout="auto"
          unmountOnExit
        >
          <div className="h-[100%] bg-white w-[300px] rounded-md p-3 ">
            {/* Filter UI */}
          </div>
          <Button
            variant="contained"
            sx={{ ml: 2, width: "80%", mr: 2, mt: "-4" }}
            onClick={handleFilters}
          >
            Apply Filters
          </Button>
        </Collapse>
        <div
          className="ag-theme-quartz"
          style={{
            height: "75vh",
            marginTop: "20px",
            width: openFilter ? "calc(100vw - 500px)" : "90vw",
          }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            domLayout="autoHeight"
            paginationPageSize={pageSize}
            onGridReady={onGridReady}
            onPaginationChanged={(params) => {
              const newPageNumber = params.api.paginationGetCurrentPage() + 1;
              handlePaginationChange(newPageNumber);
            }}
            onRowClicked={(e) => {
              setOpenBaseCard(true);
              setClickedItem(e.data);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BaseTable;
