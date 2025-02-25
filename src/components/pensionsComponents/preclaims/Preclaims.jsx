import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
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
  Dialog,
  Backdrop,
} from '@mui/material';
import {
  AccessTime,
  AccessTimeOutlined,
  Add,
  Cancel,
  CancelOutlined,
  Close,
  Delete,
  DeleteOutlineOutlined,
  Edit,
  EditOutlined,
  FilterAlt,
  FilterAltOutlined,
  FilterList,
  ForwardToInbox,
  Launch,
  LaunchOutlined,
  Send,
  SortByAlpha,
  TaskAlt,
  TaskAltOutlined,
  Verified,
  Visibility,
} from '@mui/icons-material';
import './ag-theme.css';
import CreatePreclaim from './CreatePreclaim';

import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import PreclaimsNotifications from './PreclaimsNotifications';
import PreclaimDialog from './PreclaimDialog';
import { useAlert } from '@/context/AlertContext';
import axios from 'axios';
import Spinner from '@/components/spinner/Spinner';
import ReactPaginate from 'react-paginate';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useMda } from '@/context/MdaContext';
import ListNavigation from '@/components/baseComponents/ListNavigation';
import BaseCard from '@/components/baseComponents/BaseCard';
import CreateProspectivePensioner from './createProspective/CreateProspectivePensioner';
import { useSearch } from '@/context/SearchContext';
import { message, Spin } from 'antd';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import { useStatus } from '@/context/StatusContext';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import FilterComponent from '@/components/baseComponents/FilterComponent';
import BaseExcelComponent from '@/components/baseComponents/BaseExcelComponent';

