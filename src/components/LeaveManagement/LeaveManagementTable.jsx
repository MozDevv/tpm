"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { thColors } from "@/utils/thColors";
import { Edit, Visibility } from "@mui/icons-material";

// Dummy data generator function
const generateDummyData = () => {
  const data = [];
  const positions = [
    "Project Lead",
    "Finance Lead",
    "Accountant",
    "Designer",
    "Project Manager",
  ];
  const statuses = ["New Leave", "Pending", "Approved", "Rejected"];
  for (let i = 1; i <= 15; i++) {
    data.push({
      id: Math.floor(Math.random() * 1000000),
      applicantName: `Applicant ${i}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      numOfDays: Math.floor(Math.random() * 10),
      reason: "Work-related",
      reliever: "Treasury",
      status: statuses[Math.floor(Math.random() * statuses.length)],
      action: "View",
    });
  }
  return data;
};

const LeaveManagementTable = () => {
  const [dummyData, setDummyData] = useState([]);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    setDummyData(generateDummyData());
  }, []);

  const getStatusColor = () => {
    const randomIndex = Math.floor(Math.random() * thColors.length);
    const { bgColor } = thColors[randomIndex];
    return `${bgColor}66`;
  };

  return (
    <Box sx={{ pt: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mr: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            pl: 8,
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" color="primary">
            Leave Management
          </Typography>
          <Typography variant="h6" fontSize={13} color="GrayText">
            View Leaves Listings
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "25px", mr: 6, mt: 6 }}>
          <Button onClick={handleClick2} variant="outlined" size="small">
            Sort By
          </Button>
          <Menu
            id="msgs-menu"
            anchorEl={anchorEl2}
            keepMounted
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            sx={{
              "& .MuiMenu-paper": {
                width: "200px",
              },
            }}
          >
            <MenuItem>Position</MenuItem>
            <MenuItem>Start Date</MenuItem>
            <MenuItem>Status</MenuItem>
          </Menu>
          <Button variant="outlined" size="small">
            Designation
          </Button>
          <Button variant="contained">Add New</Button>
        </Box>
      </Box>
      <Box sx={{ width: "90%", mx: "auto", mt: 3 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Applicant Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>No. of Days</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reliever</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{ height: "24px", width: "24px" }}
                        />
                        <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                          {row.applicantName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: getStatusColor(row.status),
                          color: "black",
                          fontWeight: 500,
                          fontSize: "10px",
                          textAlign: "center",
                          padding: "3px 2px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.position}
                      </Box>
                    </TableCell>
                    <TableCell>{row.startDate}</TableCell>
                    <TableCell>{row.endDate}</TableCell>
                    <TableCell>{row.numOfDays}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>{row.reliever}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: "rgba(129, 199, 132, 0.2)",
                          color: "GrayText",
                          fontWeight: 500,
                          fontSize: "10px",
                          textAlign: "center",
                          padding: "3px 2px",
                          borderRadius: "20px",
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex" }}>
                        <IconButton>
                          <Visibility sx={{ fontSize: "15px" }} />
                        </IconButton>
                        <IconButton sx={{ ml: "-5px" }}>
                          <Edit sx={{ fontSize: "15px" }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default LeaveManagementTable;
