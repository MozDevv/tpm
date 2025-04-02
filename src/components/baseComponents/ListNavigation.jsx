import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {
  FilterList,
  OpenInNew,
  Edit,
  Delete,
  ForwardToInbox,
  CheckCircle,
  Send,
  Add,
  BarChart,
  AccountBalance,
  AddBusiness,
  AddCircle,
  AddCircleOutline,
  Info,
  FormatListNumbered,
  Undo,
  IosShare,
  PostAdd,
  CheckCircleOutline,
  TaskAlt,
  PersonAddAlt,
  Check,
  Cancel,
  CancelScheduleSend,
  Rule,
  Settings,
  ScheduleSend,
  Launch,
  TaskOutlined,
  ArticleOutlined,
  FileDownload,
  PlaylistRemove,
  Upload,
  CloudUpload,
  PriceCheck,
  AssuredWorkload,
  PlaylistAdd,
  EditNote,
  Replay,
  TrendingUp,
  Search,
  LockOpen,
  AddCard,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import { Divider, Menu, MenuItem, TextField } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { name } from 'dayjs/locale/en-au';

const ListNavigation = ({
  handlers,
  status,
  clickedItem,
  reportItems,
  selectedRows,
  setSearchedValue,
}) => {
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const [itemClicked, setItemClicked] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(false);

  const [approvalActions, setApprovalActions] = useState([]);
  const [parentAction, setParentAction] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const hasReportItems = reportItems?.length > 0;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    if (handlers[action]) {
      handlers[action]();
    } else {
      console.error(`Handler for action "${action}" not found.`);
    }
    handleMenuClose();
  };

  const userId = auth.user ? auth.user.userId : null;

  const getApprovalActionsForUser = async () => {
    const data = {
      userId: userId,

      //TODO - uncomment this line when the API is ready
      documentNo: clickedItem?.no_series
        ? clickedItem?.no_series
        : clickedItem?.no
        ? clickedItem?.no
        : clickedItem?.documentNo
        ? clickedItem?.documentNo
        : clickedItem?.document_no
        ? clickedItem?.document_no
        : 'TEST00001',
    };
    try {
      const res = await workflowsApiService.post(
        workflowsEndpoints.getApprovalActions,
        data
      );
      if (res.status === 200) {
        setApprovalActions(res.data);
      }
    } catch (error) {
      console.log('clickedItem?.no_series', clickedItem?.no_series);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getApprovalActionsForUser();
  }, [clickedItem]);
  useEffect(() => {
    getApprovalActionsForUser();
  }, [selectedRows]);

  // Define buttons with required permissions
  const buttons = [
    {
      name: 'Filter',
      icon: FilterList,
      action: 'filter',
      requiredPermissions: [],
    },
    {
      name: 'Search',
      icon: Search,
      action: 'search',
      requiredPermissions: [],
      disabled: false,
    },
    {
      name: 'Open in Excel',
      icon: OpenInNew,
      image: '/excel.png',
      action: 'openInExcel',
      requiredPermissions: [],
    },
    {
      name: 'Create',
      icon: Add,
      action: 'create',
      requiredPermissions: [],
    },

    {
      name: 'Edit',
      icon: Edit,
      action: 'edit',
      requiredPermissions: ['update'],
    },
    {
      name: 'Delete',
      icon: Delete,
      action: 'delete',
      requiredPermissions: [],
    },
    {
      name: 'Schedule for Notification',
      icon: ForwardToInbox,
      action: 'notify',
      requiredPermissions: [
        /// 'preclaims.notify.prospective_pensioner',
        // "preclaims.execute.notify_prospective_pensioner",
      ],
      status: [0],
    },

    {
      name: 'Approve',
      icon: CheckCircle,
      action: 'approve',
      requiredPermissions: ['preclaims.approve.prospective_pensioner'],
      status: [1],
    },
    {
      name: 'Submit For Approval',
      icon: Send,
      action: 'submit',
      requiredPermissions: ['preclaims.execute.send_preclaim_for_approval'],
      status: [3],
    },
    {
      name: 'Return to MDA for Clarification',
      icon: Undo,
      action: 'movetoMDA',
      requiredPermissions: [],
      status: [0],
    },
    {
      name: 'Move to Validation',
      icon: Send,
      action: 'movetoValidation',
      requiredPermissions: [],
      status: [0],
    },
    {
      name: 'Return to Verification',
      icon: Undo,
      action: 'movetoVerification',
      requiredPermissions: [],
      status: [1],
    },
    {
      name: 'Move to Approval',
      icon: Send,
      action: 'moveToApproval',
      requiredPermissions: [],
      status: [1],
    },

    {
      name: 'Return to Validation',
      icon: Undo,
      action: 'returnToApproval',
      requiredPermissions: [],
      status: [2],
    },
    {
      name: 'Move to Assessment',
      icon: Send,
      action: 'moveToAssessment',
      requiredPermissions: [],
      status: [2],
    },

    {
      name: 'Return to Claims Approval',
      icon: Undo,
      action: 'returnToClaimsApproval',
      requiredPermissions: [],
      status: [3],
    },

    {
      name: 'Return to Assessment Data Capture',
      icon: Undo,
      action: 'returnToAssessmentDataCapture',
      requiredPermissions: [],
      status: [4],
    },
    {
      name: 'Compute Claim',
      icon: Settings,
      action: 'computeClaim',
      requiredPermissions: [],
      status: [4],
    },
    {
      name: 'View Computation Breakdown',
      icon: Launch,
      action: 'viewComputationBreakdown',
      requiredPermissions: [],
      status: [4, 5, 6, 7, 8, 9, 10, 11],
    },
    {
      name: 'View Complete Summary',
      icon: Launch,
      action: 'viewComputationSummary',
      requiredPermissions: [],
    },
    {
      name: 'Return to Assessment',
      icon: Undo,
      action: 'returnToAssessment',
      requiredPermissions: [],
      status: [5],
    },
    {
      name: 'Move to Directorate',
      icon: TaskOutlined,
      action: 'moveToDirectorate',
      requiredPermissions: [],
      status: [4],
    },
    {
      name: 'Move to Controller of Budget',
      icon: TaskOutlined,
      action: 'moveToControllerOfBudget',
      requiredPermissions: [],
      status: [5],
    },

    {
      name: 'Move to Assessment Approval',
      icon: Send,
      action: 'moveToAssessmentApproval',
      requiredPermissions: [],
      status: [3],
    },

    {
      name: 'Return to Directorate',
      icon: Undo,
      action: 'returnToDirectorate',
      requiredPermissions: [],
      status: [6],
    },
    {
      name: 'Return to COB',
      icon: Undo,
      action: 'returnToCOB',
      requiredPermissions: [],
      status: [7],
    },
    {
      name: 'Move to Finance',
      icon: AssuredWorkload,
      action: 'moveToFinance',
      requiredPermissions: [],
      status: [6],
    },
    {
      name: 'Approve Claim',
      icon: Send,
      action: 'moveStatus',
      requiredPermissions: [],
      status: [2],
    },
    {
      name: 'Create Branch',
      icon: AccountBalance,
      action: 'createBranch',
      requiredPermissions: [],
      status: ['createBranch'],
    },
    {
      name: 'Create Bank Type',
      icon: AddBusiness,
      action: 'createBankType',
      requiredPermissions: [],
      status: ['createBranch'],
    },
    {
      name: 'Add Constituency',
      icon: AddCircleOutline,
      action: 'createConstituency',
      requiredPermissions: [],
      status: ['createConstituency'],
    },
    {
      name: 'Create Number Series Line',
      icon: AddCircle,
      action: 'numberSeriesLine',
      requiredPermissions: [],
      status: ['numberSeriesLine'],
    },
    {
      name: 'Create Claim',
      icon: AddCircle,
      action: 'createClaim',
      requiredPermissions: [],
      status: [5, 7],
    },
    {
      name: 'Create Payment Voucher',
      icon: PostAdd,
      action: 'createPaymentVoucher',
      requiredPermissions: [],
      status: [7],
    },
    {
      name: 'Numbering Sections',
      icon: FormatListNumbered,
      action: 'numberingSections',
      requiredPermissions: [],
    },
    {
      name: 'Post to Ledger',
      icon: PostAdd,
      action: 'postToGL',
      requiredPermissions: [],
    },
    {
      name: 'Post Receipt(s) to Ledger',
      icon: PostAdd,
      action: 'postReceiptToGL',
      requiredPermissions: [],
    },

    {
      name: 'Submit for Approval',
      icon: Send,
      action: 'submitPaymentForApproval',
      requiredPermissions: [],
    },
    {
      name: 'Approve Payment Voucher',
      icon: TaskAlt,
      action: 'approvePaymentVoucher',
      requiredPermissions: [],
    },
    {
      name: 'Schedule Payment Voucher',
      icon: ScheduleSend,
      action: 'schedulePaymentVoucher',

      requiredPermissions: [],
    },
    {
      name: 'Post Payment to Ledger',
      icon: CheckCircleOutline,
      action: 'postPaymentToLedger',

      requiredPermissions: [],
    },

    {
      name: 'Post Payment Voucher',
      icon: CheckCircle,
      action: 'postPaymentVoucher',
      requiredPermissions: [],
    },

    {
      name: 'Generate Budget Upload Template',
      icon: Launch,
      action: 'generateBudgetUploadTemplate',
      requiredPermissions: [],
    },
    {
      name: 'Create Budget from Excel',
      icon: PostAdd,
      action: 'uploadGeneralBudget',
      requiredPermissions: [],
    },
    {
      name: 'Reconcile Bank Statement',
      icon: CheckCircle,
      action: 'postReconciliation',
      requiredPermissions: [],
    },

    {
      name: 'Export Schedule Lines to Excel',
      icon: Launch,
      image: '/excel.png',
      action: 'exportScheduleLines',
      disabled: false,
      requiredPermissions: [],
    },
    {
      name: 'Add Payment(s) to Schedule',
      icon: Add,
      action: 'addPaymentsToSchedule',
      requiredPermissions: [],
    },
    {
      name: 'Remove Payment(s) from Schedule',
      icon: PlaylistRemove,
      action: 'removePaymentsFromSchedule',
      requiredPermissions: [],
    },

    {
      name: 'Create Change Request',
      icon: PlaylistAdd,
      action: 'createChangeRequest',
      requiredPermissions: [],
    },
    {
      name: 'Approve Change Request',
      icon: CheckCircle,
      action: 'approveChangeRequest',
      requiredPermissions: [],
    },
    {
      name: 'Generate Contribution Upload Template',
      icon: Launch,
      action: 'generateContributionUploadTemplate',
      requiredPermissions: [],
    },
    {
      name: 'Submit Contributions for Approval',
      icon: Send,
      action: 'submitContributionsForApproval',
      requiredPermissions: [],
    },
    {
      name: 'Submit Budget for Approval',
      icon: Send,
      action: 'submitBudgetForApproval',
      requiredPermissions: [],
    },
    {
      name: 'Close Accounting Period',
      icon: Cancel,
      action: 'closePeriod',
      requiredPermissions: [],
    },
    // {
    //   name: 'Create Payroll Record',
    //   icon: Add,
    //   action: 'createPayrollRecord',
    //   requiredPermissions: [],
    //   status: [7],
    // },
    {
      name: 'Trial Run',
      icon: Replay,
      action: 'trialRun',
      requiredPermissions: [],
    },
    {
      name: 'Run Payroll Increment',
      icon: TrendingUp,
      action: 'runIncrement',
      requiredPermissions: [],
    },
    {
      name: 'Stop Payroll',
      icon: Cancel,
      action: 'stopPayroll',
      requiredPermissions: [],
    },
    {
      name: 'Approve Payroll Stop',
      icon: TaskAlt,
      action: 'approvePayrollStop',
      requiredPermissions: [],
    },
    {
      name: 'Resume Payroll',
      icon: Replay,
      action: 'resumePayroll',
      requiredPermissions: [],
    },
    {
      name: 'Send Payroll for Approval',
      icon: Send,
      action: 'sendPayrollForApproval',
      requiredPermissions: [],
    },
    {
      name: 'Export to Excel',
      icon: OpenInNew,
      image: '/excel.png',
      action: 'exportDataToExcel',
      requiredPermissions: [],
    },
    {
      name: 'Create Payment Voucher',
      icon: PostAdd,
      action: 'createPayrollPaymentVoucher',
      requiredPermissions: [],
    },

    {
      name: 'Generate Return Template',
      icon: Launch,
      action: 'generateReturnTemplate',
      requiredPermissions: [],
    },
    {
      name: 'Upload Return',
      icon: PostAdd,
      action: 'uploadReturn',
      requiredPermissions: [],
    },
    {
      name: "Unlock User's Account",
      icon: LockOpen,
      action: 'unlockUserAccount',
      requiredPermissions: [],
    },
    {
      name: 'Revert Payment Voucher',
      icon: Replay,
      action: 'revertPaymentVoucher',
      requiredPermissions: [],
    },
    {
      name: 'Admit Pensioner(s) to Payroll',
      icon: IosShare,
      action: 'admit',
      requiredPermissions: [],
    },
    {
      name: 'Run Payroll',
      icon: TrendingUp,
      action: 'runPayroll',
      requiredPermissions: [],
    },
    {
      name: 'Add Return',
      icon: PlaylistAdd,
      action: 'addReturn',
      requiredPermissions: [],
    },
    {
      name: 'Create Return Receipt',
      icon: PlaylistAdd,
      action: 'createReturnReceipt',
      requiredPermissions: [],
    },
    {
      name: 'Add return to IGC',
      icon: PlaylistAdd,
      action: 'addReturnToIGC',
      requiredPermissions: [],
    },
    {
      name: 'Submit Return for Approval',
      icon: Send,
      action: 'submitReturnForApproval',
      requiredPermissions: [],
    },
    {
      name: 'Add New Beneficiary',
      action: 'initiateDependentEnrollment',
      icon: PostAdd,
      requiredPermissions: [],
    },
    {
      name: 'Initiate Change of PayPoint',
      action: 'initiateChangeOfPayPoint',
      icon: AddCard,
      requiredPermissions: [],
    },
    {
      name: 'Initiate Revised Case',
      action: 'initiateRevisedCase',
      icon: PostAdd,
      requiredPermissions: [],
    },
    {
      name: 'Send IGC for Approval',
      action: 'sendIGCForApproval',
      icon: Send,
      requiredPermissions: [],
    },
    {
      name: 'Move IGC Status',
      icon: IosShare,
      action: 'moveStatusIgc',
      requiredPermissions: [],
    },
    {
      name: 'Create Dependants Claims',
      icon: Add,
      action: 'createDependantClaims',
      requiredPermissions: [],
    },
  ];

  const collapseParents = [
    {
      name: 'Approvals',
      icon: Rule,
      action: 'approvalRequest',
      requiredPermissions: [],
      status: [1],
    },

    {
      name: 'Match',
      icon: TaskAlt,
      action: 'match',
      requiredPermissions: [],
    },
    {
      name: 'Bank Statement',
      icon: CloudUpload,
      action: 'bankStatement',
      requiredPermissions: [],
    },
    {
      name: 'Upload Members',
      icon: CloudUpload,
      action: 'uploadMembers',
      requiredPermissions: [],
    },
    {
      name: 'Change Request',
      icon: EditNote,
      action: 'changeRequest',
      requiredPermissions: [],
    },
  ];

  const collapseChildren = [
    // Change Request Actions

    {
      name: 'Send For Approval',
      icon: IosShare,
      action: 'sendChangeRequestForApproval',
      requiredPermissions: [],
      parent: 'changeRequest',
      disabled: true,
    },
    {
      name: 'Cancel Change Request',
      icon: CancelScheduleSend,
      action: 'cancelChangeRequest',
      requiredPermissions: [],
      parent: 'changeRequest',
      disabled: true,
    },

    // Bank Statement Actions
    {
      name: 'Generate Bank Statement Template',
      icon: Launch,
      action: 'generateBankStatementTemplate',
      requiredPermissions: [],
      parent: 'bankStatement',
      disabled: true,
    },
    {
      name: 'Upload Bank Statement',
      icon: PostAdd,
      action: 'importBankStatement',
      requiredPermissions: [],
      parent: 'bankStatement',
      disabled: true,
    },
    {
      name: 'Remove Current Statement',
      icon: PlaylistRemove,
      action: 'removeUploadedStatement',
      requiredPermissions: [],
      parent: 'bankStatement',
      disabled: true,
    },

    // Match Actions
    {
      name: 'Match Manually',
      icon: TaskAlt,
      action: 'matchManually',
      requiredPermissions: [],
      parent: 'match',
      disabled: true,
    },
    {
      name: 'Remove Match',
      icon: Cancel,
      action: 'removeMatch',
      requiredPermissions: [],
      parent: 'match',
      disabled: true,
    },

    // Approval Request Actions
    {
      name: 'Send For Approval',
      action: 'sendApprovalRequest',
      //   disabled: approvalActions?.sendForApproval,
      disabled: false,
      icon: IosShare,
      parent: 'approvalRequest',
    },
    {
      name: 'Cancel Approval Request',
      action: 'cancelApprovalRequest',
      icon: CancelScheduleSend,
      disabled: approvalActions?.cancelApprovalRequest,
      parent: 'approvalRequest',
    },
    {
      name: 'Approve',
      action: 'approveDocument',
      icon: Check,

      disabled: approvalActions?.approve,
      parent: 'approvalRequest',
    },
    {
      name: 'Reject',
      action: 'rejectDocumentApproval',
      icon: Cancel,
      disabled: approvalActions?.reject,
      parent: 'approvalRequest',
    },
    {
      name: 'Delegate',
      action: 'delegateApproval',
      icon: PersonAddAlt,
      disabled: approvalActions?.delegate,
      parent: 'approvalRequest',
    },

    {
      name: 'Generate Members Template',
      icon: Launch,
      action: 'generateMembersTemplate',

      disabled: true,
      parent: 'uploadMembers',
      requiredPermissions: [],
    },
    {
      name: 'Upload Members(xlsx)',
      icon: Upload,
      action: 'uploadMembers',
      requiredPermissions: [],
      disabled: true,
      parent: 'uploadMembers',
    },
  ];

  const handleApprovalClick = (action) => {
    if (parentAction === action) {
      // If the same parent is clicked, toggle the approval buttons
      setShowApprovalButtons(!showApprovalButtons);
    } else {
      // If a different parent is clicked, set the new parent and show the approval buttons
      setParentAction(action);
      setShowApprovalButtons(true);
    }
  };
  // Define the reports button
  const reportsButton = {
    name: 'Reports',
    icon: BarChart,
    action: 'reports',
    requiredPermissions: ['reports'],
  };

  const openDetailsButton = {
    name: 'Open Details',
    icon: Info,
    action: 'openDetails',
    requiredPermissions: [],
    status: [8],
  };

  // Function to handle item click
  const handleItemClick = () => {
    setItemClicked(true);
  };
  const [isSearchActive, setIsSearchActive] = useState(false);

  const renderButtons = () => {
    return buttons
      .filter((button) => !button.status || button.status.includes(status))
      .filter((button) => !button.action || handlers[button.action])
      .map((button, index) => (
        <div key={index}>
          {button.action === 'search' && isSearchActive ? (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              onBlur={() => setIsSearchActive(false)}
              sx={{ mb: -1, maxHeight: '25px', ml: -1 }}
              onChange={(e) => setSearchedValue(e.target.value)}
              autoFocus={isSearchActive}
            />
          ) : (
            <Button
              onClick={() => {
                if (button.action === 'search') {
                  setIsSearchActive(true);
                } else {
                  handleItemClick();
                  handlers[button.action]();
                }
              }}
              sx={{ mb: -1, maxHeight: '25px' }}
              disabled={
                button.requiredPermissions.some(
                  (permission) => !permissions?.includes(permission)
                ) || button.disabled
              }
              startIcon={
                button.image ? (
                  <img
                    src={button.image}
                    alt="excel"
                    className=""
                    height={18}
                    width={24}
                  />
                ) : (
                  <button.icon
                    sx={{
                      fontSize: '20px',
                      mr: '2px',
                      color:
                        button.requiredPermissions.some(
                          (permission) => !permissions?.includes(permission)
                        ) || button.disabled
                          ? 'gray'
                          : 'primary',
                    }}
                    color="primary"
                  />
                )
              }
            >
              <p className="font-medium text-gray -ml-2 text-sm">
                {button.name}
              </p>
            </Button>
          )}
        </div>
      ));
  };
  const renderApprovalButtons = () => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Divider
          sx={{
            ml: '-9px',
            borderColor: '#ededed',
          }}
        />

        <div className="flex flex-row pt-1">
          {collapseChildren
            .filter((button) => button.parent === parentAction)
            .map((button, index) => (
              <Button
                key={index}
                disabled={!button.disabled}
                onClick={() => handlers[button.action]()}
                sx={{ mb: -1, maxHeight: '23px', ml: 1 }}
                startIcon={
                  <button.icon
                    sx={{
                      fontSize: '20px',
                      mr: '-3px',
                      color: !button.disabled ? 'gray' : 'primary',
                    }}
                  />
                }
              >
                {button.name}
              </Button>
            ))}
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col w-full ">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          paddingRight: '20px',
          marginLeft: '10px',
        }}
      >
        <div className="flex gap-6 items-center">
          {renderButtons()}

          <div className="flex gap-6 items-center">
            {collapseParents.map((button, index) => (
              <Button
                onClick={() => {
                  handleApprovalClick(button.action);
                  handlers[button.action]();
                }}
                sx={{
                  mb: -1,
                  maxHeight: '25px',
                  display: handlers[button.action] ? 'content' : 'none',
                }}
                startIcon={
                  <button.icon
                    sx={{
                      mr: '-3px',
                      fontSize: '20px',
                      color: 'primary',
                    }}
                  />
                }
              >
                <div className="ml-[-2px]">{button.name}</div>
              </Button>
            ))}

            {/* Conditionally render additional buttons */}
          </div>
        </div>
        <div>
          <Button
            onClick={handleMenuOpen}
            sx={{ mb: -1, maxHeight: '25px' }}
            disabled={
              reportItems?.length === 0 ||
              !reportItems ||
              !reportItems.length > 0
            }
            startIcon={
              <IconButton disabled={hasReportItems ? false : true}>
                <reportsButton.icon
                  sx={{
                    fontSize: '20px',
                    color: !hasReportItems ? 'gray' : '#006990',
                  }}
                />
              </IconButton>
            }
          >
            <p className="font-medium text-gray -ml-2 text-sm">
              {reportsButton.name}
            </p>
          </Button>

          {reportItems && reportItems.length > 0 && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={
                {
                  // '& .MuiPaper-root': {
                  //   width: '200px', // Adjust the width as needed
                  //   // backgroundColor: '#f5f5f5', // Optional: change background color
                  // },
                }
              }
            >
              {reportItems.map((item, index) => (
                <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          )}
          <Button
            onClick={handlers[openDetailsButton.action]}
            sx={{
              mb: -1,
              maxHeight: '25px',
              display: handlers[openDetailsButton.action] ? 'content' : 'none',
            }}
            startIcon={
              <IconButton>
                <openDetailsButton.icon
                  sx={{
                    fontSize: '16px',
                    color: 'primary',
                  }}
                />
              </IconButton>
            }
          >
            <p className="font-medium text-gray -ml-3 text-sm">
              {openDetailsButton.name}
            </p>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showApprovalButtons && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 160, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
            className="flex flex-col w-full mt-3 ml-2 px-2"
          >
            {renderApprovalButtons()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListNavigation;
