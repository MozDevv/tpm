'use client';
import { useState } from 'react';
import {
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from '@mui/material';

const useAuthDialog = () => {
  const [open, setOpen] = useState(false);

  const showDialog = () => setOpen(true);
  const hideDialog = () => setOpen(false);

  return {
    open,
    showDialog,
    hideDialog,
  };
};

const AuthDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Session Expired</DialogTitle>
    <DialogContent>
      Your session has expired. Please log in again to continue.
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export { useAuthDialog, AuthDialog };
