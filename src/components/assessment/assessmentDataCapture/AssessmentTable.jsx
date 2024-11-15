'use client';
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
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
  Pagination,
  Dialog,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  DeleteOutlineOutlined,
  Edit,
  FilterAlt,
  FilterList,
  ForwardToInbox,
  SortByAlpha,
} from '@mui/icons-material';
import './ag-theme.css';

import BaseCard from '@/components/baseComponents/BaseCard';
import ListNavigation from '@/components/baseComponents/ListNavigation';

import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import ReturnToPreclaims from '@/components/pensionsComponents/ClaimsManagementTable/ReturnToPreclaims';
import AssessmentCard from './AssessmentCard';
import { statusIcons } from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';
import PushToFinance from './PushToFinance';
import Page5Report from '../reports/Page5Report';

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

/*


  public enum ClaimStage
    {
        VERIFICATION,
        VALIDATION,
        APPROVAL,
        ASSESSMENT_DATA_CAPTURE, //TODO: Remove this
        ASSESSMENT_APPROVAL, //TODO: Remove this
        DIRECTORATE,
        COB,
        Finance,
        Finance_Voucher_Preparation,
        Finance_Voucher_Approval,
        Finance_Voucher_Scheduled_For_Payment,
        Finance_Voucher_Paid
    }
 
 
*/

const notificationStatusMap = {
  0: { name: 'VERIFICATION', color: '#3498db' }, // Light Red
  1: { name: 'VALIDATION', color: '#f39c12' }, // Bright Orange
  2: { name: 'APPROVAL', color: '#2ecc71' }, // Light Blue
  3: { name: 'ASSESSMENT DATA CAPTURE', color: '#f39c12' }, // Bright Orange
  4: { name: 'ASSESSMENT APPROVAL', color: '#2ecc71' }, // Light Blue
  5: { name: 'DIRECTORATE', color: '#f39c12' }, // Bright Orange
  6: { name: 'Controller of Budget', color: '#2ecc71' }, // Light Blue
  7: { name: 'Finance', color: '#f39c12' }, // Bright Orange
  8: { name: 'Finance Voucher Preparation', color: '#2ecc71' }, // Light Blue
  9: { name: 'Finance Voucher Approval', color: '#f39c12' }, // Bright Orange
  10: { name: 'Finance Voucher Scheduled For Payment', color: '#2ecc71' }, // Light Blue
  11: { name: 'Finance Voucher Paid', color: '#f39c12' }, // Bright Orange
};

