import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Pagination,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import ListNavigation from "@/components/baseComponents/ListNavigation";
import { useRouter } from "next/navigation";
import { FilterList, SortByAlpha } from "@mui/icons-material";
import BaseCard from "./BaseCard";
import { useSearch } from "@/context/SearchContext";
import BaseLoadingOverlay from "./BaseLoadingOverlay";

const BaseTable = ({
  columnDefs,
  fetchApiService,
  fetchApiEndpoint,
  pageSize = 100,
  handlers,
  breadcrumbTitle,
  currentTitle,
  setClickedItem,
  setOpenBaseCard,
  openAction,
  transformData,
  refreshData,
  openBaseCard,
  isSecondaryTable,
  isMaintenance,
  id,
  openSubGroup,
  onSelectionChange,
  openPostToGL,
}) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [userClicked, setUserClicked] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState(2);
  const [sortColumn, setSortColumn] = useState("");
  const [sortCriteria, setSortCriteria] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [totalPages, setTotalPages] = useState(1);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const adjustedHandlers = {
    ...handlers,
    filter: () => setOpenFilter(!openFilter),
    openInExcel: () => exportToExcel(),
  };

  const router = useRouter();
  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    fetchData();
  }, [pageNumber, openBaseCard, openAction, openPostToGL]);

  const handleFilters = async () => {
    const filter = {
      ...(filterColumn && {
        "filterCriterion.criterions[0].propertyName": filterColumn,
      }),
      ...(filterValue && {
        "filterCriterion.criterions[0].propertyValue": filterValue,
      }),
      ...(filterType
        ? {
            "filterCriterion.criterions[0].criterionType": filterType,
          }
        : {
            "filterCriterion.criterions[0].criterionType": 2,
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

    await fetchData(filter);
  };

  const fetchData = async (filter) => {
    console.log("fetchData called", fetchApiEndpoint);
    try {
      let res;
      res = await fetchApiService(fetchApiEndpoint, {
        "paging.pageNumber": pageNumber,
        "paging.pageSize": 10,
        ...filter,
      });
      const { data, totalCount, totalPages } = res.data;

      const transformedData = transformData(data);

      setRowData(transformedData);
      setTotalRecords(totalCount);
      setTotalPages(totalPages);

      console.log("Data fetched successfully:", transformedData);
    } catch (error) {
      console.log("", error);

      console.error("Error fetching data:", error.response);
    }
  };

  const resetFilters = () => {
    setFilterColumn("");
    setFilterValue("");
    setFilterType(2);
    setSortColumn("");
    //setSortCriteria(1);
    fetchData();
  };

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    if (onSelectionChange) {
      onSelectionChange(selectedData);
    }
  };

  const handlePaginationChange = (e, newPage) => {
    console.log("newPage", newPage);
    console.log("***********************");
    console.log("e", e);
    setPageNumber(newPage);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };
  const exportToExcel = () => {
    gridApi.exportDataAsCsv();
  };

  const { searchedKeyword, setSearchedKeyword } = useSearch();
  const [filteredData, setFilteredData] = useState(rowData);

  const applyKeywordFilter = () => {
    if (!searchedKeyword) {
      setFilteredData(rowData);
      return;
    }

    const lowercasedKeyword = searchedKeyword.toLowerCase();

    const filtered = rowData.filter((row) =>
      Object.values(row).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(lowercasedKeyword)
      )
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    // Apply keyword filter when searchedKeyword changes
    applyKeywordFilter();
  }, [rowData, searchedKeyword]);

  useEffect(() => {
    if (openSubGroup) {
      fetchData();
    }
  }, [openSubGroup]);

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "Loading..." };
  }, []);

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
            <ListNavigation
              handlers={!isSecondaryTable ? adjustedHandlers : handlers}
            />
          </div>
        </Box>
      </Box>
      <div className="flex gap-2">
        {" "}
        <Collapse
          in={openFilter}
          sx={{
            bgcolor: "white",
            mt: 2,
            borderRadius: "10px",
            color: "black",
            borderRadius: "10px",
            // maxHeight: "70vh",
          }}
          timeout="auto"
          unmountOnExit
        >
          <div className="h-[100%] bg-white w-[300px] rounded-md p-3 ">
            <p className="text-md font-medium text-primary p-3">Filter By:</p>
            <Divider sx={{ px: 2 }} />
            <div className="p-3">
              <label className="text-xs font-semibold text-gray-600">
                Keyword
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="border p-2 bg-gray-100 border-gray-300 rounded-md  text-sm"
                  required
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />

                <IconButton onClick={handleClick}>
                  <FilterList />
                </IconButton>
              </div>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value={0}>Equal</MenuItem>
              <MenuItem value={1}>Contains</MenuItem>
              <MenuItem value={2}>Not Equal</MenuItem>
            </Menu>
            <Divider />
            <div className="flex flex-col item-center p-4 mt-3">
              <label className="text-xs font-semibold text-gray-600">
                Select Column
              </label>
              <select
                name="role"
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="border p-3 bg-gray-100 border-gray-300 rounded-md  text-sm mr-7"
                required
              >
                {columnDefs.map((col) => (
                  <option value={col.field}>{col.headerName}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col item-center p-4 mt-3">
              <label className="text-xs font-semibold text-gray-600 w-[100%]">
                Sort By:
              </label>
              <div className="flex items-center ">
                {" "}
                <select
                  name="role"
                  value={sortColumn}
                  onChange={(e) => setSortColumn(e.target.value)}
                  className="border p-3 bg-gray-100 border-gray-300 rounded-md w-[100%]  text-sm "
                  required
                >
                  {columnDefs.map((col) => (
                    <option value={col.field}>{col.headerName}</option>
                  ))}
                </select>
                <Tooltip
                  title={
                    sortCriteria === 1 ? "Ascending Order" : "Desceding Order"
                  }
                  placement="top"
                >
                  <IconButton
                    sx={{ mr: "-10px", ml: "-4px" }}
                    onClick={() => {
                      setSortCriteria(sortCriteria === 1 ? 2 : 1);
                    }}
                  >
                    <SortByAlpha />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            sx={{ ml: 2, width: "80%", mr: 2, mt: "-24px" }}
            onClick={handleFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2, width: "80%", mr: 2, mt: 2 }}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Collapse>
        <div className="flex justify-around flex-col">
          <div
            className="ag-theme-quartz"
            style={{
              height: "65vh",

              maxHeight: "85%",
              overflowY: "auto",
              width: openFilter ? "calc(100vw - 500px)" : "80vw",
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={filteredData}
              pagination={false}
              domLayout="autoHeight"
              alwaysShowHorizontalScroll={true}
              // alwaysShowVerticalScroll={true}

              loadingOverlayComponent={BaseLoadingOverlay} // Use your custom loader
              loadingOverlayComponentParams={loadingOverlayComponentParams}
              // paginationPageSize={pageSize}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
                onGridReady(params);
                gridApiRef.current.api.showLoadingOverlay();
              }}
              // onPaginationChanged={(params) =>
              //   handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
              // }
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              onRowClicked={(e) => {
                console.log("e.data", e.data);
                setOpenBaseCard(true);
                setClickedItem(e.data);
                // setUserClicked(e.data);
                //handleClickUser(e.data);
              }}
            />
          </div>
          {/* PAGINATION */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              showFirstButton
              showLastButton
              count={totalPages}
              page={pageNumber}
              onChange={handlePaginationChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default BaseTable;
