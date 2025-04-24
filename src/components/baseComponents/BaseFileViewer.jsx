import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Close, PictureAsPdf } from '@mui/icons-material';

export default function BaseFileViewer({ file, onClose }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.primary.contrastText,
          py: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PictureAsPdf fontSize="large" />
          <Box>
            <Typography variant="h6">{file.name || 'Document'}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              PDF Document
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Close">
            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 1.5 }}>
        <Typography variant="caption" color="text.gray">
          Document Viewer • v1.0 2025
        </Typography>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
