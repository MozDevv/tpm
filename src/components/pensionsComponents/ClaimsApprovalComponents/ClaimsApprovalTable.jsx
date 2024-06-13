"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { DummyData } from "./DummyData";
import { useRouter } from "next/navigation";
import { useIsLoading } from "@/context/LoadingContext";

const ClaimsApprovalTable = () => {
  const [filteredData, setFilteredData] = useState(DummyData);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleDocTypeChange = (event) => {
    const selectedType = event.target.textContent; // Get the selected document type from the menu item
    setSelectedDocType(selectedType);
    filterData(selectedType); // Filter the data based on the selected document type
    setAnchorEl2(null); // Close the menu after selecting an option
  };

  const handleFilterByDate = () => {
    const filteredByDate = DummyData.filter(
      (item) => item.date === "2024-05-26"
    );
    setFilteredData(filteredByDate);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const filterData = (selectedType) => {
    const filtered = DummyData.filter((item) => item.docType === selectedType);
    setFilteredData(filtered);
  };

  const { isLoading, setIsLoading } = useIsLoading();

  const router = useRouter();
  const handleRowClick = (e, id) => {
    setIsLoading(true);
    e.stopPropagation();
    router.push(`/pensions/claims-approval/${id}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            mt: 2,
            p: 2,
            flexDirection: "column",
          }}
        >
          <Typography variant="h2">Approval</Typography>
          <Typography
            variant="body"
            sx={{ fontSize: "15px", color: "GrayText" }}
          >
            Approval Listing
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "25px", mr: 6, mt: 6 }}>
          <Button onClick={handleFilterByDate} variant="outlined" size="small">
            Filter By Date
          </Button>
          <Button onClick={handleClick2} variant="outlined" size="small">
            Doc Type
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
            <MenuItem onClick={handleDocTypeChange}>Payment Voucher</MenuItem>
            <MenuItem onClick={handleDocTypeChange}>Receipt</MenuItem>
            <MenuItem onClick={handleDocTypeChange}>Claims</MenuItem>
          </Menu>
          <Button variant="outlined" size="small">
            Due Date
          </Button>
          <Button variant="contained">Add New</Button>
        </Box>
      </Box>
      <Paper sx={{ p: 1, maxWidth: "98%", mt: 2 }}>
        {" "}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Doc Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell
                    color="primary"
                    sx={{ fontWeight: 600, color: "GrayText" }}
                  >
                    {row.docType}
                  </TableCell>
                  <TableCell>{row.sender}</TableCell>
                  <TableCell sx={{ color: "gray" }}>{row.date}</TableCell>
                  <TableCell sx={{ color: "gray" }}>{row.dueDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ maxHeight: "23px", fontSize: "11px" }}
                      startIcon={<Visibility fontSize="small" />}
                      onClick={(e) => handleRowClick(e, row.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ClaimsApprovalTable;
