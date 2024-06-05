"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";

const actions = ["View", "Add", "Edit", "Delete", "Approve", "Reject"];
const modules = [
  "Payments",
  "Account",
  "Roles",
  "Users",
  "Settings",
  "Bulk Notification",
  "Renew History",
  "Application Workflow",
  "Add Account",
  "Verify Add Account",
];

const roles = ["Admin", "Super Admin", "Operator", "Accountant"];

const UserRoleTable = () => {
  const [permissions, setPermissions] = useState({});

  const handleChange = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action],
      },
    }));
  };

  const renderCheckbox = (module, action) => (
    <Checkbox
      checked={permissions[module]?.[action] || false}
      onChange={() => handleChange(module, action)}
    />
  );

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            {actions.map((action) => (
              <TableCell key={action}>{action}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {modules.map((module) => (
            <TableRow key={module}>
              <TableCell component="th" scope="row">
                {module}
              </TableCell>
              {actions.map((action) => (
                <TableCell key={`${module}-${action}`}>
                  {renderCheckbox(module, action)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserRoleTable;
