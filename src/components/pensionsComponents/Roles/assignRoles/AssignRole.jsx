"use client";
import endpoints, { apiService } from "@/components/services/setupsApi";
import {
  Box,
  Checkbox,
  Dialog,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AssignRole({ openPermissions, setOpenPermissions, userId }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    // Fetch all permissions data from the API
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

  const fetchUserPermissions = async () => {
    try {
      const res = await axios.get(
        `https://pmistest-api.treasury.go.ke/api/PermissionUserSetUp/GetPermissionsUser?userId=${userId}`
      );
      if (res.data.isSuccess) {
        setUserPermissions(res.data.data.map((perm) => perm.permissionId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [userId]);

  const chunkedPermissions = [[], [], []];
  allPermissions.forEach((permission, index) => {
    chunkedPermissions[index % 3].push(permission);
  });

  const handlePermissionChange = async (permissionId) => {
    const isPermissionAssigned = userPermissions.includes(permissionId);

    try {
      if (isPermissionAssigned) {
        // If permission is already assigned, remove it
        await apiService.post(
          endpoints.removePermissionsUser,
          new FormData()
            .append("userId", userId)
            .append("permissionId", permissionId)
        );
        setUserPermissions((prev) => prev.filter((id) => id !== permissionId));
      } else {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("permissionId", permissionId);

        await apiService.post(endpoints.createPermissionsUser, formData);

        console.log(formData);
        setUserPermissions((prev) => [...prev, permissionId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={openPermissions}
      onClose={() => setOpenPermissions(false)}
      sx={{
        p: 4,
        "& .MuiDialog-paper": {
          maxWidth: "1000px",
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
                      checked={userPermissions.includes(
                        permission.permissionId
                      )}
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
