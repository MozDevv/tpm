import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Divider,
  Drawer,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  Add,
  Close,
  Delete,
  DeleteOutlineOutlined,
  Edit,
  EditOutlined,
  FilterAlt,
  FilterAltOutlined,
  FilterList,
  ForwardToInbox,
  Send,
  SortByAlpha,
} from "@mui/icons-material";
import "./ag-theme.css";
import CreatePreclaim from "./CreatePreclaim";

import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import PreclaimsNotifications from "./PreclaimsNotifications";
import PreclaimDialog from "./PreclaimDialog";
import { useAlert } from "@/context/AlertContext";
import axios from "axios";
import Spinner from "@/components/spinner/Spinner";
import ReactPaginate from "react-paginate";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SchemaCellRenderer = ({ value }) => {
  return (
    <Box sx={{ display: "flex", p: 1, alignItems: "center", gap: 1 }}>
      <Avatar variant="rounded" sx={{ height: 28, width: 28 }} />
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "primary.main" }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export const notificationStatusMap = {
  0: { name: "UNNOTIFIED", color: "#e74c3c" }, // Light Red
  1: { name: "SCHEDULED", color: "#f39c12" }, // Bright Orange
  2: { name: "NOTIFIED", color: "#3498db" }, // Light Blue
  3: { name: "SUBMITTED", color: "#970FF2" }, // Amethyst
  4: { name: "IN REVIEW", color: "#e67e22" }, // Carrot Orange
  5: { name: "PENDING APPROVAL", color: "#1abc9c" }, // Light Turquoise
  6: { name: "CLAIM CREATED", color: "#49D907" }, // Belize Hole Blue
  7: { name: "RETURNED FOR CLARIFICATION", color: "#E4A11B" }, // Light Green
};

const colDefs = [
  {
    headerName: "No",
    field: "no_id",
    width: 150,
    pinned: "left", // Pinning to the left ensures it's the first column
    checkboxSelection: true,
    headerCheckboxSelection: true,
    valueGetter: (params) => {
      const rowIndex = params.node.rowIndex + 1;
      return `PC${rowIndex.toString().padStart(4, "0")}`; // Ensure 4 digits with leading zeros
    },
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    headerName: "First Name",
    field: "first_name",
    width: 150,

    filter: true,
  },
  {
    headerName: "Other Name",
    field: "other_name",
    width: 150,
  },
  {
    headerName: "Email Address",
    field: "email_address",
    width: 200,
    filter: true,
  },
  {
    headerName: "Retiree ID",
    field: "retiree",
    width: 150,
    hide: true,
  },

  {
    headerName: "Notification Status",
    field: "notification_status",
    width: 180,
    filter: true,
    cellRenderer: (params) => {
      const status = notificationStatusMap[params.value];
      if (!status) return null;

      return (
        <Button
          variant="outlined"
          sx={{
            ml: 3,
            borderColor: status.color,
            maxHeight: "22px",
            cursor: "pointer",
            color: status.color,
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {status.name.toLowerCase()}
        </Button>
      );
    },
  },
  {
    headerName: "Gender",
    field: "gender",
    width: 120,
    cellRenderer: (params) => {
      return params.value === 0 ? "Male" : "Female";
    },
  },
  {
    headerName: "Phone Number",
    field: "phone_number",
    width: 180,
  },
  {
    headerName: "Personal Number",
    field: "personal_number",
    width: 180,
  },
  {
    headerName: "Surname",
    field: "surname",
    width: 150,
  },

  {
    headerName: "Pension Award",
    field: "pension_award",
    width: 200,
  },
  {
    headerName: "Name",
    field: "name",
    width: 150,
  },
  {
    headerName: "National ID",
    field: "national_id",
    width: 150,
  },
  {
    headerName: "KRA PIN",
    field: "kra_pin",
    width: 150,
  },
  {
    headerName: "Retirement Date",
    field: "retirement_date",
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : "";
    },
  },
  {
    headerName: "Date of Birth",
    field: "dob",
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : "";
    },
  },
  {
    headerName: "Date of Confirmation",
    field: "date_of_confirmation",
    width: 200,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : "";
    },
  },
  {
    headerName: "Last Basic Salary Amount",
    field: "last_basic_salary_amount",
    width: 200,
  },
  {
    headerName: "MDA Code",
    field: "mda_code",
    width: 150,
  },
  {
    headerName: "MDA Description",
    field: "mda_description",
    width: 200,
  },
  {
    headerName: "MDA Pension Cap Code",
    field: "mda_pensionCap_code",
    width: 200,
  },
  {
    headerName: "MDA Pension Cap Name",
    field: "mda_pensionCap_name",
    width: 200,
  },
  {
    headerName: "MDA Pension Cap Description",
    field: "mda_pensionCap_description",
    width: 250,
  },

  {
    headerName: "Pension Award Prefix",
    field: "pensionAward_prefix",
    width: 200,
  },
  {
    headerName: "Pension Award Code",
    field: "pensionAward_code",
    width: 180,
  },
  {
    headerName: "Pension Award Description",
    field: "pensionAward_description",
    width: 250,
  },
  {
    headerName: "Pension Award Start Date",
    field: "pensionAward_start_date",
    width: 200,
  },
  {
    headerName: "Pension Award End Date",
    field: "pensionAward_end_date",
    width: 200,
  },
  {
    headerName: "Pension Award Pension Cap Code",
    field: "pensionAward_pensionCap_code",
    width: 250,
  },
  {
    headerName: "Pension Award Pension Cap Name",
    field: "pensionAward_pensionCap_name",
    width: 250,
  },
  {
    headerName: "Pension Award Pension Cap Description",
    field: "pensionAward_pensionCap_description",
    width: 300,
  },
  {
    headerName: "Pension Award Pension Cap ID",
    field: "pensionAward_pensionCap_id",
    width: 250,
    hide: true,
  },
  {
    headerName: "ID",
    field: "id",
    width: 150,
    hide: true,
  },
];

