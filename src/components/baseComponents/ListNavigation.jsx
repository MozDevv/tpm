import React from "react";
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
  QuestionMark,
  Send,
  Add,
  TrendingUp,
  Info,
  BarChart,
  AccountBalance,
  AddBusiness,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const ListNavigation = ({ handlers, status }) => {
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;
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
      requiredPermissions: ["preclaims.notify.prospective_pensioner"],
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
  ];

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
  // Render buttons based on permissions and status
  const renderButtons = () => {
    return buttons
      .filter((button) => !button.status || button.status.includes(status))
      .filter((button) => !button.action || handlers[button.action])
      .map((button, index) => (
        <Button
          key={index}
          onClick={handlers[button.action]}
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "25px",
        paddingRight: "20px",
        marginLeft: "20px",
      }}
    >
      <div className="flex gap-6 items-center">{renderButtons()}</div>
      <div className="">
        <Button
          onClick={handlers[reportsButton.action]}
          sx={{ mb: -1, maxHeight: "25px" }}
          disabled={
            !permissions?.includes(reportsButton.requiredPermissions[0])
          }
          startIcon={
            <IconButton
              disabled={
                !permissions?.some((permission) =>
                  reportsButton.requiredPermissions.includes(permission)
                )
              }
            >
              <reportsButton.icon
                sx={{
                  fontSize: "20px",
                  color: !permissions?.some((permission) =>
                    reportsButton.requiredPermissions.includes(permission)
                  )
                    ? "gray"
                    : "primary",
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
          // disabled={
          //   !permissions?.includes(openDetailsButton.requiredPermissions[0])
          // }
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
