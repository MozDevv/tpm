import React from 'react';
import { Backdrop } from '@mui/material';

const BaseLoadingBackdrop = ({ open, onClose, message }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: 99999999 }}
    open={open}
    onClick={onClose}
  >
    <div className="ml-3 font-semibold text-xl flex items-center">
      {message}
      <div className="ellipsis ml-1 mb-4">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  </Backdrop>
);

export default BaseLoadingBackdrop;
