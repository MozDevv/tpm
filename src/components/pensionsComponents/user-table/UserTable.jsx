"use client";
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SimplifiedTable({
  allClients,
  drawerOpen,
  setDrawerOpen,
}) {
  function createData(
    firstName,
    middleName,
    lastName,
    department,
    role,
    employeeNumber,
    email
  ) {
    return {
      firstName,
      middleName,
      lastName,
      department,
      role,
      employeeNumber,
      email,
    };
  }

  const rows = allClients.map((client) =>
    createData(
      client.firstName,
      client.middleName,
      client.lastName,
      client.department,
      client.role,
      client.employeeNumber,
      client.email
    )
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  const router = useRouter();
  const handleRowClick = (employeeNumber) => {
    router.push(`/pensions/users/${employeeNumber}`);
  };

  return (
    <Box sx={{ width: "96%", mx: "auto", pt: "40px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{ display: "flex", gap: "6px", flexDirection: "column", mb: 1 }}
        >
          <h6 style={{ fontSize: "20px", color: "#006990", fontWeight: 700 }}>
            User Management
          </h6>
          <h6 style={{ fontSize: "12px", color: "gray", mb: 1 }}>
            Manage all your users in one place
          </h6>
        </Box>
        <Link href="/pensions/users/newUser">
          <Button
            //onClick={() => setDrawerOpen(true)}
            variant="contained"
            size="small"
            sx={{ maxHeight: "40px" }}
            startIcon={<Person />}
          >
            Add new User
          </Button>
        </Link>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead sx={{ fontWeight: "bold" }}>
              <TableRow sx={{ fontWeight: "bold" }}>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Middle Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Employee Number
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    sx={{ cursor: "pointer" }}
                    hover
                    tabIndex={-1}
                    key={row.employeeNumber}
                    onClick={() => handleRowClick(row.employeeNumber)}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ height: 27, width: 27 }}></Avatar>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.firstName}
                    </TableCell>
                    <TableCell>{row.middleName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "GrayText" }}>
                      {row.department}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.employeeNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "GrayText" }}>
                      {row.email}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );

  function isActiveRow(appointmentDate) {
    const appointmentDateTime = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDateTime >= today;
  }
}
