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
} from '@mui/material';
import {
  AccessTime,
  Add,
  Cancel,
  DeleteOutlineOutlined,
  Edit,
  FilterAlt,
  FilterList,
  ForwardToInbox,
  SortByAlpha,
  Verified,
  Visibility,
} from '@mui/icons-material';
import './ag-theme.css';

import { apiService } from '@/components/services/preclaimsApi';

import claimsEndpoints from '@/components/services/claimsApi';
import { useIsLoading } from '@/context/LoadingContext';
import Spinner from '@/components/spinner/Spinner';
import ClaimDialog from './ClaimDialog';
import CreateProspectivePensioner from '../preclaims/createProspective/CreateProspectivePensioner';
import BaseCard from '@/components/baseComponents/BaseCard';
import ListNavigation from '@/components/baseComponents/ListNavigation';
import ReturnToPreclaims from './ReturnToPreclaims';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import ClaimVerification from './reports/ClaimVerification';
import GP178Report from './reports/GP178Report';

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

const notificationStatusMap = {
  0: { name: 'VERIFICATION', color: '#3498db' }, // Light Red
  1: { name: 'VALIDATION', color: '#f39c12' }, // Bright Orange
  2: { name: 'APPROVAL', color: '#2ecc71' }, // Light Blue
  3: { name: 'ASSESSMENT DATA CAPTURE', color: '#f39c12' }, // Bright Orange
  4: { name: 'ASSESSMENT APPROVAL', color: '#2ecc71' }, // Light Blue
  5: { name: 'DIRECTORATE', color: '#f39c12' }, // Bright Orange
  6: { name: 'COB', color: '#2ecc71' }, // Light Blue
};

export const statusIcons = {
  0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
  1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
  2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
  3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
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
    width: 250,
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

const ClaimsTable = ({ status }) => {
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
    const filters =
      status !== null && status !== undefined
        ? {
            'filterCriterion.criterions[0].propertyName': 'stage',
            'filterCriterion.criterions[0].propertyValue': status,
            'filterCriterion.criterions[0].criterionType': 0,
          }
        : {};
    setLoading(true);
    try {
      const res = await apiService.get(claimsEndpoints.getClaims, {
        'paging.pageNumber': pageNumber,
        'paging.pageSize': pageSize,
        ...filters,
      });
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
  const [openClaimVerification, setOpenClaimVerification] = useState(false);
  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => exportData(),

    reports: () => console.log('Reports clicked'),

    movetoValidation: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    movetoVerification: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    moveToApproval: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    movetoMDA: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    returnToApproval: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    moveToAssessment: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },

    returnToClaimsApprovals: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },
    moveToAssessmentApproval: () => {
      setOpenAction(0);
      setOpenMoveStatus(true);
    },
    returnToClaimsApproval: () => {
      setOpenAction(1);
      setOpenMoveStatus(true);
    },

    'Claims Verification Register': () => setOpenClaimVerification(true),
  };

  const [openApprove, setOpenApprove] = useState(0);
  const [openGP178Report, setOpenGP178Report] = useState(false);

  const baseCardHandlers = {
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),

    // submit: () => setOpenAction(true),
    ...(status !== 5 &&
      status !== 6 && {
        createClaim: () => setOpenAction(true),
        movetoMDA: () => setOpenAction(1),
        movetoValidation: () => setOpenAction(0),
        movetoVerification: () => setOpenAction(1),
        moveToApproval: () => setOpenAction(0),
        returnToApproval: () => setOpenAction(1),
        moveToAssessment: () => setOpenAction(0),

        returnToClaimsApprovals: () => setOpenAction(1),
        moveToAssessmentApproval: () => setOpenAction(0),

        approvalRequest: () => console.log('Approval Request clicked'),
        sendApprovalRequest: () => setOpenApprove(1),
        cancelApprovalRequest: () => setOpenApprove(2),
        approveDocument: () => setOpenApprove(3),
        rejectDocumentApproval: () => setOpenApprove(4),
        'Detailed Report': () => setOpenGP178Report(true),
        delegateApproval: () => {
          setOpenApprove(5);
        },

        returnToClaimsApproval: () => {
          setOpenAction(1);
          setOpenMoveStatus(true);
        },
      }),
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
        open={openClaimVerification}
        onClose={() => setOpenClaimVerification(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '30vw',
            maxWidth: '35vw',
          },
        }}
      >
        <div className="px-6">
          <ClaimVerification
            setOpenTrialBalanceReport={setOpenClaimVerification}
          />
        </div>
      </Dialog>
      <Dialog
        open={openGP178Report}
        onClose={() => setOpenGP178Report(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '80vw',
            maxWidth: '35vw',
          },
        }}
      >
        <div className="px-6">
          <GP178Report
            setOpenGP178Report={setOpenGP178Report}
            retireeId={clickedItem?.retiree}
          />
        </div>
      </Dialog>
      <div className=" relative h-full w-full overflow-hidden">
        <BaseApprovalCard
          clickedItem={clickedItem}
          openApprove={openApprove}
          setOpenApprove={setOpenApprove}
          documentNo={clickedItem?.claim_id}
        />
        <ClaimDialog
          clickedItem={clickedItem}
          setOpenPreclaimDialog={setOpenPreclaimDialog}
          openPreclaimDialog={openPreclaimDialog}
          setOpenNotification={setOpenNotification}
        />

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
          documentNo={clickedItem && clickedItem?.claim_id}
          openBaseCard={openPreclaimDialog}
          setOpenBaseCard={setOpenPreclaimDialog}
          handlers={baseCardHandlers}
          title={clickedItem ? clickedItem?.claim_id : 'Create Claim'}
          clickedItem={clickedItem}
          status={clickedItem?.stage}
          // openAction={openAction}
          // setOpenAction={setOpenAction}
          reportItems={['Detailed Report']}
          setClickedItem={setClickedItem}
          fetchAllPreclaims={fetchAllPreclaims}
          openAction={openAction}
          setOpenAction={setOpenAction}
          isClaim={true}
          isClaimManagement={true}
          activeStep={clickedItem?.stage}
          steps={[
            'Verification',
            'Validation',
            'Approval',
            'Assessment Data Capture',
            'Assessment Approval',
          ]}
        >
          <CreateProspectivePensioner
            setOpenBaseCard={setOpenPreclaimDialog}
            openBaseCard={openPreclaimDialog}
            clickedItem={clickedItem}
          />
        </BaseCard>
        <div className="h-full w-full ml-3 mt-2">
          <ListNavigation
            handlers={handlers}
            reportItems={['Claims Verification Register']}
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

export default ClaimsTable;
