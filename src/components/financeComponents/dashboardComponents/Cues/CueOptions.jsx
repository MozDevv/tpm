"use client";
import {
  Add,
  Delete,
  DeleteOutlineOutlined,
  FilterAlt,
  ListAlt,
  OpenInFull,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import ListIcon from "@mui/icons-material/List";

function CueOptions() {
  //const { auth, login, logout } = useAuth();
  return (
    <div className="flex  items-center justify-between">
      <div className="flex gap-5 items-center">
        <div>
          <TextField
            type="text"
            size="small"
            sx={{
              "&.MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "30px", // Set your desired border radius
                },
              },
            }}
            InputProps={{
              style: {
                backgroundColor: "white",
                width: "180px",
                borderRadius: "30px",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
          />
        </div>
        <div className="flex items-center">
          <IconButton>
            <Add color="primary" />
          </IconButton>
          <p className="font-medium -ml-2 text-sm">New</p>
        </div>
        <div
          className="flex items-center"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <IconButton>
            <DeleteOutlineOutlined color="primary" />
          </IconButton>
          <p className="font-medium -ml-2 text-sm">Delete</p>
        </div>

        <div className="flex items-center gap-1">
          <img src="/excel.png" height={20} width={20} />
          <p className="font-medium text-sm">Open in Excel</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <IconButton>
          <FilterAlt fontSize="small" color="primary" />
        </IconButton>
        <IconButton>
          <ListIcon fontSize="small" color="primary" />
        </IconButton>
        <IconButton>
          <OpenInFull fontSize="small" color="primary" />
        </IconButton>
      </div>
    </div>
  );
}

export default CueOptions;