const SchemaCellRenderer = ({ value }) => {
  return (
    <Box sx={{ display: 'flex', p: 1, alignItems: 'center', gap: 1 }}>
      <Avatar variant="rounded" sx={{ height: 28, width: 28 }} />
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: 'primary.main' }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export const notificationStatusMap = {
  0: { name: 'UNNOTIFIED', color: '#e74c3c' }, // Light Red
  1: { name: 'SCHEDULED', color: '#f39c12' }, // Bright Orange
  2: { name: 'NOTIFIED', color: '#3498db' }, // Light Blue
  3: { name: 'SUBMITTED', color: '#970FF2' }, // Amethyst
  4: { name: 'IN REVIEW', color: '#970FF2' }, // Carrot Orange
  5: { name: 'PENDING APPROVAL', color: '#1abc9c' }, // Light Turquoise
  6: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
  7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
};

const statusIcons = {
  0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
  1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
  2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
  3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
};

export const colDefs = [
  {
    headerName: 'No',
    field: 'no_series',
    width: 150,
    pinned: 'left', // Pinning to the left ensures it's the first column
    checkboxSelection: true,
    headerCheckboxSelection: true,
    // valueGetter: (params) => {
    //   const rowIndex = params.node.rowIndex + 1;
    //   return `PC${rowIndex.toString().padStart(4, "0")}`; // Ensure 4 digits with leading zeros
    // },
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    headerName: 'First Name',
    field: 'first_name',
    width: 150,

    filter: true,
  },
  {
    headerName: 'Surname',
    field: 'surname',
    width: 150,
  },

  {
    headerName: 'Email Address',
    field: 'email_address',
    width: 200,
    filter: true,
  },
  {
    headerName: 'Retiree ID',
    field: 'retiree',
    width: 150,
    hide: true,
  },

  {
    headerName: 'Notification Status',
    field: 'notification_status',
    width: 180,
    filter: true,
    cellRenderer: (params) => {
      const status = notificationStatusMap[params.value];
      if (!status) return null;

      return (
        <Button
          variant="text"
          sx={{
            ml: 3,

            maxHeight: '22px',
            cursor: 'pointer',
            color: status.color,
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          {status.name.toLowerCase()}
        </Button>
      );
    },
  },
  {
    headerName: 'Approval Status',
    field: 'approval_status',
    width: 150,
    filter: true,
    cellRenderer: (params) => {
      const status = statusIcons[params.value];
      if (!status) return null;

      const IconComponent = status.icon;

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent
            style={{
              color: status.color,
              marginRight: '6px',
              fontSize: '17px',
            }}
          />
          <span
            style={{
              color: status.color,
              fontWeight: 'semibold',
              fontSize: '13px',
            }}
          >
            {status.name}
          </span>
        </div>
      );
    },
  },
  {
    headerName: 'Gender',
    field: 'gender',
    width: 120,
    cellRenderer: (params) => {
      return params.value === 0 ? 'Male' : 'Female';
    },
  },
  {
    headerName: 'Phone Number',
    field: 'phone_number',
    width: 180,
  },
  {
    headerName: 'Personal Number',
    field: 'personal_number',
    width: 180,
  },

  {
    headerName: 'Pension Award',
    field: 'pension_award',
    width: 200,
  },
  {
    headerName: 'Name',
    field: 'name',
    width: 150,
  },
  {
    headerName: 'Other Name',
    field: 'other_name',
    width: 150,
  },
  {
    headerName: 'National ID',
    field: 'national_id',
    width: 150,
  },
  {
    headerName: 'KRA PIN',
    field: 'kra_pin',
    width: 150,
  },
  {
    headerName: 'Retirement Date',
    field: 'retirement_date',
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
  {
    headerName: 'Date of Birth',
    field: 'dob',
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
  {
    headerName: 'Date of Confirmation',
    field: 'date_of_confirmation',
    width: 200,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
  {
    headerName: 'Last Basic Salary Amount',
    field: 'last_basic_salary_amount',
    width: 200,
  },
  {
    headerName: 'MDA Code',
    field: 'mda_code',
    width: 150,
  },
  {
    headerName: 'MDA Description',
    field: 'mda_description',
    width: 200,
  },
  {
    headerName: 'MDA Pension Cap Code',
    field: 'mda_pensionCap_code',
    width: 200,
  },
  {
    headerName: 'MDA Pension Cap Name',
    field: 'mda_pensionCap_name',
    width: 200,
  },
  {
    headerName: 'MDA Pension Cap Description',
    field: 'mda_pensionCap_description',
    width: 250,
  },

  {
    headerName: 'Pension Award Prefix',
    field: 'pensionAward_prefix',
    width: 200,
  },
  {
    headerName: 'Pension Award Code',
    field: 'pensionAward_code',
    width: 180,
  },
  {
    headerName: 'Pension Award Description',
    field: 'pensionAward_description',
    width: 250,
  },

  {
    headerName: 'Pension Award Pension Cap Name',
    field: 'pensionAward_pensionCap_name',
    width: 250,
  },
  {
    headerName: 'Pension Award Pension Cap Description',
    field: 'pensionAward_pensionCap_description',
    width: 300,
  },
  {
    headerName: 'Pension Award Pension Cap ID',
    field: 'pensionAward_pensionCap_id',
    width: 250,
    hide: true,
  },
  {
    headerName: 'ID',
    field: 'id',
    width: 150,
    hide: true,
  },
];

export const mapRowData = (items) =>
  items
    .filter((item) => item.no)
    .map((item) => ({
      no_series: item?.no,
      retiree: item?.id,
      email_address: item?.email_address,
      notification_status: item.notification_status,
      gender: item?.gender,
      phone_number: item?.phone_number,
      personal_number: item.personal_number,
      surname: item?.surname,
      first_name: item?.first_name,
      other_name: item?.other_name,
      pension_award: item.pensionAward?.name,
      name: item.pensionAward?.name,
      national_id: item?.national_id,
      kra_pin: item?.kra_pin,
      retirement_date: item.retirement_date,
      dob: item.dob,
      date_of_confirmation: item.date_of_confirmation,
      last_basic_salary_amount: item.last_basic_salary_amount,
      mda_code: item.mda?.code,
      mda_description: item.mda?.description,
      mda_pensionCap_code: item.mda?.pensionCap?.code,
      mda_id: item.mda_id,
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
      county: item?.constituency?.county?.county_name,
      city_town: item?.city_town,
      pension_commencement_date: item?.pension_commencement_date,
      postal_address: item?.postal_address,
      id: item.id,
      approval_status: item.status,

      bank_name: item.bankDetails[0]?.bankBranch?.bank?.name,
      branch_name: item.bankDetails[0]?.bankBranch?.name,
      account_number: item.bankDetails[0]?.account_number,
      account_name: item.bankDetails[0]?.account_name,
      bankType: item.bankDetails[0]?.bankBranch?.bank?.bankType?.type,
      branch_code: item.bankDetails[0]?.bankBranch?.branch_code,
      bank_code: item.bankDetails[0]?.bankBranch?.bank.code,
      military_id: item?.military_id,
      monthly_salary_in_ksh: item?.monthly_salary_in_ksh,
      service_increment: item?.service_increment,
      monthly_additional_pay: item?.monthly_additional_pay,
      is_wcps: item?.is_wcps,
      is_parliamentary: item?.is_parliamentary,
      age_on_discharge: item?.age_on_discharge,
      maintenance_case: item?.maintenance_case,
      was_in_mixed_service: item?.was_in_mixed_service,
    }));

const Preclaims = ({ status }) => {
  const [dummyData, setDummyData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12; // Number of records per page
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

  const handleFilters = async (filter) => {
    await fetchAllPreclaims(filter);
  };

  const [items, setItems] = useState([]);

  const { setActiveCapName } = useMda();

  const mdaId = localStorage.getItem('mdaId');

  // console.log("auth?.user?.email ***********", auth?.user?.email);

  // alert("auth?.user?.email ***********", auth);

  const fetchAllPreclaims = async (sort, filter) => {
    if (gridApiRef.current) {
      // Show the loading overlay when the page changes
      gridApiRef.current.api.showLoadingOverlay();
    }

    const adjustedFilter =
      (status || status === 0) && mdaId
        ? {
            'filterCriterion.criterions[0].propertyName': 'notification_status',
            'filterCriterion.criterions[0].propertyValue': status,
            'filterCriterion.criterions[0].criterionType': 0,
            'filterCriterion.criterions[1].propertyName': 'mda_id',
            'filterCriterion.criterions[1].propertyValue': mdaId,
            'filterCriterion.criterions[1].criterionType': 0,
          }
        : // : status === 5
        // ? {
        //     'filterCriterion.criterions[0].propertyName': 'notification_status',
        //     'filterCriterion.criterions[0].propertyValue': status,
        //     'filterCriterion.criterions[0].criterionType': 0,
        //   }
        !status && status !== 0 && mdaId
        ? {
            'filterCriterion.criterions[0].propertyName': 'mda_id',
            'filterCriterion.criterions[0].propertyValue': mdaId,
            'filterCriterion.criterions[0].criterionType': 0,
          }
        : !mdaId && status
        ? {
            'filterCriterion.criterions[0].propertyName': 'notification_status',
            'filterCriterion.criterions[0].propertyValue': status,
            'filterCriterion.criterions[0].criterionType': 0,
          }
        : !mdaId && !status
        ? {}
        : filter;
    //  setLoading(true);
    try {
      const res = await apiService.get(preClaimsEndpoints.getPreclaims, {
        'paging.pageNumber': pageNumber,
        'paging.pageSize': pageSize,

        ...sort,
        ...filter,
        ...adjustedFilter,
      });

      // console.log("mdaId***********", mdaId);

      if (res.data.succeeded === true) {
        const rawData = res.data.data;

        // let filteredMinistriesData = [];

        // // Filter data by mdaId
        // if (mdaId) {
        //   filteredMinistriesData =
        //     status === 5
        //       ? rawData
        //       : rawData.filter((item) => item.mda_id === mdaId);
        // } else {
        //   filteredMinistriesData = rawData;
        // }

        setTotalRecords(res.data.totalCount);
        setTotalPages(res.data.totalPages);

        if (status || status === 0) {
          // const filteredApprovals = filteredMinistriesData.filter(
          //   (item) => item.notification_status === status
          // );

          // setItems(filteredApprovals);
          const data = mapRowData(res.data.data);
          setRowData(data);
        } else {
          const data = mapRowData(res.data.data);
          setRowData(data);
          // console.log("first, state", status);
        }
      }
    } catch (error) {
      console.error('Error fetching preclaims:', error);
      return []; // Return an empty array or handle error as needed
    } finally {
      // setLoading(false);
      // openFilter && setOpenFilter(false);
      if (gridApiRef.current) {
        // Hide the loading overlay after data is loaded
        gridApiRef.current.api.hideOverlay();
      }
    }
  };

  const gridApiRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    // fetchAllPreclaims();
    // gridApiRef.current.api.showLoadingOverlay();
    setGridApi(params.api);
    gridApiRef.current = params;

    params.api.showLoadingOverlay();
    //  params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    fetchAllPreclaims();
  }, [gridApi]);

  const { setMdaId } = useMda();

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  useEffect(() => {
    const filter =
      filterColumn && filterValue
        ? {
            ...(filterColumn && {
              'filterCriterion.criterions[2].propertyName': filterColumn,
            }),
            ...(filterValue && {
              'filterCriterion.criterions[2].propertyValue': filterValue,
            }),
            ...(filterType && {
              'filterCriterion.criterions[2].criterionType': filterType,
            }),
          }
        : {};
    const sort = {
      ...(sortColumn && {
        'sortProperties.propertyName': sortColumn,
      }),
      ...(sortCriteria !== 0 && {
        'sortProperties.sortCriteria': sortCriteria,
      }),
    };

    fetchAllPreclaims(sort, filter);
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
        notificationStatusMap[item.notification_status]?.name === 'UNNOTIFIED'
    );
    setIsSendNotificationEnabled(allUnnotified);

    console.log(
      `This is the retireee Id for ${selectedData[0].first_name}🟢🟢🟢🟢 =>`,
      selectedData[0].retiree
    );
  };

  const [openNotification, setOpenNotification] = useState(false);

  const [clickedItem, setClickedItem] = useState(null);

  const [openPreclaimDialog, setOpenPreclaimDialog] = useState(false);

  const permissions = auth?.user?.permissions;

  const router = useRouter();

  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [openAction, setOpenAction] = useState(false);

  useEffect(() => {
    const filter = status
      ? {
          'filterCriterion.criterions[0].propertyName': 'notification_status',
          'filterCriterion.criterions[0].propertyValue': status,
          'filterCriterion.criterions[0].criterionType': 0,
        }
      : {
          ...(filterColumn && {
            'filterCriterion.criterions[0].propertyName': filterColumn,
          }),
          ...(filterValue && {
            'filterCriterion.criterions[0].propertyValue': filterValue,
          }),
          ...(filterType && {
            'filterCriterion.criterions[0].criterionType': filterType,
          }),
        };
    const sort = {
      ...(sortColumn && {
        'sortProperties.propertyName': sortColumn,
      }),
      ...(sortCriteria !== 0 && {
        'sortProperties.sortCriteria': sortCriteria,
      }),
    };

    fetchAllPreclaims(sort, filter);
  }, [openBaseCard]);

  const [openApprove, setOpenApprove] = useState(false);

  const { workFlowChange, setWorkFlowChange } = useStatus();
  const [openExcel, setOpenExcel] = useState(false);

  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => setOpenExcel(true),
    // create: () => router.push("/pensions/preclaims/listing/new"),
    ...((status === 0 || !status) && {
      create: () => {
        setOpenBaseCard(true);
        setClickedItem(null);
      },
    }),

    // submit: () => {
    //   if (selectedRows.length === 0) {
    //     message.error('Please select a record to submit');
    //     return;
    //   } else if (selectedRows.length > 0) {
    //     setClickedItem(selectedRows[0]);
    //     setOpenAction(true);
    //   }
    // },

    notify: () => setOpenNotification(true),
    ...((status === 1 || status === 5) && {
      approvalRequest: () => console.log('Approval Request clicked'),
      sendApprovalRequest: () => setOpenApprove(1),
      cancelApprovalRequest: () => setOpenApprove(2),
      approveDocument: () => setOpenApprove(3),
      rejectDocumentApproval: () => setOpenApprove(4),
      delegateApproval: () => {
        setOpenApprove(5);
        setWorkFlowChange(Date.now());
      },
    }),
  };

  const baseCardHandlers = {
    ...((status === 0 || !status) && {
      create: () => {
        setOpenBaseCard(true);
        setClickedItem(null);
      },
      edit: () => console.log('Edit clicked'),
      delete: () => console.log('Delete clicked'),
      reports: () => console.log('Reports clicked'),
    }),

    // notify: () => {
    //   setOpenNotification(true);
    // },
    submit: () => setOpenAction(true),
    createClaim: () => setOpenAction(true),
    ...(status === 1 || status === 5
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const title = clickedItem
    ? 'Pensioner Details'
    : 'Create Prospective Pensioner';

  const handlePaginationChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
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

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading NOT...' };
  }, []);

  const resetFilters = () => {
    setFilterColumn(null);
    setFilterValue(null);
    setFilterType(2);
    setSortColumn(null);
    setSortCriteria(0);
    fetchAllPreclaims();
  };

  const [clickedRow, setClickedRow] = useState(null);

  useEffect(() => {
    if (
      Array.isArray(selectedRows) &&
      selectedRows.length > 0 &&
      openApprove === false
    ) {
      fetchAllPreclaims();
    }
  }, [openApprove]);

  const getStatus = (mdaId, status) => {
    if (!mdaId) {
      if (status === 0 || status) {
        return 1;
      } else {
        return 0;
      }
    } else if (mdaId) {
      if (status === 0 || status) {
        return 2;
      } else {
        return 1;
      }
      return 1;
    } else {
      return 0;
    }
  };

  const [onCloseWarnings, setOnCloseWarnings] = useState(null);

  const [excelLoading, setExcelLoading] = useState(false);
  return (
    <>
      {excelLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 999999 }}
          open={excelLoading}
          onClick={() => setExcelLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Generating Excel File
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <div className=" relative h-full w-full overflow-hidden">
          <Dialog open={openExcel} onClose={() => setOpenExcel(false)} sx={{}}>
            <BaseExcelComponent
              setOpenExcel={setOpenExcel}
              fetchApiService={apiService.get}
              fetchApiEndpoint={preClaimsEndpoints.getPreclaims}
              filters={
                (status || status === 0) && status !== 5 && mdaId
                  ? {
                      'filterCriterion.criterions[0].propertyName':
                        'notification_status',
                      'filterCriterion.criterions[0].propertyValue': status,
                      'filterCriterion.criterions[0].criterionType': 0,
                      'filterCriterion.criterions[1].propertyName': 'mda_id',
                      'filterCriterion.criterions[1].propertyValue': mdaId,
                      'filterCriterion.criterions[1].criterionType': 0,
                    }
                  : status === 5
                  ? {
                      'filterCriterion.criterions[0].propertyName':
                        'notification_status',
                      'filterCriterion.criterions[0].propertyValue': status,
                      'filterCriterion.criterions[0].criterionType': 0,
                    }
                  : !status && status !== 0 && mdaId
                  ? {
                      'filterCriterion.criterions[0].propertyName': 'mda_id',
                      'filterCriterion.criterions[0].propertyValue': mdaId,
                      'filterCriterion.criterions[0].criterionType': 0,
                    }
                  : !mdaId && status
                  ? {
                      'filterCriterion.criterions[0].propertyName':
                        'notification_status',
                      'filterCriterion.criterions[0].propertyValue': status,
                      'filterCriterion.criterions[0].criterionType': 0,
                    }
                  : !mdaId && !status
                  ? {}
                  : {}
              }
              columns={colDefs}
              transformData={mapRowData}
              fileName={
                status
                  ? `Preclaims_${notificationStatusMap[status].name}`
                  : 'Preclaims Listing'
              }
              setLoading={setExcelLoading}
            />
          </Dialog>
          <BaseApprovalCard
            openApprove={openApprove}
            setOpenApprove={setOpenApprove}
            documentNo={selectedRows.map((item) => item.no_series)}
          />
          <BaseCard
            documentNo={clickedItem && clickedItem?.no_series}
            openBaseCard={openBaseCard}
            setOpenBaseCard={setOpenBaseCard}
            status={status}
            handlers={baseCardHandlers}
            title={title}
            clickedItem={clickedItem}
            openAction={openAction}
            setOpenAction={setOpenAction}
            fetchAllPreclaims={fetchAllPreclaims}
            isClaim={clickedItem}
            activeStep={clickedItem?.notification_status}
            onCloseWarnings={onCloseWarnings}
            setOnCloseWarnings={setOnCloseWarnings}
            steps={[
              'Data Capture',
              'Notification Scheduling',
              'Retiree Notification',
              'Preclaim Submission',
              'Preclaim Review',
              'Pending Approval',
              'Claim Creation',
            ]}
          >
            <CreateProspectivePensioner
              setOnCloseWarnings={setOnCloseWarnings}
              setOpenBaseCard={setOpenBaseCard}
              openBaseCard={openBaseCard}
              clickedItem={clickedItem}
              status={clickedItem?.notification_status}
              isPreclaim={true}
            />
          </BaseCard>
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

          {/* <PreclaimDialog
            permissions={permissions}
            clickedItem={clickedItem}
            setOpenPreclaimDialog={setOpenPreclaimDialog}
            openPreclaimDialog={openPreclaimDialog}
            setOpenNotification={setOpenNotification}
          /> */}
          <div className="h-full w-full">
            <ListNavigation
              handlers={handlers}
              // permissions={permissions}
              status={status}
              clickedItem={selectedRows[0]}
            />

            <div className="flex justify-between flex-row mt-2"></div>
            <Divider sx={{ mt: 1, mb: 1 }} />

            <div className="flex">
              {/* Custom Drawer */}
              <Collapse
                in={openFilter}
                sx={{
                  bgcolor: 'white',
                  mt: 2,
                  borderRadius: '10px',
                  color: 'black',
                  borderRadius: '10px',
                }}
                timeout="auto"
                unmountOnExit
              >
                <FilterComponent
                  columnDefs={colDefs}
                  filteredData={filteredData}
                  onApplyFilters={handleFilters}
                  fetchData={fetchAllPreclaims}
                  startIndex={getStatus(mdaId, status)}
                />
              </Collapse>
              <div
                className="ag-theme-quartz flex flex-col"
                style={{
                  padding: '20px',
                  marginLeft: '-10px',
                  width: openFilter ? 'calc(100vw - 300px)' : '100vw',
                }}
              >
                <AgGridReact
                  paginationPageSize={pageSize}
                  loadingOverlayComponent={BaseLoadingOverlay} // Use your custom loader
                  loadingOverlayComponentParams={loadingOverlayComponentParams}
                  //  pagination={true}
                  rowData={filteredData}
                  columnDefs={colDefs.map((col) => ({
                    ...col,
                    headerTooltip: col.headerName,
                  }))}
                  rowSelection="multiple"
                  noRowsOverlayComponent={BaseEmptyComponent}
                  onSelectionChanged={onSelectionChanged}
                  domLayout="autoHeight"
                  onGridReady={onGridReady}
                  totalRecords={totalRecords}
                  rowHeight={36}
                  onRowClicked={(event) => {
                    setClickedRow(event.data);
                    // console.log('event.data', event.data);
                  }}
                  onCellDoubleClicked={(event) => {
                    setOpenBaseCard(true);
                    setClickedItem(event.data); // Update selected item

                    // console.log("event.data", event.data);
                    setActiveCapName(event.data.mda_pensionCap_name);
                  }}
                />

                {totalPages > 1 && (
                  <Box
                    sx={{
                      mt: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Pagination
                      showFirstButton
                      showLastButton
                      count={totalPages}
                      page={pageNumber}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                    />
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preclaims;
