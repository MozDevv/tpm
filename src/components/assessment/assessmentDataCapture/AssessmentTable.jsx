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
  Chip,
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
import {
  claimTypesMap,
  mapRowData,
  statusIcons,
} from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';
import PushToFinance from './PushToFinance';
import Page5Report from '../reports/Page5Report';
import AppendixReport from '../reports/AppendixReport';
import GP178Report from '@/components/pensionsComponents/ClaimsManagementTable/reports/GP178Report';
import DsoReport from '@/components/pensionsComponents/ClaimsManagementTable/reports/DsoReport';
import Cap196Death from '@/components/pensionsComponents/ClaimsManagementTable/reports/Cap196Death';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import BaseExcelComponent from '@/components/baseComponents/BaseExcelComponent';
import FilterComponent from '@/components/baseComponents/FilterComponent';
import DependantsReport from '../reports/DependantsReport';

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
  6: { name: 'Controller of Budget', color: '#f39c12' }, // Bright Orange
  7: { name: 'Finance', color: '#2ecc71' }, // Light Blue
  8: { name: 'Voucher Preparation', color: '#f39c12' }, // Bright Orange
  9: { name: 'Voucher Approval', color: '#3498db' }, // Light Blue
  10: { name: 'Voucher Scheduled', color: '#f39c12' }, // Bright Orange
  11: { name: 'Voucher Paid', color: '#8b4513' }, // Light Blue
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
    field: 'prospectivePensioner.first_name',
    width: 150,
    filter: true,
  },
  {
    headerName: 'Surname',
    field: 'prospectivePensioner.surname',
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
    field: 'document_status',
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
    field: 'prospectivePensioner.email_address',
    width: 200,
    filter: true,
  },
  {
    headerName: 'Gender',
    field: 'prospectivePensioner.gender',
    width: 120,
    cellRenderer: (params) => {
      return params.value === 0 ? 'Male' : 'Female';
    },
  },
  {
    headerName: 'Phone Number',
    field: 'prospectivePensioner.phone_number',
    width: 180,
  },
  {
    headerName: 'Personal Number',
    field: 'prospectivePensioner.personal_number',
    width: 180,
  },

  {
    headerName: 'National ID',
    field: 'prospectivePensioner.national_id',
    width: 150,
  },

  {
    headerName: 'Retirement Date',
    field: 'prospectivePensioner.retirement_date',
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
  {
    headerName: 'Date of Birth',
    field: 'prospectivePensioner.dob',
    width: 180,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
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
  const [filterColumn, setFilterColumn] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  const [filterType, setFilterType] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);

  const handleFilters = async () => {
    const filter =
      filterColumn && filterValue && (status || status === 0)
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
        : filterColumn && filterValue
        ? {
            ...(filterColumn && {
              'filterCriterion.criterions[1].propertyName': filterColumn,
            }),
            ...(filterValue && {
              'filterCriterion.criterions[1].propertyValue': filterValue,
            }),
            ...(filterType && {
              'filterCriterion.criterions[1].criterionType': filterType,
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

    await fetchAllPreclaims(sort, filter);
  };

  const fetchAllPreclaims = async (sort, filter) => {
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
        assessEndpoints.getClaimsListings,
        {
          'paging.pageNumber': pageNumber,
          'paging.pageSize': pageSize,
          ...filters,
          ...sort,
          ...filter,
          ...(statusArr && statusArr.length > 0
            ? { 'filterCriterion.compositionType': 1 }
            : {}),
        }
      );
      const rawData = res.data.data;

      setTotalPages(res.data.totalPages);

      setTotalRecords(res.data.totalCount);

      // const mappedData = rawData.map((item) => ({
      //   retiree: item?.prospectivePensioner?.id,
      //   //  id: item?.claim_id,
      //   claim_id: item?.claim_id,

      //   id_claim: item?.id,
      //   stage: item?.stage,
      //   comments: item?.comments,
      //   maintenance_case: item?.prospectivePensioner?.maintenance_case,
      //   is_wcps: item?.prospectivePensioner?.is_wcps,

      //   notification_status: item?.prospectivePensioner?.notification_status,
      //   gender: item?.prospectivePensioner?.gender,
      //   phone_number: item?.prospectivePensioner?.phone_number,
      //   personal_number: item?.prospectivePensioner?.personal_number,
      //   claim_type: item?.claim_type,
      //   first_name: item?.igc_beneficiary_track?.beneficiary?.first_name
      //     ? item?.igc_beneficiary_track?.beneficiary?.first_name
      //     : item?.prospectivePensioner?.first_name,
      //   surname: item?.igc_beneficiary_track?.beneficiary?.surname
      //     ? item?.igc_beneficiary_track?.beneficiary?.surname
      //     : item?.prospectivePensioner?.surname,
      //   other_name: item?.igc_beneficiary_track?.beneficiary?.other_name
      //     ? item?.igc_beneficiary_track?.beneficiary?.other_name
      //     : item?.prospectivePensioner?.other_name,
      //   email_address: item?.igc_beneficiary_track?.beneficiary?.email_address
      //     ? item?.igc_beneficiary_track?.beneficiary?.email_address
      //     : item?.prospectivePensioner?.email_address,
      //   pension_award: item?.prospectivePensioner?.mda?.name,
      //   name: item?.prospectivePensioner?.pension_award?.name,
      //   national_id: item?.prospectivePensioner?.national_id,
      //   kra_pin: item?.prospectivePensioner?.kra_pin,
      //   retirement_date: item?.prospectivePensioner?.retirement_date,
      //   dob: item?.prospectivePensioner?.dob,
      //   date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
      //   last_basic_salary_amount:
      //     item?.prospectivePensioner?.last_basic_salary_amount,
      //   mda_code: item?.prospectivePensioner?.mda?.code,
      //   mda_description: item?.prospectivePensioner?.mda?.description,
      //   mda_id: item?.prospectivePensioner?.mda?.id,
      //   mda_pensionCap_code: item?.prospectivePensioner?.mda?.pensionCap?.code,
      //   mda_pensionCap_name: item?.prospectivePensioner?.mda?.pensionCap?.name,
      //   mda_pensionCap_description:
      //     item?.prospectivePensioner?.mda?.pensionCap?.description,
      //   workHistories_length: item?.prospectivePensioner?.workHistories?.length,
      //   bankDetails_length: item?.prospectivePensioner?.bankDetails?.length,
      //   pensionAward_prefix: item?.prospectivePensioner?.pensionAward?.prefix,
      //   pensionAward_code: item?.prospectivePensioner?.pensionAward?.code,
      //   pensionAward_description:
      //     item?.prospectivePensioner?.pensionAward?.description,
      //   pensionAward_start_date:
      //     item?.prospectivePensioner?.pensionAward?.start_date,
      //   pensionAward_end_date:
      //     item?.prospectivePensioner?.pensionAward?.end_date,
      //   pensionAward_pensionCap_code:
      //     item?.prospectivePensioner?.pensionAward?.pensionCap?.code,
      //   pensionAward_pensionCap_name:
      //     item?.prospectivePensioner?.pensionAward?.pensionCap?.name,
      //   pensionAward_pensionCap_description:
      //     item?.prospectivePensioner?.pensionAward?.pensionCap?.description,
      //   pensionAward_pensionCap_id:
      //     item?.prospectivePensioner?.pensionAward?.pensionCap?.id,
      //   approval_status: item?.document_status,
      //   //////

      //   retirement_date: item?.prospectivePensioner?.retirement_date,
      //   date_from_which_pension_will_commence:
      //     item?.prospectivePensioner?.date_from_which_pension_will_commence,
      //   authority_for_retirement_dated:
      //     item?.prospectivePensioner?.authority_for_retirement_dated,
      //   authority_for_retirement_reference:
      //     item?.prospectivePensioner?.authority_for_retirement_reference,
      //   date_of_first_appointment:
      //     item?.prospectivePensioner?.date_of_first_appointment,
      //   date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
      //   country: item?.prospectivePensioner?.country,
      //   city_town: item?.prospectivePensioner?.city_town,
      //   pension_commencement_date:
      //     item?.prospectivePensioner?.pension_commencement_date,
      //   postal_address: item?.prospectivePensioner?.postal_address,
      //   id: item.prospectivePensioner?.id,
      //   exit_grounds: item?.prospectivePensioner?.exitGround.name,

      //   prospectivePensionerAwards:
      //     item?.prospectivePensioner?.prospectivePensionerAwards,

      //   pensioner_number: item?.prospectivePensioner
      //     ?.prospectivePensionerAwards[0]?.pension_award?.prefix
      //     ? item?.prospectivePensioner?.prospectivePensionerAwards[0]
      //         ?.pension_award?.prefix + item?.pensioner_number
      //     : item?.pensioner_number,
      //   createdBy: item?.created_by,
      //   date_of_death: item?.prospectivePensioner?.date_of_death,
      //   mortality_status: item?.prospectivePensioner?.mortality_status ?? '',
      // }));

      const mapSomeRequiredData = rawData.map((item) => ({
        ...item,
        id: item?.prospectivePensioner?.id,
        id_claim: item?.id,
        notification_status: item?.prospectivePensioner?.notification_status,
      }));

      setRowData([...mapSomeRequiredData]);
      // console.log('mappedData', mappedData);
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
  const [openApprove, setOpenApprove] = useState(0);
  const [workFlowChange, setWorkFlowChange] = useState(null);
  const [openExcel, setOpenExcel] = useState(false);
  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => setOpenExcel(true),

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
    returnToCOB: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    ...(status === 5
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

  const [openComputeClaim, setOpenComputeClaim] = useState(false);
  const [qualifyingService, setQualifyingService] = useState([]);
  const [pensionableService, setPensionableService] = useState([]);
  const [viewBreakDown, setViewBreakDown] = useState(false);
  const [viewCompleteSummary, setViewCompleteSummary] = useState(false);
  const [computed, setComputed] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openGP178Report, setOpenGP178Report] = useState(false);
  const [openDependantsReport, setOpenDependantsReport] = useState(false);
  // const [open]
  // const []
  // const [open]

  const baseCardHandlers = {
    reports: () => {},

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

    // Appendix: () => {
    //   setOpenReport(1);
    // },

    'Page 5 Report': () => {
      setOpenReport(2);
    },
    // 'Dependants Computations': () => {
    //   setOpenDependantsReport(true);
    // },
    'Detailed Report': () => {
      setOpenGP178Report(true);
    },
    // 'Maintenance Report': () => {},
    // returnToCOB: () => {
    //   setOpenAction(1);
    //   setOpenMoveStatus(true);
    // },
    'Maintenance Report': () => {},
    ...(status === 5
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
    createPayrollRecord: () => {
      setOpenAction('payroll');
      setOpenMoveStatus(true);
    },
    ...(clickedItem?.mortality_status === 1 && status === 5
      ? {
          createDependantClaims: () => {
            handleCreateDependantClaim();
          },
        }
      : {}),
  };

  const handleCreateDependantClaim = async () => {
    //handleCreateDependantClaim api/DeathInService/CreateDependentClaims?claimId=

    if (clickedItem?.id_claim) {
      setComputing(true);
      try {
        const res = await assessApiService.post(
          assessEndpoints.createDependantClaims(clickedItem?.id_claim)
        );

        if (res.status === 200 && res.data.succeeded) {
          getClaimQualifyingService(clickedItem?.id_claim);
          getClaimPensionableService(clickedItem?.id_claim);
          setComputed(true);
        }
      } catch (error) {
        console.log('Error calculating and awarding claim:', error);
      } finally {
        setComputing(false);
      }
    }
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
      <Dialog open={openExcel} onClose={() => setOpenExcel(false)} sx={{}}>
        <BaseExcelComponent
          setOpenExcel={setOpenExcel}
          fetchApiService={assessApiService.get}
          fetchApiEndpoint={
            status
              ? assessEndpoints.getAssessmentClaimById(status)
              : assessEndpoints.getAssessmentClaims
          }
          columns={colDefs}
          transformData={mapRowData}
          filters={
            status !== null && status !== undefined
              ? {
                  // When a single status value is provided
                  'filterCriterion.criterions[0].propertyName': 'stage',
                  'filterCriterion.criterions[0].propertyValue': status,
                  'filterCriterion.criterions[0].criterionType': 0,
                }
              : statusArr && statusArr.length > 0
              ? statusArr.reduce(
                  (acc, status, index) => {
                    acc[`filterCriterion.criterions[${index}].propertyName`] =
                      'stage';
                    acc[`filterCriterion.criterions[${index}].propertyValue`] =
                      status;
                    acc[
                      `filterCriterion.criterions[${index}].criterionType`
                    ] = 0; // Adjust criterionType if necessary
                    return acc;
                  },
                  { 'filterCriterion.compositionType': 1 }
                )
              : {}
          }
          fileName={
            status ? `Claims_${notificationStatusMap[status].name}` : 'Listing'
          }
          setLoading={setExcelLoading}
        />
      </Dialog>
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
      <Dialog
        open={openGP178Report}
        onClose={() => setOpenGP178Report(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '60vw',
            maxWidth: '35vw',
          },
        }}
      >
        {clickedItem && clickedItem.mda_pensionCap_name === 'CAP189' ? (
          <div className="px-6">
            <GP178Report
              clickedItem={clickedItem}
              setOpenGP178Report={setOpenGP178Report}
              retireeId={clickedItem?.retiree}
            />
          </div>
        ) : (
          <div className="px-6">
            {/* <DsoReport
              clickedItem={clickedItem}
              setOpenGP178Report={setOpenGP178Report}
              retireeId={clickedItem?.retiree}
            /> */}
            <Cap196Death
              clickedItem={clickedItem}
              setOpenGP178Report={setOpenGP178Report}
              retireeId={clickedItem?.retiree}
            />
          </div>
        )}
      </Dialog>
      <Dialog
        open={openReport === 1}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '85vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <AppendixReport
            setOpenGratuity={setOpenReport}
            clickedItem={clickedItem}
          />
        </div>
      </Dialog>
      <Dialog
        open={openDependantsReport}
        onClose={() => setOpenDependantsReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '85vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        <div className="flex-grow overflow-hidden">
          <DependantsReport
            setOpenGratuity={setOpenDependantsReport}
            clickedItem={clickedItem}
          />
        </div>
      </Dialog>
      <Dialog
        open={openReport === 2}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '90vh',
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
            clickedItem={selectedRows.length > 0 ? selectedRows : clickedItem}
            moveStatus={openAction}
          />
        </Dialog>

        <BaseCard
          documentNo={clickedItem && clickedItem?.no_series}
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
          reportItems={[
            // 'Appendix',
            'Page 5 Report',
            'Detailed Report',
            // 'Dependants Computations',
          ]}
          isClaimManagement={true}
          activeStep={clickedItem?.stage}
          steps={[
            'Claims Verification',
            'Claims Validation',
            'Claims Approval',
            'Assessment Data Capture',
            'Assessment Approval',
            'Directorate',
            'Controller of Budget',
            'Finance',
            'Voucher Preparation',
            'Voucher Approval',
            'Voucher Scheduled',
            'Voucher Paid',
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
              <FilterComponent
                columnDefs={colDefs}
                filteredData={rowData}
                onApplyFilters={handleFilters}
                fetchData={fetchAllPreclaims}
                startIndex={status === 0 || status ? 1 : 0}
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
