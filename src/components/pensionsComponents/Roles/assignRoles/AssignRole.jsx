"use client";
import {
  Box,
  Checkbox,
  Dialog,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function AssignRole({ openPermissions, setOpenPermissions }) {
  const [allPermissions, setAllPermissions] = useState([]); // [1

  useEffect(() => {
    // Fetch permissions data from the API
    fetch("https://pmis.agilebiz.co.ke/api/PermissionsSetup/GetPermissions")
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess) {
          /*const permissions = data.data.reduce((acc, permission) => {
            if (permission.table?.permissions) {
              acc.push(
                ...permission.table.permissions.filter((p) => p !== null)
              );
            }
            return acc;
          }, []);

          */
          setAllPermissions(data.data);
        }
      })
      .catch((error) => console.error("Error fetching permissions:", error));
  }, []);

  const chunkedPermissions = [[], [], []];
  allPermissions.forEach((permission, index) => {
    chunkedPermissions[index % 3].push(permission);
  });

  const handlePermissionChange = (permissionId) => {
    setPermissionRoles((prev) => ({
      ...prev,
      [clickedRole]: {
        ...prev[clickedRole],
        [permissionId]: !prev[clickedRole][permissionId],
      },
    }));
  };
  return (
    <Dialog
      open={openPermissions}
      onClose={() => setOpenPermissions(false)}
      sx={{
        p: 4,
        "& .MuiDialog-paper": {
          //padding: "40px",
          maxWidth: "1000px",
          //width: "100%",
        },
      }}
    >
      <div className="p-8">
        <div className="text-primary text-base mt-3 font-semibold mb-4">
          Choose the permissions you want to assign the user
        </div>
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
                  <ListItem key={permission.permissionId}>
                    <Checkbox
                      /* checked={isPermissionChecked(
                              permission.permissionId
                            )} */
                      onChange={() =>
                        handlePermissionChange(permission.permissionId)
                      }
                    />
                    <Typography>{permission.description}</Typography>
                  </ListItem>
                ))}
              </List>
            ))}
          </Box>
        </Box>
      </div>
    </Dialog>
  );
}

export default AssignRole;
