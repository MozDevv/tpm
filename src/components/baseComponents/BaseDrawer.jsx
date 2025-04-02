import React, { useMemo } from 'react';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import Drawer from '@mui/material/Drawer';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';

const BaseDrawer = ({ open, setOpen, children, title }) => {
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <div
      className={`${theme.palette.mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}`}
    >
      {' '}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 520,
            height: '100%',
            zIndex: 999999,
            backgroundColor: theme.palette.mode === 'dark' ? '#2a2d35' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingTop: 4,
            paddingX: 2,
            backgroundColor: theme.palette.mode === 'dark' ? '#2a2d35' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          }}
        >
          <IconButton
            sx={{
              border: '1px solid ',
              borderColor: 'primary',
              borderRadius: '50%',
              padding: '3px',
              marginRight: '10px',
              color: 'primary.main',
            }}
            onClick={() => setOpen(false)}
          >
            <ArrowBack sx={{ color: 'primary.main' }} />
          </IconButton>
          <h2 style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{title || 'Title'}</h2>
        </Box>

        <Box
          sx={{
            paddingX: 2,
            backgroundColor: theme.palette.mode === 'dark' ? '#2a2d35' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          }}
        >
          {children}
        </Box>
      </Drawer>
    </div>
  );
};

export default BaseDrawer;
