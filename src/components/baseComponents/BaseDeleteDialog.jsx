import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Close, Warning } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const BaseDeleteDialog = ({ open, onClose, onDelete, itemName }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <CustomDialogTitle id="delete-dialog-title">
        <Box display="flex" alignItems="center">
          <Warning color="error" fontSize="large" sx={{ fontSize: "32px" }} />
          <Typography
            variant="h6"
            component="span"
            sx={{ fontSize: "18px" }}
            marginLeft={1}
          >
            Confirm Deletion
          </Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <Close />
        </IconButton>
      </CustomDialogTitle>
      <DialogContent>
        <p
          className="text-gray-800 mb-4 text-base"
          id="delete-dialog-description"
        >
          Are you sure you want to delete <strong>{itemName}</strong>?
        </p>
        <p className="text-gray-600 mt-5 text-sm">
          This action cannot be undone.
        </p>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          px: 3,
          mb: 1,
        }}
      >
        <Button color="primary" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseDeleteDialog;
