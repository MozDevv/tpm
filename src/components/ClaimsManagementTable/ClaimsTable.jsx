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
} from "@mui/material";

// Dummy data generator function
const generateDummyData = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      id: Math.floor(Math.random() * 1000000),
      dateCreated: new Date().toISOString().split("T")[0],
      contactId: `C${1000 + i}`,
      noValue: Math.floor(Math.random() * 1000),
      date: new Date().toISOString().split("T")[0],
      status: i % 2 === 0 ? "Active" : "Inactive",
      action: "View",
    });
  }
  return data;
};

const ClaimsTable = () => {
  const [dummyData, setDummyData] = useState([]);

  useEffect(() => {
    setDummyData(generateDummyData());
  }, []);

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
            pl: 6,
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <Typography variant="h2">Claims</Typography>
          <Typography variant="h6" fontSize={13} color="GrayText">
            Claims Listing
          </Typography>
        </Box>
        <Box>
          <Button variant="contained">Add New</Button>
        </Box>
      </Box>
      <Box sx={{ width: "90%", mx: "auto", mt: 3 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {" "}
                  <TableCell sx={{ fontWeight: 700 }}>Schema</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}> Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          sx={{ height: "28px", width: "28px" }}
                        />
                        <Typography
                          variant="body"
                          fontWeight={600}
                          color="GrayText"
                        >
                          Agile/66
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {row.dateCreated}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {row.contactId}
                    </TableCell>
                    <TableCell>{row.noValue}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell sx={{ color: "orange" }}>pending</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small">
                        {row.action}
                      </Button>
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

export default ClaimsTable;
