import { Cancel } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export const generateErrorTooltip = (params) => {
  const fieldName = params.colDef.field; // dynamically access field name
  const capitalizedFieldName =
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1); // capitalize first character
  const errorMessage = params.data.errorMessage?.[capitalizedFieldName]; // dynamically check for error message

  const errorTooltip = `
      <div>
        <strong style="display: block; margin-bottom: 8px; padding-left: 15px;">
          <span style="font-size: 1.5em;">⚠️</span> Validation Error
        </strong>
        <div style="color: #d9534f;">${errorMessage}</div>
      </div>
    `;

  // If there’s an error, return the tooltip and the value in a styled div
  return errorMessage ? (
    <Tooltip
      title={<div dangerouslySetInnerHTML={{ __html: errorTooltip }} />}
      arrow
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontSize: '0.875rem',
            padding: '8px',
            borderRadius: '8px',
            maxWidth: '250px',
            wordWrap: 'break-word',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'opacity 0.3s ease-in-out',
          },
          '& .MuiTooltip-arrow': {
            color: '#f5f5f5',
          },
        },
      }}
    >
      <div
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        {params.value}
        <IconButton
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '4px',
          }}
          size="small"
        >
          <Cancel fontSize="small" sx={{ color: '#d9534f' }} />
        </IconButton>
      </div>
    </Tooltip>
  ) : (
    params.value
  );
};
