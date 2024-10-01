import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  FilterList,
  OpenInNew,
  Create,
  Edit,
  Delete,
  Report,
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
  KeyboardReturn,
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
  PublishedWithChanges,
  ManageHistory,
  Settings,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const ListNavigation = ({ handlers, status }) => {
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const [itemClicked, setItemClicked] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(false);

  // Define buttons with required permissions
  const buttons = [
    {
      name: "Filter",
      icon: FilterList,
      action: "filter",
      requiredPermissions: [],
    },
    {
      name: "Open in Excel",
      icon: OpenInNew,
      action: "openInExcel",
      requiredPermissions: [],
    },
    {
      name: "Create",
      icon: Add,
      action: "create",
      requiredPermissions: [],
    },
    {
      name: "Edit",
      icon: Edit,
      action: "edit",
      requiredPermissions: ["update"],
    },
    {
      name: "Delete",
      icon: Delete,
      action: "delete",
      requiredPermissions: ["preclaims.delete.prospective_pensioner"],
    },
    {
      name: "Notify",
      icon: ForwardToInbox,
      action: "notify",
      requiredPermissions: [
        "preclaims.notify.prospective_pensioner",
        // "preclaims.execute.notify_prospective_pensioner",
      ],
      status: [0],
    },

    {
      name: "Approve",
      icon: CheckCircle,
      action: "approve",
      requiredPermissions: ["preclaims.approve.prospective_pensioner"],
      status: [1],
    },
    {
      name: "Submit For Approval",
      icon: Send,
      action: "submit",
      requiredPermissions: ["preclaims.execute.send_preclaim_for_approval"],
      status: [3],
    },
    {
      name: "Return to MDA for Clarification",
      icon: Undo,
      action: "movetoMDA",
      requiredPermissions: [],
      status: [0],
    },
    {
      name: "Move to Validation",
      icon: Send,
      action: "movetoValidation",
      requiredPermissions: [],
      status: [0],
    },
    {
      name: "Return to Verification",
      icon: Undo,
      action: "movetoVerification",
      requiredPermissions: [],
      status: [1],
    },
    {
      name: "Move to Approval",
      icon: Send,
      action: "moveToApproval",
      requiredPermissions: [],
      status: [1],
    },
    {
      name: "Return to Approval",
      icon: Undo,
      action: "returnToApproval",
      requiredPermissions: [],
      status: [2],
    },
    {
      name: "Move to Assessment",
      icon: Send,
      action: "moveToAssessment",
      requiredPermissions: [],
      status: [2],
    },

    {
      name: "Return to Claims ",
      icon: Undo,
      action: "returnToClaimsApprovals",
      requiredPermissions: [],
      status: [3],
    },
    {
      name: "Compute Claim",
      icon: Settings,
      action: "computeClaim",
      requiredPermissions: [],
      status: [4],
    },
    {
      name: "Move to Assessment Approval",
      icon: Send,
      action: "moveToAssessmentApproval",
      requiredPermissions: [],
      status: [3],
    },

    {
      name: "Approve Claim",
      icon: Send,
      action: "moveStatus",
      requiredPermissions: [],
      status: [2],
    },
    {
      name: "Create Branch",
      icon: AccountBalance,
      action: "createBranch",
      requiredPermissions: [],
      status: ["createBranch"],
    },
    {
      name: "Create Bank Type",
      icon: AddBusiness,
      action: "createBankType",
      requiredPermissions: [],
      status: ["createBranch"],
    },
    {
      name: "Add Constituency",
      icon: AddCircleOutline,
      action: "createConstituency",
      requiredPermissions: [],
      status: ["createConstituency"],
    },
    {
      name: "Create Number Series Line",
      icon: AddCircle,
      action: "numberSeriesLine",
      requiredPermissions: [],
      status: ["numberSeriesLine"],
    },
    {
      name: "Create Claim",
      icon: AddCircle,
      action: "createClaim",
      requiredPermissions: [],
      status: [5, 7],
    },
    {
      name: "Numbering Sections",
      icon: FormatListNumbered,
      action: "numberingSections",
      requiredPermissions: [],
    },
    {
      name: "Post to Ledger",
      icon: PostAdd,
      action: "postToGL",
      requiredPermissions: [],
    },
  ];

  const approvalButton = {
    name: "Approvals",
    icon: Rule,
    action: "approvalRequest",
    requiredPermissions: [],
    status: [1],
  };

  const additionalButtons = [
    {
      name: "Send Approval Request",
      action: "sendApprovalRequest",
      icon: IosShare,
    },
    {
      name: "Cancel Approval Request",
      action: "cancelApprovalRequest",
      icon: CancelScheduleSend,
    },
    {
      name: "Approve",
      action: "approve",
      icon: Check,
    },
    {
      name: "Reject",
      action: "cancel",
      icon: Cancel,
    },
    {
      name: "Delegate",
      action: "delegate",
      icon: PersonAddAlt,
    },
  ];

  const handleApprovalClick = () => {
    setShowApprovalButtons(!showApprovalButtons);
  };

  // Define the reports button
  const reportsButton = {
    name: "Reports",
    icon: BarChart,
    action: "reports",
    requiredPermissions: ["reports"],
  };

  const openDetailsButton = {
    name: "Open Details",
    icon: Info,
    action: "openDetails",
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
          sx={{ mb: -1, maxHeight: "25px" }}
          disabled={button.requiredPermissions.some(
            (permission) => !permissions?.includes(permission)
          )}
          startIcon={
            <button.icon
              sx={{
                fontSize: "20px",
                mr: "2px",
                color: button.requiredPermissions.some(
                  (permission) => !permissions?.includes(permission)
                )
                  ? "gray"
                  : "primary",
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
      <>
        {additionalButtons.map((button, index) => (
          <Button
            key={index}
            onClick={() => handlers[button.action]()}
            sx={{ mb: -1, maxHeight: "25px", ml: 1 }}
            startIcon={
              <button.icon
                sx={{
                  fontSize: "20px",
                  mr: "-3px",
                }}
                color="primary"
              />
            }
          >
            {button.name}
          </Button>
        ))}
      </>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
        paddingRight: "20px",
        marginLeft: "10px",
      }}
    >
      <div className="flex gap-6 items-center">
        {renderButtons()}

        <div>
          <Button
            onClick={handleApprovalClick}
            sx={{
              mb: -1,
              maxHeight: "25px",
              display: handlers[approvalButton.action] ? "content" : "none",
            }}
            startIcon={
              <approvalButton.icon
                sx={{
                  mr: "-3px",
                  fontSize: "20px",
                  color: "primary",
                }}
              />
            }
          >
            <div className="ml-[-2px]">{approvalButton.name}</div>
          </Button>
          {showApprovalButtons && renderApprovalButtons()}{" "}
          {/* Conditionally render additional buttons */}
        </div>
      </div>
      <div>
        <Button
          onClick={handlers[reportsButton.action]}
          sx={{ mb: -1, maxHeight: "25px" }}
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
                  fontSize: "20px",
                  // color: !permissions?.some((permission) =>
                  //   reportsButton.requiredPermissions.includes(permission)
                  // )
                  //   ? "gray"
                  //   : "primary",
                  color: "gray",
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
            maxHeight: "25px",
            display: handlers[openDetailsButton.action] ? "content" : "none",
          }}
          startIcon={
            <IconButton>
              <openDetailsButton.icon
                sx={{
                  fontSize: "16px",
                  color: "primary",
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
  );
};

export default ListNavigation;
