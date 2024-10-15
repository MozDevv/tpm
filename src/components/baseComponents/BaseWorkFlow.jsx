import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import { useStatus } from '@/context/StatusContext';
import { formatDate } from '@/utils/dateFormatter';

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

  const getDocumentStatus = async () => {
    const documentId = clickedItem.no_series;
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
                color: index > activeStep ? 'gray' : 'inherit', // Grays out steps after activeStep
              }}
            >
              <Typography
                sx={{
                  textDecoration: index > activeStep ? 'none' : 'underline',
                  color: index > activeStep ? 'gray' : 'inherit', // Grays out text after activeStep
                }}
                fontSize={12}
              >
                {step}
              </Typography>

              {/* Status and details between the current step and the next step */}
              {index === activeStep && currentStatus && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center', // Align icon and text vertically
                    mt: 1,
                    position: 'relative',
                  }}
                >
                  <div className="flex items-center absolute top-1 cursor-pointer">
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="body2">
                            <strong>Approval Status:</strong>{' '}
                            {currentStatus.status}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Approved By:</strong>{' '}
                            {currentStatus.approvedBy || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Comment:</strong>{' '}
                            {currentStatus.approvalComment}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Approved At:</strong>{' '}
                            {formatDate(currentStatus.approvedAt)}
                          </Typography>
                        </Box>
                      }
                      // Limit the width of the tooltip
                      arrow
                      placement="right"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {/* Render the icon corresponding to the current status */}
                        <img
                          src={
                            statusIcons[currentStatus.status] ||
                            statusIcons['Null']
                          } // Fallback to Null if status is not found
                          alt={`${currentStatus.status} icon`}
                          style={{
                            width: '22px',
                            height: '22px',

                            marginRight: '4px',
                          }} // Adjust size and spacing
                        />
                        <div className="">{currentStatus.status}</div>
                      </Box>
                    </Tooltip>
                  </div>
                </Box>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default BaseWorkFlow;
