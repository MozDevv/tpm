import { useState } from 'react';
import {
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  InsertDriveFile,
  Close,
  Download,
  PictureAsPdf,
  CalendarToday,
  Person,
  Update,
} from '@mui/icons-material';
import { useDocumentBase64 } from '../hooks/useDocumentBase64';

export default function BaseEdmsViewer({ doc, onClose }) {
  const { base64, loading, error } = useDocumentBase64(doc.edmsFileId);
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  if (loading) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div">
          Generating Document Preview
          <Box component="span" sx={{ animation: 'blink 1.4s infinite' }}>
            ...
          </Box>
        </Typography>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="error">
            Error Loading Document
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // if (!doc.edmsFileId || !base64) return null;

  // Sample document data - in your real app, this would come from props or API

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
            <Typography variant="h6">{doc.originalFileName}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              PDF Document • {new Date(doc.createdDate).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Download">
            <IconButton
              color="inherit"
              onClick={() =>
                window.open(`data:application/pdf;base64,${base64}`, '_blank')
              }
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
        <Box
          sx={{
            width: 300,
            p: 2,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Document Details
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InsertDriveFile color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">{doc.fileName}</Typography>
            </Box>

            <Chip
              label={doc.mimeType}
              size="small"
              color="secondary"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <CalendarToday fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              Created Date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(doc.createdDate).toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
        </Box>

        <Box sx={{ flex: 1, position: 'relative' }}>
          <iframe
            src={`data:application/pdf;base64,${base64}#toolbar=0&navpanes=0`}
            width="100%"
            height="100%"
            title="Document Preview"
            style={{ border: 'none' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="caption">Page 1 of 1</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 1.5 }}>
        <Typography variant="caption" color="text.gray">
          Document Viewer • v1.0 2025
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
