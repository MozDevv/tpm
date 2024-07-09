"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  List,
  ListItem,
} from "@mui/material";
import endpoints from "@/components/services/setupsApi";

const roles = ["Business Admin", "Analyst", "Super Admin", "Admin"];

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  return <></>;
};

const UserRoleTable = ({ permissions, handleChange, renderCheckbox }) => {
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

  const actions = ["View", "Add", "Edit", "Delete", "Approve", "Reject"];

  return (
    <Box sx={{ overflow: "auto" }}>
      <table>
        <thead>
          <tr>
            <th className="text-sm">Action</th>
            {actions.map((action) => (
              <th key={action} className="text-sm font-normal ">
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module}>
              <td className="text-sm font-normal">{module}</td>
              {actions.map((action) => (
                <td key={action} className="text-xs font-normal">
                  {renderCheckbox(module, action)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

const RolePermissions = () => {
  const [selectedRole, setSelectedRole] = useState("Business Admin");
  const [permissions, setPermissions] = useState({});

  const [roles, setRoles] = useState([]); // [1]

  const fetchData = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles, {
        paging: { pageNumber, pageSize },
      });
      const { data, totalCount } = res.data;

      setRoles(data);

      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCheckbox = (module, action) => (
    <Checkbox
      checked={permissions[selectedRole]?.[module]?.[action] || false}
      onChange={() => handleChange(module, action)}
    />
  );

  return (
    <Grid container spacing={2} mt={4}>
      <Grid item xs={3} sx={{ backgroundColor: "white", maxHeight: "100%" }}>
        <RoleSelector
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      </Grid>
      <Grid item xs={8.5} sx={{ backgroundColor: "white" }}>
        <UserRoleTable
          permissions={permissions}
          handleChange={handleChange}
          renderCheckbox={renderCheckbox}
        />
      </Grid>
    </Grid>
  );
};

export default RolePermissions;
