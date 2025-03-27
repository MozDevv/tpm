import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';

const ChangesView = ({ data }) => {
  const sections = [
    'PENSIONER_INFORMATION',
    'WORK_HISTORY',
    'GOVERNMENT_SALARY',
    'DEDUCTIONS',
    'WCPS',
    'PARLIAMENTARY_CONTRIBUTIONS',
    'LIABILITIES',
    'MAINTENANCE',
  ];

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  const {
    sectionsEnabled = [], // Fallback to an empty array if undefined
    sectionsUpdated = [], // Fallback to an empty array if undefined
    basicDetailFields = [], // Fallback to an empty array if undefined
    prospective_pensioner = null, // Fallback to null if undefined
  } = data;

  const renderSection = (sectionId) => {
    const sectionName = sections[sectionId] || `Section ${sectionId}`;
    const isUpdated = sectionsUpdated.includes(sectionId);

    return (
      <React.Fragment key={sectionId}>
        <TableRow>
          <TableCell
            colSpan={2}
            style={{
              backgroundColor: isUpdated ? '#e3f2fd' : '#f9f9f9',
              fontWeight: 'bold',
              padding: '16px',
            }}
          >
            {sectionName.replace(/_/g, ' ')}
          </TableCell>
        </TableRow>

        {basicDetailFields.length > 0 ? (
          basicDetailFields.map((field) => (
            <TableRow key={field}>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: isUpdated ? '#0d47a1' : '#757575',
                  padding: '16px',
                }}
              >
                {field.replace(/_/g, ' ').toUpperCase()}
              </TableCell>
              <TableCell style={{ padding: '16px' }}>
                {prospective_pensioner
                  ? prospective_pensioner[field] || 'Not Updated'
                  : 'Not Updated'}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2}>No fields to display</TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="mt-2">
      <BaseCollapse titleFontSize="24" name="Summary" defaultExpanded={true}>
        <Box padding={1} mt={0}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                      padding: '16px',
                    }}
                  >
                    Section Name & Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sectionsEnabled.length > 0 ? (
                  sectionsEnabled.map((sectionId) => renderSection(sectionId))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography>No sections enabled</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </BaseCollapse>
    </div>
  );
};

export default ChangesView;
