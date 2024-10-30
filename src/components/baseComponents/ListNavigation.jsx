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
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import { Divider } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const ListNavigation = ({ handlers, status, clickedItem, selectedRows }) => {
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const [itemClicked, setItemClicked] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(false);

  const [approvalActions, setApprovalActions] = useState([]);
  const [parentAction, setParentAction] = useState(null);

  const userId = auth.user ? auth.user.userId : null;

  const getApprovalActionsForUser = async () => {
    const data = {
      userId: userId,

      //TODO - uncomment this line when the API is ready
      documentNo: clickedItem?.no_series
        ? clickedItem?.no_series
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
        console.log('approver actions', res.data);
      }
    } catch (error) {
      console.log('clickedItem?.no_series', clickedItem?.no_series);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getApprovalActionsForUser();
  }, [clickedItem]);

  // Define buttons with required permissions
  const buttons = [
    {
      name: 'Filter',
      icon: FilterList,
      action: 'filter',
      requiredPermissions: [],
    },
    {
      name: 'Open in Excel',
      icon: OpenInNew,
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
      requiredPermissions: ['preclaims.delete.prospective_pensioner'],
    },
    {
      name: 'Notify',
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
      name: 'Return to Approval',
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
      name: 'Return to Claims ',
      icon: Undo,
      action: 'returnToClaimsApprovals',
      requiredPermissions: [],
      status: [3],
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
      status: [4],
    },
    {
      name: 'View Complete Summary',
      icon: Launch,
      action: 'viewComputationSummary',
      requiredPermissions: [],
    },
    {
      name: 'Move to Assessment Approval',
      icon: Send,
      action: 'moveToAssessmentApproval',
      requiredPermissions: [],
      status: [3],
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
      name: 'Submit Payment for Approval',
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
      icon: FileDownload,
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
      name: 'Search',
      icon: ArticleOutlined,
      action: 'search',
      requiredPermissions: [],
      disabled: true,
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
  ];

  const collapseChildren = [
    // Bank Statement Actions

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
      disabled: approvalActions?.sendForApproval,
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
  ];

  const handleApprovalClick = (action) => {
    setParentAction(action);
    setShowApprovalButtons(!showApprovalButtons);
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

  // Render buttons based on permissions and status
  const renderButtons = () => {
    return buttons
      .filter((button) => !button.status || button.status.includes(status))
      .filter((button) => !button.action || handlers[button.action])
      .map((button, index) => (
        <Button
          key={index}
          onClick={() => {
            handleItemClick();
            handlers[button.action]();
          }}
          sx={{ mb: -1, maxHeight: '25px' }}
          disabled={
            button.requiredPermissions.some(
              (permission) => !permissions?.includes(permission)
            ) || button.disabled
          }
          startIcon={
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
          }
        >
          <p className="font-medium text-gray -ml-2 text-sm">{button.name}</p>
        </Button>
      ));
  };

  const renderApprovalButtons = () => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Divider sx={{ borderColor: '#ededed' }} />
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
                onClick={() => handleApprovalClick(button.action)}
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
            onClick={handlers[reportsButton.action]}
            sx={{ mb: -1, maxHeight: '25px' }}
            disabled={
              !permissions?.includes(reportsButton.requiredPermissions[0])
            }
            startIcon={
              <IconButton
                // disabled={
                //   !permissions?.some((permission) =>
                //     reportsButton.requiredPermissions.includes(permission)
                //   )
                // }
                disabled
              >
                <reportsButton.icon
                  sx={{
                    fontSize: '20px',
                    // color: !permissions?.some((permission) =>
                    //   reportsButton.requiredPermissions.includes(permission)
                    // )
                    //   ? "gray"
                    //   : "primary",
                    color: 'gray',
                  }}
                />
              </IconButton>
            }
          >
            <p className="font-medium text-gray -ml-2 text-sm">
              {reportsButton.name}
            </p>
          </Button>
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
