'use client';
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { Alert } from '@mui/material';
import React, { useEffect } from 'react';

function AlertComponent({ alert, setAlert }) {
  useEffect(() => {
    const duration = alert.severity === 'warning' ? 10000 : 5000; // Double the duration for warning

    const timer = setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, duration);

    return () => clearTimeout(timer);
  }, [alert, setAlert]);

  // Define background colors for different severities
  const getBackgroundColor = (severity) => {
    switch (severity) {
      case 'warning':
        return '#FFA726'; // Orange
      case 'error':
        return '#D32F2F'; // Red
      case 'info':
        return '#1976D2'; // Blue
      case 'success':
        return '#388E3C'; // Green
      default:
        return '#3A845D'; // Default green
    }
  };

  return (
    <Alert
      sx={{
        backgroundColor: getBackgroundColor(alert.severity),
        color: 'white',
        height: '60px',
        pt: 1,
        borderRadius: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        fontSize: '16px',
        zIndex: 9999999999,
      }}
      variant="filled"
      iconMapping={{
        success: (
          <CheckCircle
            fontSize="large"
            sx={{
              mt: '-5px',
            }}
          />
        ),
        error: (
          <Error
            fontSize="large"
            sx={{
              mt: '-5px',
            }}
          />
        ),
        info: (
          <Info
            fontSize="large"
            sx={{
              mt: '-5px',
            }}
          />
        ),
        warning: (
          <Warning
            fontSize="large"
            sx={{
              mt: '-5px',
            }}
          />
        ),
      }}
      severity={alert.severity}
      onClose={() => setAlert({ ...alert, open: false })}
    >
      {alert.message}
    </Alert>
  );
}

export default AlertComponent;