const colDefs = [
  {
    headerName: 'Claim No.',
    field: 'claim_id',
    width: 150,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: 'left',
    filter: true,
    cellRenderer: (params) => {
      return (
        <p className="text-primary font-semibold underline ">{params.value}</p>
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
    headerName: 'Stage',
    field: 'stage',
    width: 150,
    cellRenderer: (params) => {
      const status = notificationStatusMap[params.value];
      if (!status) return null;

      return (
        <Button
          variant="text"
          sx={{
            borderColor: status.color,
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
    headerName: 'Gender',
    field: 'gender',
    width: 120,
    cellRenderer: (params) => {
      return params.value === 1 ? 'Male' : 'Female';
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
    headerName: 'Other Name(s)',
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
    headerName: 'Comments',
    field: 'comments',
    width: 150,
  },
];

const AssessmentTable = ({ status, statusArr }) => {
  const [dummyData, setDummyData] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [totalPages, setTotalPages] = useState(1);

  const [sortCriteria, setSortCriteria] = useState(0);
  const gridApiRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [gridApi, setGridApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;

    params.api.showLoadingOverlay();
  };
  const exportData = () => {
    gridApi.exportDataAsCsv();
  };

  const [rowData, setRowData] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchAllPreclaims = async () => {
    let filters = {};

    if (status !== null && status !== undefined) {
      // When a single status value is provided
      filters = {
        'filterCriterion.criterions[0].propertyName': 'stage',
        'filterCriterion.criterions[0].propertyValue': status,
        'filterCriterion.criterions[0].criterionType': 0,
      };
    } else if (statusArr && statusArr.length > 0) {
      // When statusArr is provided, loop through it and populate criterions array
      statusArr.forEach((status, index) => {
        filters[`filterCriterion.criterions[${index}].propertyName`] = 'stage';
        filters[`filterCriterion.criterions[${index}].propertyValue`] = status;
        filters[`filterCriterion.criterions[${index}].criterionType`] = 0; // Adjust criterionType if necessary
      });
    }

    setLoading(true);
    try {
      const res = await assessApiService.get(
        assessEndpoints.getAssessmentClaims,
        {
          'paging.pageNumber': pageNumber,
          'paging.pageSize': pageSize,
          ...filters,
          ...(statusArr && statusArr.length > 0
            ? { 'filterCriterion.compositionType': 1 }
            : {}),
        }
      );
      const rawData = res.data.data;

      setTotalPages(res.data.totalPages);

      setTotalRecords(res.data.totalCount);

      const mappedData = rawData.map((item) => ({
        retiree: item?.prospectivePensioner?.id,
        //  id: item?.claim_id,
        claim_id: item?.claim_id,

        id_claim: item?.id,

        stage: item?.stage,
        comments: item?.comments,
        maintenance_case: item?.prospectivePensioner?.maintenance_case,
        is_wcps: item?.prospectivePensioner?.is_wcps,
        email_address: item?.prospectivePensioner?.email_address,
        notification_status: item?.prospectivePensioner?.notification_status,
        gender: item?.prospectivePensioner?.gender,
        phone_number: item?.prospectivePensioner?.phone_number,
        personal_number: item?.prospectivePensioner?.personal_number,
        surname: item?.prospectivePensioner?.surname,
        first_name: item?.prospectivePensioner?.first_name,
        other_name: item?.prospectivePensioner?.other_name,
        pension_award: item?.prospectivePensioner?.mda?.name,
        name: item?.prospectivePensioner?.pension_award?.name,
        national_id: item?.prospectivePensioner?.national_id,
        kra_pin: item?.prospectivePensioner?.kra_pin,
        retirement_date: item?.prospectivePensioner?.retirement_date,
        dob: item?.prospectivePensioner?.dob,
        date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
        last_basic_salary_amount:
          item?.prospectivePensioner?.last_basic_salary_amount,
        mda_code: item?.prospectivePensioner?.mda?.code,
        mda_description: item?.prospectivePensioner?.mda?.description,
        mda_pensionCap_code: item?.prospectivePensioner?.mda?.pensionCap?.code,
        mda_pensionCap_name: item?.prospectivePensioner?.mda?.pensionCap?.name,
        mda_pensionCap_description:
          item?.prospectivePensioner?.mda?.pensionCap?.description,
        workHistories_length: item?.prospectivePensioner?.workHistories?.length,
        bankDetails_length: item?.prospectivePensioner?.bankDetails?.length,
        pensionAward_prefix: item?.prospectivePensioner?.pensionAward?.prefix,
        pensionAward_code: item?.prospectivePensioner?.pensionAward?.code,
        pensionAward_description:
          item?.prospectivePensioner?.pensionAward?.description,
        pensionAward_start_date:
          item?.prospectivePensioner?.pensionAward?.start_date,
        pensionAward_end_date:
          item?.prospectivePensioner?.pensionAward?.end_date,
        pensionAward_pensionCap_code:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.code,
        pensionAward_pensionCap_name:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.name,
        pensionAward_pensionCap_description:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.description,
        pensionAward_pensionCap_id:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.id,
        approval_status: item?.document_status,
        //////

        retirement_date: item?.prospectivePensioner?.retirement_date,
        date_from_which_pension_will_commence:
          item?.prospectivePensioner?.date_from_which_pension_will_commence,
        authority_for_retirement_dated:
          item?.prospectivePensioner?.authority_for_retirement_dated,
        authority_for_retirement_reference:
          item?.prospectivePensioner?.authority_for_retirement_reference,
        date_of_first_appointment:
          item?.prospectivePensioner?.date_of_first_appointment,
        date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
        country: item?.prospectivePensioner?.country,
        city_town: item?.prospectivePensioner?.city_town,
        pension_commencement_date:
          item?.prospectivePensioner?.pension_commencement_date,
        postal_address: item?.prospectivePensioner?.postal_address,
        id: item.prospectivePensioner?.id,
        exit_grounds: item?.prospectivePensioner?.exitGround.name,

        prospectivePensionerAwards:
          item?.prospectivePensioner?.prospectivePensionerAwards,
      }));

      setRowData(mappedData);
      console.log('mappedData', mappedData);
    } catch (error) {
      console.error('Error fetching preclaims:', error);
      return []; // Return an empty array or handle error as needed
    } finally {
      setLoading(false);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = () => {
    const selectedNodes = gridApiRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

    console.log('Selected Rows:', selectedData);
  };
  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  };

  useEffect(() => {
    fetchAllPreclaims();
  }, [pageNumber, pageSize]);

  const [openNotification, setOpenNotification] = useState(false);

  const [clickedItem, setClickedItem] = useState(null);
  const [openAction, setOpenAction] = useState(false);

  const [openPreclaimDialog, setOpenPreclaimDialog] = useState(false);
  const [openMoveStatus, setOpenMoveStatus] = useState(false);

  const [openPushToFinance, setOpenPushToFinance] = useState(false);
  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => exportData(),

    moveToAssessmentApproval: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },

    returnToAssessmentDataCapture: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },

    moveToDirectorate: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },

    returnToAssessment: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },

    moveToControllerOfBudget: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    moveToFinance: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    createPaymentVoucher: () => {
      setOpenPushToFinance(true);
    },
    returnToDirectorate: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
  };

  const [openComputeClaim, setOpenComputeClaim] = useState(false);
  const [qualifyingService, setQualifyingService] = useState([]);
  const [pensionableService, setPensionableService] = useState([]);
  const [viewBreakDown, setViewBreakDown] = useState(false);
  const [viewCompleteSummary, setViewCompleteSummary] = useState(false);
  const [computed, setComputed] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const baseCardHandlers = {
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),

    submit: () => setOpenAction(true),
    //createClaim: () => setOpenAction(true),
    computeClaim: () => calculateAndAward(clickedItem?.id_claim),
    viewComputationBreakdown: () => setViewBreakDown(true),
    viewComputationSummary: () => setViewCompleteSummary(true),

    moveToAssessmentApproval: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    returnToClaimsApprovals: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    moveToDirectorate: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    returnToAssessment: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },

    moveToControllerOfBudget: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },

    moveToFinance: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    createPaymentVoucher: () => {
      setOpenPushToFinance(true);
    },

    returnToDirectorate: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },

    'Page 5 Report': () => {
      setOpenReport(true);
    },
  };

  const [computing, setComputing] = useState(false);

  const calculateAndAward = async (id) => {
    if (clickedItem?.id_claim) {
      setComputing(true);
      try {
        const res = await assessApiService.post(
          assessEndpoints.calculateAndAward(id)
        );

        if (res.status === 200 && res.data.succeeded) {
          getClaimQualifyingService(id);
          getClaimPensionableService(id);
          setComputed(true);
        }
      } catch (error) {
        console.log('Error calculating and awarding claim:', error);
      } finally {
        setComputing(false);
      }
    } else {
      console.log('No claim id found');
    }
  };

  const getClaimQualifyingService = async (id) => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimQualyfyingService(id)
      );
      setQualifyingService(res.data.data);
    } catch (error) {
      console.log('Error getting claim qualifying service:', error);
    }
  };
  const getClaimPensionableService = async (id) => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimPensionableService(id)
      );
      setPensionableService(res.data.data);
    } catch (error) {
      console.log('Error getting claim pensionable service:', error);
    }
  };

  useEffect(() => {
    fetchAllPreclaims();
  }, [openPreclaimDialog]);
  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading NOT...' };
  }, []);

  return (
    <>
      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <Page5Report
            setOpenGratuity={setOpenReport}
            clickedItem={clickedItem}
          />
        </div>
      </Dialog>
      <Dialog
        open={
          openPreclaimDialog
            ? openPushToFinance
            : openPushToFinance && selectedRows.length > 0
        }
        onClose={() => {
          setOpenPushToFinance(false);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
        }}
      >
        <PushToFinance
          isSchedule={true}
          status={status}
          clickedItem={clickedItem}
          setOpenBaseCard={setOpenPreclaimDialog}
          selectedRows={selectedRows}
          setOpenPostGL={setOpenPushToFinance}
          setSelectedRows={setSelectedRows}
        />
      </Dialog>
      <div className=" relative h-full w-full overflow-hidden">
        {computing && (
          <Backdrop
            sx={{ color: '#fff', zIndex: 99999999999999999999 }}
            open={open}
            onClick={handleClose}
          >
            {/* <span class="loader"></span> */}
            <div className="ml-3 font-semibold text-xl flex items-center">
              Computing
              <div className="ellipsis ml-1 mb-4">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </Backdrop>
        )}
        <Dialog
          open={
            openPreclaimDialog
              ? openMoveStatus // When openPreclaimDialog is true, only consider openMoveStatus.
              : openMoveStatus && selectedRows.length > 0 // When openPreclaimDialog is false, check both openMoveStatus and selectedRows.length.
          }
          onClose={() => setOpenMoveStatus(false)}
          sx={{
            '& .MuiDialog-paper': {
              height: '300px',
              width: '600px',
            },
            p: 4,
          }}
        >
          <ReturnToPreclaims
            setOpenPreclaimDialog={setOpenPreclaimDialog}
            setOpenCreateClaim={setOpenMoveStatus}
            setSelectedRows={setSelectedRows}
            fetchAllPreclaims={fetchAllPreclaims}
            clickedItem={selectedRows}
            moveStatus={openAction}
          />
        </Dialog>

        <BaseCard
          openBaseCard={openPreclaimDialog}
          setOpenBaseCard={setOpenPreclaimDialog}
          handlers={baseCardHandlers}
          title={clickedItem ? clickedItem?.claim_id : 'Create Claim'}
          clickedItem={clickedItem}
          status={clickedItem?.stage}
          fetchAllPreclaims={fetchAllPreclaims}
          openAction={openAction}
          setOpenAction={setOpenAction}
          isClaim={true}
          reportItems={['Page 5 Report']}
          isClaimManagement={true}
          activeStep={clickedItem?.stage}
          steps={[
            'Claims Verification',
            'Claims Validation',
            'Claims Approval',
            'Assessment Data Capture',
            'Assessment Approval',
          ]}
        >
          <AssessmentCard
            setViewCompleteSummary={setViewCompleteSummary}
            viewCompleteSummary={viewCompleteSummary}
            setViewBreakDown={setViewBreakDown}
            viewBreakDown={viewBreakDown}
            pensionableService={pensionableService}
            qualifyingService={qualifyingService}
            setOpenBaseCard={setOpenPreclaimDialog}
            openBaseCard={openPreclaimDialog}
            clickedItem={clickedItem}
            computed={computed}
          />
        </BaseCard>
        <div className="h-full w-full ml-3 mt-2">
          {/* <div className="flex justify-between flex-row mt-2">
            <div className="flex gap-2 items-center pl-3">
              <div className="flex items-center gap-2 mt-2 ml-2">
                <Button onClick={() => exportData()} sx={{ maxHeight: "25px" }}>
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
          </div> */}
          <ListNavigation
            handlers={handlers}
            // permissions={permissions}
            status={status}
          />
          <Divider sx={{ mt: 2, mb: 1, ml: 2 }} />

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
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem>Equal</MenuItem>
                  <MenuItem>Contains</MenuItem>
                  <MenuItem>Not Equal</MenuItem>
                </Menu>
                <Divider />
                <div className="flex flex-col item-center p-4 mt-3">
                  <label className="text-xs font-semibold text-gray-600">
                    Select Column
                  </label>
                  <select
                    name="role"
                    //value={selectedRole}
                    //onChange={(e) => setSelectedRole(e.target.value)}
                    className="border p-3 bg-gray-100 border-gray-300 rounded-md  text-sm mr-7"
                    required
                  >
                    <option value="Board Member">All</option>
                    <option value="Admin">Id</option>
                    <option value="Business Admin">Email Address</option>
                    <option value="Support">Full Name</option>
                  </select>
                </div>
                <div className="flex flex-col item-center p-4 mt-3">
                  <label className="text-xs font-semibold text-gray-600 w-[100%]">
                    Sort By:
                  </label>
                  <div className="flex items-center ">
                    {' '}
                    <select
                      name="role"
                      //value={selectedRole}
                      //onChange={(e) => setSelectedRole(e.target.value)}
                      className="border p-3 bg-gray-100 border-gray-300 rounded-md w-[100%]  text-sm "
                      required
                    >
                      <option value="Board Member">All</option>
                      <option value="id">Id</option>
                      <option value="email_address">Email Address</option>
                      <option value="fullName">Full Name</option>
                    </select>
                    <Tooltip
                      title={
                        sortCriteria === 1
                          ? 'Ascending Order'
                          : 'Desceding Order'
                      }
                      placement="top"
                    >
                      <IconButton
                        sx={{ mr: '-10px', ml: '-4px' }}
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
                sx={{ ml: 2, width: '80%', mr: 2, mt: '-4' }}
              >
                Apply Filters
              </Button>
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
                rowData={rowData}
                columnDefs={colDefs}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                loadingOverlayComponent={BaseLoadingOverlay} // Use your custom loader
                loadingOverlayComponentParams={loadingOverlayComponentParams}
                domLayout="autoHeight"
                onGridReady={onGridReady}
                rowHeight={36}
                onCellDoubleClicked={(event) => {
                  setClickedItem(event.data); // Update selected item
                  setOpenPreclaimDialog(true); // Open dialog
                }}
              />{' '}
              {totalPages > 1 && (
                <Box
                  sx={{
                    mt: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Pagination
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
    </>
  );
};

export default AssessmentTable;
