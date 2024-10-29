'use client';
import { Alert } from '@mui/material';
import React from 'react';

function AlertComponent({ alert, setAlert }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 4000);

    return () => clearTimeout(timer);
  }, [alert, setAlert]);

  return (
    <Alert
      sx={{
        backgroundColor: '#3A845D',
        color: 'white',
        height: '60px',
        pt: 1,
        borderRadius: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 9999999999,
      }}
      variant="filled"
      severity={alert.severity}
      onClose={() => setAlert({ ...alert, open: false })}
    >
      {alert.message}
    </Alert>
  );
}

export default AlertComponent;
