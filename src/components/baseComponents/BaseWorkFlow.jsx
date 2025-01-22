import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Tooltip,
  Button,
} from '@mui/material';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import { useStatus } from '@/context/StatusContext';
import { formatDate } from '@/utils/dateFormatter';
import authEndpoints, { AuthApiService } from '../services/authApi';
import { useAuth } from '@/context/AuthContext';
import endpoints, { apiService } from '../services/setupsApi';

// Define a mapping of statuses to icon paths
const statusIcons = {
  Open: '/open.png',
  Approved: '/approve.png',
  Rejected: '/reject.png',
  Pending: '/pending.png',
  Canceled: '/cancel.png',
  Null: '/null.png',
};

function BaseWorkFlow({ steps, activeStep, clickedItem }) {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [approver, setApprover] = useState(null);
  const [openWorkflowDetails, setOpenWorkflowDetails] = useState(false);

  const getDocumentStatus = async () => {
    const documentId = clickedItem.no_series
      ? clickedItem.no_series
      : clickedItem.claim_id
      ? clickedItem.claim_id
      : clickedItem?.documentNo
      ? clickedItem.documentNo
      : 'test';

    try {
      const res = await workflowsApiService.post(
        workflowsEndpoints.getDocumentStatus,
        {
          documentNo: documentId,
        }
      );
      console.log(
        res.data.data,
        'Workflow status for document now is here ****************************'
      );
      setCurrentStatus(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { workFlowChange, setWorkFlowChange } = useStatus();
  useEffect(() => {
    getDocumentStatus();
  }, [clickedItem]);

  useEffect(() => {
    getDocumentStatus();
  }, [workFlowChange, setWorkFlowChange]);

  const { auth } = useAuth();

  const [approvalEntries, setApprovalEntries] = useState([]);

  const userId = auth.user ? auth.user.userId : null;

  const getApprovalEntries = () => {
    const documentId = clickedItem.no_series
      ? clickedItem.no_series
      : clickedItem.claim_id
      ? clickedItem.claim_id
      : clickedItem?.documentNo
      ? clickedItem.documentNo
      : 'test';
    try {
      workflowsApiService
        .post(workflowsEndpoints.getApprovalEntries, {
          documentNo: documentId,
          userId: userId,
        })
        .then((res) => {
          console.log('Approval Entries:', res.data.data);
          setApprovalEntries(res.data.data);
          if (res.data.data.length > 0) {
            fetchUserDetails(res.data.data[0].approver_id);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const res = await apiService.get(endpoints.getUserById(id));
      if (res.status === 200) {
        setApprover(res.data.data.email);
      }

      console.log('User details fetched successfully:', res.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    getApprovalEntries();
  }, []);

  return (
    <Box p={1} sx={{ width: '100%' }}>
      <p className="py-2 text-primary text-base font-semibold font-montserrat mb-5">
        Document Workflows
      </p>

      <Stepper orientation="vertical" pt={0} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                color: index > activeStep ? 'gray' : 'inherit',
                display: 'flex',
                flexDirection: 'row', // Ensure the label stays next to the step number horizontally
                alignItems: 'center', // Stick the step number and label together
                gap: 1, // Add small gap between step number and label
              }}
            >
              <Typography
                sx={{
                  textDecoration: index > activeStep ? 'none' : 'underline',
                  color: index > activeStep ? 'gray' : 'inherit',
                }}
                fontSize={12}
              >
                {step}
              </Typography>

              {/* Status and details for the current step */}
              {index === activeStep && currentStatus && (
                <>
                  <Tooltip
                    title={
                      <Box
                        sx={{
                          marginTop: '16px',
                          width: '300px', // Adjusted width to fit content better
                          backgroundColor: '#fff', // Clean white background
                          borderRadius: '12px', // Rounded corners for a smooth look
                          padding: '16px', // Padding for a more spacious layout
                          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)', // Softer shadow for elevation
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            marginBottom: '8px', // Space between title and content
                            color: '#333', // Dark color for the header
                          }}
                        >
                          Workflow Details
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <Typography variant="body1">
                            <strong>Approval Status:</strong>{' '}
                            {currentStatus.status}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Document Number:</strong>{' '}
                            {currentStatus.documentNo}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Approved By:</strong>{' '}
                            {currentStatus.senderId || 'N/A'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Comment:</strong>{' '}
                            {currentStatus.approvalComment}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Approved At:</strong>{' '}
                            {formatDate(currentStatus.approvedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    arrow
                    PopperProps={{
                      sx: {
                        '& .MuiTooltip-tooltip': {
                          backgroundColor: '#fff', // Tooltip background white for contrast
                          color: '#333', // Darker text for better readability
                          fontSize: '0.875rem', // Slightly larger text
                          padding: '16px', // More spacious padding
                          borderRadius: '12px', // Rounded corners for the tooltip
                          maxWidth: '350px', // Increased width for better layout
                          transition: 'opacity 0.3s ease-in-out', // Smooth fade transition
                          wordWrap: 'break-word', // Prevent long words from breaking layout
                        },
                        '& .MuiTooltip-arrow': {
                          color: '#fff', // Matching arrow color to background
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        position: 'relative',
                        mb: '-20px',
                      }}
                    >
                      <Button
                        sx={{
                          p: 0,
                        }}
                        onClick={() =>
                          setOpenWorkflowDetails(!openWorkflowDetails)
                        }
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={
                              statusIcons[currentStatus.status] ||
                              statusIcons['Null']
                            }
                            alt={`${currentStatus.status} icon`}
                            style={{
                              width: '22px',
                              height: '22px',
                              marginRight: '8px', // Added space for better alignment
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {currentStatus.status}
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  </Tooltip>
                </>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {approver && (
        <div className="mt-7 p-4 bg-gray-100 border-l-4 border-primary text-gray-800 rounded-l">
          <strong>Next Approver:</strong> {approver}
        </div>
      )}
    </Box>
  );
}

export default BaseWorkFlow;
