"use client";
import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Divider,
  Button,
  Typography,
  Grid,
  Checkbox,
  Box,
} from "@mui/material";
import CreatePermission from "./CreatePermission";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

const UserRoleTable = () => {
  const [clickedRole, setClickedRole] = useState(null);
  const [createPermission, setCreatePermission] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permissionRoles, setPermissionRoles] = useState({});

  useEffect(() => {
    // Fetch permissions data from the API
    fetch(
      "https://pmistest-api.treasury.go.ke/api/PermissionsSetup/GetPermissions"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          setAllPermissions(data.data);
        }
      })
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles);
      if (res.status === 200) {
        setRolesList(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const { alert, setAlert } = useAlert();

  const handlePermissionChange = async (permissionId) => {
    if (!clickedRole) return; // Handle no role selected

    const formData = new FormData();
    formData.append("roleId", clickedRole.roleId);
    formData.append("permissionId", permissionId);

    try {
      const res = await apiService.post(endpoints.permissionRoles, formData);
      console.log(res.data);
      if (res.status === 201) {
        // Update permissionRoles for the clicked role
        const updatedRolePermissions = [
          ...(permissionRoles[clickedRole.roleId] || []),
        ];
        const permissionIndex = updatedRolePermissions.findIndex(
          (permission) => permission.permissionID === permissionId
        );

        if (permissionIndex === -1) {
          updatedRolePermissions.push({ permissionID: permissionId });
        } else {
          updatedRolePermissions.splice(permissionIndex, 1);
        }

        const updatedPermissionRoles = {
          ...permissionRoles,
          [clickedRole.roleId]: updatedRolePermissions,
        };

        setPermissionRoles(updatedPermissionRoles);

        setAlert({
          open: true,
          message: "Permission updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error);
      console.log("formData", formData);
    }
  };

  const [permissionIds, setPermissionIds] = useState([]);

  const fetchPermissionRoles = async () => {
    try {
      if (!clickedRole) return;

      const res = await apiService.get(endpoints.getPermissionRoles, {
        RoleID: clickedRole.roleId,
      });

      if (res.status === 200) {
        setPermissionRoles((prev) => ({
          ...prev,
          [clickedRole.roleId]: res.data.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPermissionRoles();
  }, [clickedRole]);

  const isPermissionChecked = (permissionId) => {
    if (!clickedRole || !permissionRoles[clickedRole.roleId]) return false;

    return permissionRoles[clickedRole.roleId].some(
      (permissionRole) => permissionRole.permissionID === permissionId
    );
  };

  // Divide permissions into three columns
  const chunkedPermissions = [[], [], []];
  allPermissions.forEach((permission, index) => {
    chunkedPermissions[index % 3].push(permission);
  });

  console.log("chunkedPermissions", chunkedPermissions);
  return (
    <div className="px-5 mt-6">
      {createPermission && (
        <CreatePermission
          createPermission={createPermission}
          setCreatePermission={setCreatePermission}
        />
      )}
      <div className="flex w-full justify-between items-center">
        <Button variant="contained" color="primary">
          Create Role
        </Button>
      </div>
      <Grid container sx={{ bgcolor: "white", mt: 4 }}>
        <Grid item xs={2.5} sx={{ maxHeight: "100%" }}>
          <p className="text-primary mb-3 ml-5 mt-5 text-base">Roles</p>
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
                onClick={() => setClickedRole(role)}
                sx={{
                  cursor: "pointer",
                  py: "12px",
                  borderRadius: "5px",
                  backgroundColor:
                    clickedRole && clickedRole.roleId === role.roleId
                      ? "#E5F0F4"
                      : "",
                }}
              >
                <p className="text-gray-600 font-medium text-[13px]">
                  {role.name}
                </p>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={9.5}>
          {clickedRole ? (
            <div>
              <p className="text-primary mb-3 ml-6 mt-5 text-base font-semibold">
                Permissions for{" "}
                {
                  rolesList.find((role) => role.roleId === clickedRole.roleId)
                    ?.name
                }
              </p>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  {chunkedPermissions.map((column, columnIndex) => (
                    <List key={columnIndex} sx={{ flex: 1 }}>
                      {column.map((permission) => (
                        <ListItem key={permission?.permissionId}>
                          <Checkbox
                            checked={isPermissionChecked(
                              permission?.permissionId
                            )}
                            onChange={() =>
                              handlePermissionChange(permission?.permissionId)
                            }
                          />
                          <Typography>{permission?.description}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  ))}
                </Box>
              </Box>
            </div>
          ) : (
            <>
              <p className="text-gray-400 p-3 font-semibold text-base mt-8 ml-6">
                Select the role to view the permissions{" "}
              </p>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default UserRoleTable;
