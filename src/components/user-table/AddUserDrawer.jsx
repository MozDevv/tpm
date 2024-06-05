"use client";
import React, { useState } from "react";
import {
  Drawer,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import authEndpoints, { AuthApiService } from "../services/authApi";

export default function AddUserDrawer({ drawerOpen, setDrawerOpen }) {
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      department: formData.get("department"),
      role: formData.get("role"),
      employeeNumber: formData.get("employeeNumber"),
      email: formData.get("email"),
    };
    console.log(userData);

    const token = localStorage.getItem("token");

    try {
      const res = await AuthApiService.post(authEndpoints.register(userData));

      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setDrawerOpen(false);
    }
  };
  const [selectedRole, setSelectedRole] = useState("Admin");

  return (
    <div>
      <IconButton
        color="primary"
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#006990",
          "&:hover": {
            backgroundColor: "#004a6e",
          },
        }}
      >
        <AddIcon sx={{ color: "white" }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 500,
            padding: 3,
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 600, mt: 2, color: "#006990" }}
          >
            Add New User
          </Typography>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              First Name*
            </FormLabel>
            <TextField
              name="firstName"
              variant="outlined"
              size="small"
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Middle Name
            </FormLabel>
            <TextField
              name="middleName"
              variant="outlined"
              size="small"
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Last Name*
            </FormLabel>
            <TextField
              name="lastName"
              variant="outlined"
              size="small"
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Department*
            </FormLabel>
            <TextField
              name="department"
              variant="outlined"
              size="small"
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Role*
            </FormLabel>
            <Select
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              variant="outlined"
              size="small"
              required
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Business Admin">Business Admin</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
              <MenuItem value="Board Member">Board Member</MenuItem>
            </Select>{" "}
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Employee Number*
            </FormLabel>
            <TextField
              name="employeeNumber"
              variant="outlined"
              size="small"
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ fontSize: "11px", fontWeight: 600 }}>
              Email*
            </FormLabel>
            <TextField name="email" variant="outlined" size="small" required />
          </FormControl>
          <Button
            sx={{ mt: 3 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </Drawer>
    </div>
  );
}
