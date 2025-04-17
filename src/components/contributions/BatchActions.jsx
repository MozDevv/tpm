import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Alert, message } from 'antd';

import { apiService } from '../services/api';
import { parseDate } from '@/utils/dateFormatter';
import { truncateMessage } from '@/utils/handyFuncs';

function BaseSubmitForApproval({
  selectedRows,
  setSelectedRows,
  setOpenPostGL,
  setOpenBaseCard,
  clickedItem,
  status,
  submitForApprovalEndpoint,
  headers,
  selectedHeaders,
  apiService,
}) {
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });

  const handleSubmitForApproval = async () => {
    const selectedIds = selectedRows.map((row) => row.id);

    try {
      // Create an array of async API requests
      const processRequests = selectedIds.map(async (id) => {
        const endpoint = submitForApprovalEndpoint(id);
        const successMessage = 'Document Submitted for approval successfully';
        const errorMessage = 'Failed to submit Document Voucher for approval';

        try {
          const res = await apiService.post(endpoint);

          if (res && res.data && res.data.succeeded && res.status === 200) {
            message.success(successMessage); // Success message for individual documents
            return { success: true, id };
          } else if (res.status === 200 && res.data.messages[0]) {
            setErrors({ status: true, message: res.data.messages[0] });
            message.error(`${res.data.messages[0]}`);
            return { success: false, id };
          } else {
            message.error(`${errorMessage} for ID: ${id}`);
            return { success: false, id };
          }
        } catch (error) {
          console.error(`Error submitting document ${id}:`, error);
          message.error(`${errorMessage} for ID: ${id}`);
          return { success: false, id };
        }
      });

      // Wait for all requests to complete
      const results = await Promise.all(processRequests);

      // Check if all requests succeeded
      const allSucceeded = results.every((result) => result.success);

      if (allSucceeded) {
        message.success('Batches submitted successfully');
        setSelectedRows([]); // Clear selected rows
        setOpenPostGL(false); // Close any open dialogs if needed
        setOpenBaseCard && setOpenBaseCard(false); // Close the BaseCard if necessary
      } else {
        message.warning('Some Batches failed to submit.');
      }
    } catch (error) {
      // Global error handling for unexpected issues
      console.error('Unexpected error during approval submission:', error);
      message.error(
        'An unexpected error occurred while submitting for approval.'
      );
    }
  };

  return (
    <div className="p-5">
      <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
        Submit Document(s) for Approval
      </h5>

      {errors.status && (
        <div className="w-full mt-2">
          <Alert
            message={truncateMessage(errors.message, 100)}
            type="error"
            showIcon
            closable
          />
        </div>
      )}

      {selectedRows.length > 0 && (
        <TableContainer
          sx={{
            marginTop: '20px',
            paddingX: '20px',
            paddingBottom: '20px',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {selectedHeaders.map((header, index) => (
                  <TableCell key={index} align={header.align || 'left'}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRows.map((doc) => (
                <TableRow key={doc.id}>
                  {selectedHeaders.map((header, index) => (
                    <TableCell
                      key={index}
                      align={header.align || 'left'}
                      sx={header.style ? header.style : {}}
                    >
                      {header.format
                        ? header.format(doc[header.field])
                        : header.field.includes('Date')
                        ? parseDate(doc[header.field])
                        : doc[header.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DialogActions
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        <Button
          onClick={() => {
            setOpenPostGL(false);
            setSelectedRows([]);
          }}
          color="error"
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmitForApproval}
          color="primary"
          variant="contained"
          size="small"
        >
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}

export default BaseSubmitForApproval;
