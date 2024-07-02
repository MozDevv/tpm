"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Grid,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";

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

const UserRoleTable = () => {
  const [permissions, setPermissions] = useState([]);
  const [tables, setTables] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  useEffect(() => {
    fetchPermissions();
    fetchTables();
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await apiService.get(endpoints.getPermissions);
      const { data, totalCount } = res.data;
      if (res.status === 200) {
        setPermissions(data);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await apiService.get(endpoints.getTables);
      const { data, totalCount } = res.data;
      if (res.status === 200) {
        setTables(data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles);
      const { data, totalCount } = res.data;
      if (res.status === 200) {
        setRolesList(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const hasPermission = (tableId, action) => {
    return permissions.some(
      (permission) =>
        permission.tableId === tableId &&
        permission.name.toLowerCase() === action.toLowerCase()
    );
  };

  const renderCheckbox = (tableId, action) => (
    <Checkbox
      checked={hasPermission(tableId, action)}
      onChange={() => handlePermissionChange(tableId, action)}
    />
  );

  const handlePermissionChange = (tableId, action) => {
    // Implement logic to update permissions in your API
    console.log(`Permission changed for table ${tableId} - Action: ${action}`);
  };

  const [clickedRole, setClickedRole] = useState(null);

  return (
    <Grid container xs={12} sx={{ bgcolor: "white" }}>
      <Grid item xs={2.5} sx={{ maxHeight: "100%" }}>
        <p className="text-primary text-base mb-3 ml-5 mt-5 font-semibold">
          Roles
        </p>
        <Divider />
        <List
          sx={{
            mt: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {rolesList.map((role) => (
            <ListItem
              key={role.roleId}
              onClick={() => setClickedRole(role.roleId)}
              sx={{
                cursor: "pointer",
                // borderRadius: "15px",
                py: "12px",

                backgroundColor: clickedRole === role.roleId ? "#E5F0F4" : "",
              }}
            >
              <p className="text-black text-sm font-medium">{role.name}</p>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={9.5}>
        <TableContainer component={Paper} sx={{ maxWidth: "90%" }}>
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
              {tables.map((table) => (
                <TableRow key={table.tableId}>
                  <TableCell component="th" scope="row">
                    {table.name}
                  </TableCell>
                  {actions.map((action) => (
                    <TableCell key={`${table.tableId}-${action}`}>
                      {renderCheckbox(table.tableId, action)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default UserRoleTable;