const mapRowData = (items) =>
  items.map((item) => ({
    retiree: item.retiree?.id,
    email_address: item.retiree?.email_address,
    notification_status: item.notification_status,
    gender: item.retiree?.gender,
    phone_number: item.retiree?.phone_number,
    personal_number: item.personal_number,
    surname: item.retiree?.surname,
    first_name: item.retiree?.first_name,
    other_name: item.retiree?.other_name,
    pension_award: item.mda?.name,
    name: item.pensionAward?.name,
    national_id: item.retiree?.national_id,
    kra_pin: item.retiree?.kra_pin,
    retirement_date: item.retirement_date,
    dob: item.dob,
    date_of_confirmation: item.date_of_confirmation,
    last_basic_salary_amount: item.last_basic_salary_amount,
    mda_code: item.mda?.code,
    mda_description: item.mda?.description,
    mda_pensionCap_code: item.mda?.pensionCap?.code,
    // mda_id: item.mda?.pensionCap?.code,
    mda_pensionCap_name: item.mda?.pensionCap?.name,
    mda_pensionCap_description: item.mda?.pensionCap?.description,
    workHistories_length: item?.workHistories?.length,
    bankDetails_length: item?.bankDetails?.length,
    prospectivePensionerDocuments_length:
      item?.prospectivePensionerDocuments?.length,
    pensionAward_prefix: item.pensionAward?.prefix,
    pensionAward_code: item.pensionAward?.code,
    pensionAward_description: item.pensionAward?.description,
    pensionAward_start_date: item.pensionAward?.start_date,
    pensionAward_end_date: item.pensionAward?.end_date,
    pensionAward_pensionCap_code: item.pensionAward?.pensionCap?.code,
    pensionAward_pensionCap_name: item.pensionAward?.pensionCap?.name,
    pensionAward_pensionCap_description:
      item.pensionAward?.pensionCap?.description,
    pensionAward_pensionCap_id: item.pensionAward?.pensionCap?.id,
    retirement_date: item?.retirement_date,
    date_from_which_pension_will_commence:
      item?.date_from_which_pension_will_commence,
    authority_for_retirement_dated: item?.authority_for_retirement_dated,
    authority_for_retirement_reference:
      item?.authority_for_retirement_reference,
    date_of_first_appointment: item?.date_of_first_appointment,
    date_of_confirmation: item?.date_of_confirmation,
    country: item?.country,
    city_town: item?.city_town,
    pension_commencement_date: item?.pension_commencement_date,
    postal_address: item?.postal_address,
    id: item.id,
    bank_name: item.bankDetails[0]?.bankBranch?.bank?.name,
    branch_name: item.bankDetails[0]?.bankBranch?.name,
    account_number: item.bankDetails[0]?.account_number,
    bankType: item.bankDetails[0]?.bankBranch?.bank?.bankType?.type,
    branch_code: item.bankDetails[0]?.bankBranch?.branch_code,
    bank_code: item.bankDetails[0]?.bankBranch?.bank.code,
  }));

