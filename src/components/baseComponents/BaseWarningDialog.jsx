import React from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const BaseWarningDialog = ({ open, onClose, onConfirm, message }) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="warning-dialog-title"
      aria-describedby="warning-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <CustomDialogTitle id="warning-dialog-title">
        <Box display="flex" alignItems="center">
          <Warning color="warning" fontSize="large" sx={{ fontSize: '32px' }} />
          <Typography
            variant="h6"
            component="span"
            sx={{ fontSize: '18px' }}
            marginLeft={1}
          >
            Warning
          </Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <Close />
        </IconButton>
      </CustomDialogTitle>
      <DialogContent>
        <p
          className="text-gray-800 mb-4 text-base"
          id="warning-dialog-description"
        >
          {message}
        </p>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          px: 3,
          mb: 1,
        }}
      >
        <Button color="primary" onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Proceed Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BaseWarningDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  message: PropTypes.string.isRequired,
};

export default BaseWarningDialog;
