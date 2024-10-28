import React, { useState } from 'react';
import { Collapse, IconButton } from '@mui/material';
import { KeyboardArrowRight, ExpandLess } from '@mui/icons-material';

const BaseCollapse = ({ name, children, titleFontSize }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleSection = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex items-center ml-4">
        <p
          className={`font-semibold text-primary ${
            titleFontSize ? `${titleFontSize}px` : 'text-sm'
          } font-montserrat`}
        >
          {name}
        </p>
        <IconButton sx={{ zIndex: 1, mt: '3px' }} onClick={handleToggleSection}>
          {isOpen ? (
            <ExpandLess sx={{ color: 'primary.main', fontSize: '14px' }} />
          ) : (
            <KeyboardArrowRight
              sx={{ color: 'primary.main', fontSize: '14px' }}
            />
          )}
        </IconButton>
        <hr className="flex-grow border-blue-500 border-opacity-20 mt-1" />
      </div>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default BaseCollapse;
