import { useAlert } from '@/context/AlertContext';
import { Button, TextareaAutosize, Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { message } from 'antd';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import { useStatus } from '@/context/StatusContext';

function BaseApprovalCard({
  openApprove,
  setOpenApprove,
  documentNo, // Can be a string or an array
}) {
  const [comments, setComments] = useState('');
  const { alert, setAlert } = useAlert();
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });
  const { auth } = useAuth();
  const userId = auth.user ? auth.user.userId : null;
  const { workFlowChange, setWorkFlowChange } = useStatus();

  useEffect(() => {
    console.log('documentNo', documentNo);
  }, [openApprove]);

  const handleApprove = async () => {
    if (!comments || comments.length < 10) {
      setErrors({
        status: true,
        message: 'Comments must be at least 10 characters',
      });
      return;
    }

    const fieldMapping = {
      1: 'userId',
      2: 'senderId',
      3: 'approverId',
      5: 'approverId',
    };

    const fieldName = fieldMapping[openApprove] || 'approverId';

    // Convert documentNo to an array if it's a string
    const documentNos = Array.isArray(documentNo) ? documentNo : [documentNo];

    console.log('Field Name:', fieldName);
    console.log('Document Numbers:', documentNos);
    console.log('Comments:', comments);
    console.log('User ID:', userId);

    // Loop through each documentNo and make API calls
    for (const docNo of documentNos) {
      const data = {
        documentNo: docNo,
        comments,
        [fieldName]: userId,
      };

      console.log('Data to be sent:', data);

      try {
        const response = await workflowsApiService.post(
          openApprove === 1
            ? workflowsEndpoints.createApprovalRequest
            : openApprove === 2
            ? workflowsEndpoints.cancelApprovalRequest
            : openApprove === 3
            ? workflowsEndpoints.approve
            : openApprove === 4
            ? workflowsEndpoints.reject
            : workflowsEndpoints.delegate,
          data
        );

        console.log('API Response:', response);

        if (response.status === 200) {
          if (response.data.succeeded) {
            // Success case for each document
            message.success(
              openApprove === 1
                ? `Document ${docNo} sent for approval`
                : openApprove === 2
                ? `Approval Request Cancelled for ${docNo}`
                : openApprove === 3
                ? `Document ${docNo} Approved`
                : openApprove === 4
                ? `Document ${docNo} Rejected`
                : `Approval Delegated for ${docNo}`
            );
          } else if (
            response.data.messages &&
            response.data.messages.length > 0
          ) {
            // Error case for each document
            message.error(response.data.messages[0]);
          }
        } else {
          // Handle other status codes if needed
          message.error('An unexpected error occurred. Please try again.'); // General error message
        }
      } catch (error) {
        console.error('Error during API call:', error);
        message.error('An error occurred while processing the request.');
      }
    }

    // Reset comments and close the dialog
    setComments('');
    setOpenApprove(false);
    setWorkFlowChange('change');
  };

  const title =
    openApprove === 1
      ? 'Send For Approval'
      : openApprove === 2
      ? 'Cancel Approval Request'
      : openApprove === 3
      ? 'Approve Document'
      : openApprove === 4
      ? 'Reject Document Approval'
      : openApprove === 5
      ? 'Delegate Approval'
      : 'Approve';

  return (
    <Dialog
      open={openApprove}
      onClose={() => setOpenApprove(false)}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
      sx={
        {
          //  position: 'absolute',
        }
      }
    >
      <div>
        <div className="p-8 h-[100%]">
          <p className="text-primary relative font-semibold text-lg mb-2">
            {title}
          </p>

          <div>
            <label
              htmlFor="comments"
              className="text-xs font-medium text-gray-700"
            >
              Add Comments
            </label>
            <TextareaAutosize
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              error={errors.status}
              minRows={3}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid gray',
              }}
            />
          </div>
          <div className="mt-5">
            <Button
              onClick={handleApprove}
              variant="contained"
              fullWidth
              color="primary"
            >
              {title}
            </Button>
          </div>
          {errors.status && (
            <div className="mt-2 text-red-500 text-sm">{errors.message}</div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default BaseApprovalCard;
