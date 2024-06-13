"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

const recentClaims = [
  {
    id: "001",
    name: "John Doe",
    phoneNumber: "123-456-7890",
    organization: "ABC Corp",
    tenure: "2 years",
    date: "2024-05-01",
    status: "Approved",
  },
  {
    id: "002",
    name: "Jane Smith",
    phoneNumber: "234-567-8901",
    organization: "XYZ Inc",
    tenure: "1 year",
    date: "2024-05-02",
    status: "Pending",
  },
  {
    id: "003",
    name: "Alice Johnson",
    phoneNumber: "345-678-9012",
    organization: "LMN Ltd",
    tenure: "3 years",
    date: "2024-05-03",
    status: "Rejected",
  },
  {
    id: "004",
    name: "Bob Brown",
    phoneNumber: "456-789-0123",
    organization: "OPQ LLC",
    tenure: "4 years",
    date: "2024-05-04",
    status: "Approved",
  },
  {
    id: "005",
    name: "Charlie Davis",
    phoneNumber: "567-890-1234",
    organization: "RST Solutions",
    tenure: "6 months",
    date: "2024-05-05",
    status: "Pending",
  },
];

function RecentClaimsTable() {
  return (
    <div>
      {" "}
      <Typography
        color="primary"
        sx={{ fontSize: "16px", ml: 1, fontWeight: 700 }}
      >
        Recent Claims
      </Typography>
      <TableContainer sx={{ maxHeight: "350px" }}>
        <Table sx={{ overflowY: "auto" }} aria-label="recent claims table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Phone No
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Organization
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Tenure
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ color: "gray", fontSize: "13px", fontWeight: 600 }}
                >
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentClaims.map((claim, index) => (
              <TableRow key={claim.id}>
                <TableCell
                  sx={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500",
                    gap: "10px",
                  }}
                >
                  <Avatar sx={{ height: "26px", width: "26px" }} />
                  {claim.name}
                </TableCell>
                <TableCell sx={{ color: "gray", fontWeight: "400" }}>
                  {claim.phoneNumber}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "400" }}>
                  {claim.organization}
                </TableCell>
                <TableCell sx={{ color: "gray", fontWeight: "500" }}>
                  {claim.tenure}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "400" }}>
                  {claim.date}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "500",
                    color:
                      claim.status === "Approved"
                        ? "green"
                        : claim.status === "Rejected"
                        ? "red"
                        : claim.status === "Pending"
                        ? "orange"
                        : "gray",
                  }}
                >
                  {claim.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RecentClaimsTable;
