import React, { useState } from 'react';
import { Dialog, Divider, IconButton, Tooltip } from '@mui/material';
import { ArrowBack, CloseFullscreen, OpenInFull } from '@mui/icons-material';
import ListNavigation from './ListNavigation';

const BaseExpandCard = ({ open, onClose, children, title, handlers = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentSize = isExpanded
    ? {
        minHeight: '95vh',
        maxHeight: '95vh',
        minWidth: '90vw',
        maxWidth: '90vw',
      }
    : {
        minHeight: '85vh',
        maxHeight: '75vh',
        minWidth: '70vw',
        maxWidth: '70vw',
      };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      sx={{
        '& .MuiPaper-root': {
          minHeight: currentSize.minHeight,
          maxHeight: currentSize.maxHeight,
          minWidth: currentSize.minWidth,
          maxWidth: currentSize.maxWidth,
          transition: 'all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
          overflowY: 'hidden',
        },
      }}
    >
      {/* Expand/Shrink Button */}
      <div className="flex justify-between items-center mx-10 mt-10">
        <div className="flex items-center gap-2">
          <IconButton
            sx={{
              border: '1px solid #006990',
              borderRadius: '50%',
              padding: '3px',
              marginRight: '10px',
              color: '#006990',
            }}
            onClick={onClose}
          >
            <ArrowBack sx={{ color: '#006990' }} />
          </IconButton>
          <p className="text-lg text-primary font-semibold">{title}</p>
        </div>

        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
          <Tooltip title={isExpanded ? 'Shrink' : 'Expand'}>
            {isExpanded ? (
              <CloseFullscreen
                color="primary"
                sx={{ fontSize: '20px', mt: '4px' }}
              />
            ) : (
              <OpenInFull
                color="primary"
                sx={{ fontSize: '18px', mt: '4px' }}
              />
            )}
          </Tooltip>
        </IconButton>
      </div>

      {/* Dialog Content */}
      <div className="px-4 pb-2 ml-2">
        <ListNavigation handlers={handlers} />
      </div>
      <Divider
        sx={{
          mx: 4,
        }}
      />
      <div className="p-4">{children}</div>
    </Dialog>
  );
};

export default BaseExpandCard;
