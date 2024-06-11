"use client";
import React from "react";
import {
  Check,
  Clear,
  ClearAllRounded,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Box,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import ScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

function ApprovalRequestsTable() {
  const approvalRequests = [
    {
      id: "002",
      name: "Jane Smith",
      date: "2024-05-02",
      avatarUrl: "https://via.placeholder.com/40",
    },
    {
      id: "003",
      name: "Alice Johnson",
      date: "2024-05-03",
      avatarUrl: "https://via.placeholder.com/40",
    },
    {
      id: "004",
      name: "Bob Brown",
      date: "2024-05-04",
      avatarUrl: "https://via.placeholder.com/40",
    },
    {
      id: "005",
      name: "Charlie Davis",
      date: "2024-05-05",
      avatarUrl: "https://via.placeholder.com/40",
    },
    {
      id: "009",
      name: "Grace Harris",
      date: "2024-05-09",
      avatarUrl: "https://via.placeholder.com/40",
    },
    {
      id: "010",
      name: "Henry Isaac",
      date: "2024-05-10",
      avatarUrl: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="over max-h-full overflow-y-auto p-2">
      <List>
        <Typography
          color="primary"
          sx={{
            display: "flex",
            fontSize: "12px",
            alignItems: "center",
            textDecoration: "underline",
            ml: "auto",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <KeyboardArrowRight fontSize="18px" />
          View All
        </Typography>
        {approvalRequests.map((request, index) => (
          <>
            <ListItem sx={{ display: "flex", mt: 1 }} key={index}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: 700, color: "black" }}
                  >
                    {request.name}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: "13px", fontWeight: 700, color: "gray" }}
                  >
                    {request.id}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: "13px", color: "GrayText" }}>
                    {request.date}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="approve">
                      <Check sx={{ color: "green" }} fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="decline">
                      <Clear
                        sx={{ color: "crimson", ml: 1 }}
                        fontSize="small"
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
}

export default ApprovalRequestsTable;
