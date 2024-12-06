import React from 'react';
import { Tooltip } from '@mui/material';

const BaseAGHeaderTooltip = (props) => {
  return (
    <Tooltip title={props.displayName} arrow>
      <span>{props.displayName}</span>
    </Tooltip>
  );
};

export default BaseAGHeaderTooltip;
