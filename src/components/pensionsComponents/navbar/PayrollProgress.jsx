import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';
import * as signalR from '@microsoft/signalr';
import { CircularProgressWithLabel } from './CircularProgressWithLabel';
import { PAYROLL_BASE_URL } from '@/utils/constants';
import { usePayrollProgressStore } from '@/zustand/store';

const PayrollProgress = () => {
  const {
    stage,
    description,
    percentage,
    messages,
    setStage,
    setDescription,
    setPercentage,
    setMessages,
    addNotification,
  } = usePayrollProgressStore();

  const stages = {
    0: 'Preparing',
    1: 'Fetching Pensioners',
    2: 'Processing Earnings',
    3: 'Saving',
  };

  useEffect(() => {
    const connection2 = new signalR.HubConnectionBuilder()
      .withUrl(`${PAYROLL_BASE_URL}/payrollProcessing`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection2.on(
      'ReceivePayrollUpdate',
      (stage, processingPercentage, description) => {
        const currentStage = stages[stage] || '';
        setStage(stages[stage] || '');
        setPercentage(processingPercentage);
        setDescription(description);
        addNotification({ stage: currentStage, description });
        console.log('notifications', [{ stage: currentStage, description }]);
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

  useEffect(() => {
    if (stage && description) {
      addNotification({ stage, description });
      console.log('notifications', [{ stage, description }]);
    }
  }, [stage, description, addNotification]);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="font-semibold text-[12px] text-primary mr-3">{stage}</div>

      <Box sx={{ mt: 4 }}>
        {/* <div className="font-semibold text-base text-primary"> </div>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {description}
        </Typography> */}
        <div className="mt-[-30px]">
          <CircularProgressWithLabel value={percentage} />
        </div>{' '}
      </Box>

      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Messages</Typography>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </Box> */}
    </div>
  );
};

export default PayrollProgress;