const Preclaims = ({ status }) => {
  const [dummyData, setDummyData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const paginationPageSizeSelector = [5, 10, 20, 50];

  const [sortCriteria, setSortCriteria] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportData = () => {
    gridApi.exportDataAsCsv();
  };

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  ///filters
  const [filterColumn, setFilterColumn] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  const [filterType, setFilterType] = useState(null);

  const [sortColumn, setSortColumn] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  //const [sortOrder, setSortOrder] = useState(null);

  const { auth } = useAuth();

  console.log("auth ****************", auth?.user?.permissions);

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
      ...(sortColumn && {
        "sortProperties.propertyName": sortColumn,
      }),
      ...(sortCriteria !== 0 && {
        "sortProperties.sortCriteria": sortCriteria,
      }),
    };

    await fetchAllPreclaims(sort, filter);
  };

  const [items, setItems] = useState([]);

  const fetchAllPreclaims = async (sort, filter) => {
    setLoading(true);
    try {
      const res = await apiService.get(preClaimsEndpoints.getPreclaims, {
        "paging.pageNumber": pageNumber,
        "paging.pageSize": pageSize,
        ...sort,
        ...filter,
      });

      /*  const res = await apiService.get(
        `https://pmis.agilebiz.co.ke/api/ProspectivePensioners/getProspectivePensioners?paging.pageNumber=${pageNumber}&paging.pageSize=${pageSize}`
      );*/
      if (res.data.succeeded === true) {
        console.log(res.data.data);
        const rawData = res.data.data;

        const { totalCount, currentPage, totalPages } = res.data;
        setTotalPages(res.data.totalPages);

        setTotalRecords(res.data.totalCount);

        if (status || status === 0) {
          const filteredApprovals = rawData.filter(
            (item) => item.notification_status === status
          );

          setItems(filteredApprovals);
          const data = mapRowData(filteredApprovals);
          setRowData(data);
        } else {
          const data = mapRowData(res.data.data);
          setRowData(data);
          console.log("first, state", status);
        }
      }

      console.log("mappedData", res.data.data);
    } catch (error) {
      console.error("Error fetching preclaims:", error);
      return []; // Return an empty array or handle error as needed
    } finally {
      setLoading(false);
      openFilter && setOpenFilter(false);
    }
  };

  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    // fetchAllPreclaims();

    setGridApi(params.api);
    gridApiRef.current = params;
    //  params.api.sizeColumnsToFit();
  };

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  useEffect(() => {
    fetchAllPreclaims();
  }, [pageNumber, pageSize]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isSendNotificationEnabled, setIsSendNotificationEnabled] =
    useState(false);

  const onSelectionChanged = () => {
    const selectedNodes = gridApiRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

    const allUnnotified = selectedData.every(
      (item) =>
        notificationStatusMap[item.notification_status]?.name === "UNNOTIFIED"
    );
    setIsSendNotificationEnabled(allUnnotified);

    console.log("Selected Rows:", selectedData);
  };

  const [openNotification, setOpenNotification] = useState(false);

  const [clickedItem, setClickedItem] = useState(null);

  const [openPreclaimDialog, setOpenPreclaimDialog] = useState(false);

  const permissions = auth.user.permissions;

  const router = useRouter();

  return (
    <>
      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <div className="table-container relative h-[80vh] w-full">
          <CreatePreclaim
            permissions={permissions}
            openCreate={openCreate}
            setOpenCreate={setOpenCreate}
            fetchAllPreclaims={fetchAllPreclaims}
          />
          <PreclaimsNotifications
            //clickedItem={}
            isSendNotificationEnabled={isSendNotificationEnabled}
            fetchAllPreclaims={fetchAllPreclaims}
            selectedRows={selectedRows}
            openNotification={openNotification}
            setOpenNotification={setOpenNotification}
          />

          <PreclaimDialog
            permissions={permissions}
            clickedItem={clickedItem}
            setOpenPreclaimDialog={setOpenPreclaimDialog}
            openPreclaimDialog={openPreclaimDialog}
            setOpenNotification={setOpenNotification}
          />
          <div className="h-full w-full">
            <div className="flex justify-between flex-row mt-2">
              <div className="flex gap-2 items-center pl-3">
                {!status && (
                  <div className="flex items-center">
                    <Button
                      // onClick={() => setOpenCreate(true)}
                      onClick={() =>
                        router.push("/pensions/preclaims/listing/new")
                      }
                      sx={{ mb: -1, maxHeight: "25px" }}
                      disabled={
                        !permissions?.includes(
                          "preclaims.create.prospective_pensioner"
                        )
                      }
                    >
                      <IconButton>
                        <Add sx={{ fontSize: "20px" }} color="primary" />
                      </IconButton>
                      <p className="font-medium text-gray -ml-2 text-sm">
                        Create
                      </p>
                    </Button>
                  </div>
                )}
                {status === 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setOpenNotification(true)}
                      sx={{ mb: -1, maxHeight: "24px" }}
                      disabled={
                        (!isSendNotificationEnabled &&
                          selectedRows.length > 0) ||
                        !permissions?.includes(
                          "preclaims.notify.prospective_pensioner"
                        )
                      }
                      startIcon={<ForwardToInbox />}
                    >
                      <p className="font-medium text-gray -ml-2 text-sm">
                        Notify Pensioner(s)
                      </p>
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2 ml-2">
                  <Button
                    onClick={() => exportData()}
                    sx={{ maxHeight: "25px" }}
                  >
                    <img
                      src="/excel.png"
                      alt="Open in Excel"
                      height={20}
                      width={20}
                    />
                    <p className="font-medium text-gray text-sm ">
                      Open in Excel
                    </p>
                  </Button>
                  <div className="">
                    <IconButton
                      onClick={() =>
                        setOpenFilter((prevOpenFilter) => !prevOpenFilter)
                      }
                    >
                      <Tooltip title="filter items" placement="top">
                        <FilterAlt sx={{ color: "primary.main" }} />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
            <Divider sx={{ mt: 1, mb: 1 }} />

            <div className="flex">
              {/* Custom Drawer */}
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
                  <p className="text-md font-medium text-primary p-3">
                    Filter By:
                  </p>
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
                    <MenuItem value={"EQUAL"}>Equal</MenuItem>
                    <MenuItem value={"NOT_EQUAL"}>Contains</MenuItem>
                    <MenuItem value={"CONTAINS"}>Not Equal</MenuItem>
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
                      {colDefs.map((col) => (
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
                        {colDefs.map((col) => (
                          <option value={col.field}>{col.headerName}</option>
                        ))}
                      </select>
                      <Tooltip
                        title={
                          sortCriteria === 1
                            ? "Ascending Order"
                            : "Desceding Order"
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
                  sx={{ ml: 2, width: "80%", mr: 2, mt: "-4" }}
                  onClick={handleFilters}
                >
                  Apply Filters
                </Button>
              </Collapse>
              <div
                className="ag-theme-quartz flex flex-col"
                style={{
                  height: "80vh",
                  padding: "20px",
                  width: openFilter ? "calc(100vw - 300px)" : "100vw",
                }}
              >
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs}
                  rowSelection="multiple"
                  onSelectionChanged={onSelectionChanged}
                  domLayout="autoHeight"
                  onGridReady={onGridReady}
                  totalRecords={totalRecords}
                  onRowClicked={(event) => {
                    setClickedItem(event.data); // Update selected item
                    setOpenPreclaimDialog(true); // Open dialog
                  }}
                />
                {/*************PAGINATION *************/}

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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preclaims;
