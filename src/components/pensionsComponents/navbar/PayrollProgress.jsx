import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography, Box, Fade, Chip } from '@mui/material';
import * as signalR from '@microsoft/signalr';
import { CircularProgressWithLabel } from './CircularProgressWithLabel';
import { PAYROLL_BASE_URL } from '@/utils/constants';
import { usePayrollProgressStore } from '@/zustand/store';
import { notification } from 'antd'; // Import Ant Design notification
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { CheckCircleOutline, Verified } from '@mui/icons-material';

const PayrollProgress = () => {
  const {
    stage,
    description,
    percentage,
    setStage,
    setDescription,
    setPercentage,
    addNotification,
  } = usePayrollProgressStore();

  const stages = {
    0: 'Preparing',
    1: 'Fetching Pensioners',
    2: 'Processing Earnings',
    3: 'Saving',
  };

  const { data: payrollTypes } = useFetchAsyncV2(
    payrollEndpoints.getPayrollTypes,
    payrollApiService
  );
  // Track previous stage and description
  const previousStageRef = React.useRef('');
  const previousDescriptionRef = React.useRef('');

  useEffect(() => {
    const connection2 = new signalR.HubConnectionBuilder()
      .withUrl(`${PAYROLL_BASE_URL}/payrollProcessing`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection2.on(
      'ReceivePayrollUpdate',
      (payrollTypeId, stage, processingPercentage, description, errMsg) => {
        const currentStage = stages[stage] || '';
        setStage(currentStage);
        setPercentage(processingPercentage);
        setDescription(description);

        const playNotificationSound = () => {
          const sound = new Audio('/notification.wav'); // Path to the sound file
          sound.play().catch((error) => {
            console.error('Error playing notification sound:', error);
          });
        };

        // Show success notification if stage is 3 and description is "Done"
        if (currentStage === 'Saving' && description === 'Done') {
          playNotificationSound(); // Play sound
          notification.success({
            message: `Payroll Run Completed`,
            description: `Stage: ${currentStage} - ${description}`,
            placement: 'topRight',
          });
        }
        // Show error notification if description is "Failed"
        else if (description === 'Failed') {
          playNotificationSound(); // Play sound
          notification.error({
            message: `Payroll Error`,
            description: `Stage: ${currentStage} - ${description}`,
            placement: 'topRight',
          });
        }

        if (
          previousStageRef.current !== currentStage ||
          previousDescriptionRef.current !== description
        ) {
          addNotification({
            payrollTypeId,
            stage: currentStage,
            description,
            errMsg: errMsg ?? '', // Handle nullable errMsg
          });

          // Update previous values
          previousStageRef.current = currentStage;
          previousDescriptionRef.current = description;
        }
      }
    );

    const startConnection = async () => {
      try {
        await connection2.start();
        console.log('SignalR Connected.');
      } catch (err) {
        console.error('SignalR connection failed. Retrying in 5s...', err);
        setTimeout(startConnection, 5000); // Retry after 5 seconds
      }
    };

    connection2.onclose(() => {
      setTimeout(startConnection, 5000); // Reconnect after 5 seconds on disconnect
    });

    setTimeout(() => {
      startConnection(); // Initial connection after 5 seconds
    }, 5000);

    return () => {
      connection2.stop();
    };
  }, []);

  return (
    <div className="">
      {stage === 'Saving' && description === 'Done' ? (
        <Box
          sx={{
            display: 'inline-flex',
            mx: 'auto',
            px: 2.5,
            py: 1,
            borderRadius: 50,
            bgcolor: 'background.paper',
            // boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid rgba(76, 175, 80, 0.2)',
            width: '230px',
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Verified
              sx={{
                fontSize: '16px',
                color: 'success.main',
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'primary',
              fontWeight: '500',
              fontSize: '12px',
              // mt: -1
            }}
          >
            Payroll Run Completed
          </Typography>
        </Box>
      ) : stage ? (
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-[12px] text-primary mr-4">
            {stage}
          </div>
          <div className="">
            <CircularProgressWithLabel value={percentage} />
          </div>{' '}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PayrollProgress;
