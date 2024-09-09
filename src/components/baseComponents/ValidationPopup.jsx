import React from "react";
import { Popover, Typography, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const ValidationPopup = ({ open, anchorEl, onClose, message }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        style: {
          padding: 10,
          maxWidth: 300,
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <Typography variant="body2" color="textSecondary" style={{ flex: 1 }}>
        {message}
      </Typography>
      <IconButton size="small" onClick={onClose}>
        <CancelIcon fontSize="small" />
      </IconButton>
    </Popover>
  );
};

export default ValidationPopup;
