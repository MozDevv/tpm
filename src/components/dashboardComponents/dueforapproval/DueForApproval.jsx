import React from "react";
import {
  List,
  Card,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";

function DueForApproval() {
  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      date: "2023-05-01",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "Jane Smith",
      date: "2023-05-02",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Alice Johnson",
      date: "2023-05-03",
      avatar: "https://via.placeholder.com/40",
    },
  ];
  return (
    <Card
      sx={{
        backgroundColor: "white",
        height: "450px",
        borderRadius: "20px",
        p: "10px",
        m: "0 20px",
      }}
    >
      <Box
        sx={{
          ml: "20px",
          fontWeight: 700,
          color: "#006990",
        }}
      >
        {" "}
        Due for Approval
      </Box>
      <List>
        {dummyData.map((item) => (
          <ListItem key={item.id} sx={{ alignItems: "center" }}>
            <ListItemAvatar>
              <Avatar sx={{ height: "25px", width: "25px" }} />
            </ListItemAvatar>
            <ListItemText
              sx={{
                fontSize: "12px",
                color: "#006990",

                ml: "-20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                {" "}
                {item.name}
              </Typography>
            </ListItemText>
            <ListItemText sx={{ fontSize: "12px", color: "gray", ml: "3px" }}>
              <Typography sx={{ fontSize: "13px" }}> 12/02/2024 </Typography>
            </ListItemText>

            <IconButton edge="end" aria-label="edit">
              <EditIcon sx={{ fontSize: "13px", color: "#bfbfbf" }} />
            </IconButton>
            <IconButton edge="end" aria-label="copy">
              <FileCopyIcon
                sx={{ fontSize: "13px", mr: "10px", color: "#bfbfbf" }}
              />
            </IconButton>
            <Button
              variant="contained"
              sx={{
                marginLeft: 1,
                maxHeight: "20px",
                textTransform: "none",
                fontSize: "12px",
              }}
            >
              view
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default DueForApproval;
