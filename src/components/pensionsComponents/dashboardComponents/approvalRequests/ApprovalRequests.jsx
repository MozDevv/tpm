"use client";
import React from "react";
import { Check, Clear, ClearAllRounded } from "@mui/icons-material";
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
} from "@mui/material";
import ScrollBar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

function ApprovalRequests() {
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
    <Box
      sx={{
        maxHeight: "100%",
        p: 2,
        overflowY: "auto",
      }}
    >
      <Typography color="primary" sx={{ fontSize: "16px", fontWeight: 700 }}>
        Approval Requests
      </Typography>
      <List>
        {approvalRequests.map((request) => (
          <ListItem sx={{ display: "flex" }} key={request.id}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>
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
                    <Clear sx={{ color: "crimson", ml: 1 }} fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ApprovalRequests;
