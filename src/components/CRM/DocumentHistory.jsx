import React, { useState, useEffect } from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import endpoints, { apiService } from '../services/setupsApi';
import BaseCollapse from '../baseComponents/BaseCollapse';
import { toProperCase } from '@/utils/numberFormatters';

const notificationStatusMap = {
  0: { name: 'VERIFICATION', color: '#3498db' },
  1: { name: 'VALIDATION', color: '#f39c12' },
  2: { name: 'APPROVAL', color: '#2ecc71' },
  3: { name: 'ASSESSMENT DATA CAPTURE', color: '#f39c12' },
  4: { name: 'ASSESSMENT APPROVAL', color: '#2ecc71' },
  5: { name: 'DIRECTORATE', color: '#f39c12' },
  6: { name: 'COB', color: '#f39c12' },
  7: { name: 'Finance', color: '#2ecc71' },
  8: { name: 'Voucher Preparation', color: '#f39c12' },
  9: { name: 'Voucher Approval', color: '#3498db' },
  10: { name: 'Voucher Scheduled', color: '#f39c12' },
  11: { name: 'Voucher Paid', color: '#8b4513' },
};

const DocumentHistory = ({ data }) => {
  const [userDetails, setUserDetails] = useState({});

  const sortedData = [...data].sort((a, b) => {
    const formatStage = (stage) => stage.replace(/_/g, ' ').toLowerCase(); // Replace underscores and convert to lowercase

    const indexA = Object.values(notificationStatusMap).findIndex(
      (item) => item.name.toLowerCase() === formatStage(a.stage)
    );
    const indexB = Object.values(notificationStatusMap).findIndex(
      (item) => item.name.toLowerCase() === formatStage(b.stage)
    );

    return indexA - indexB;
  });

  const fetchUserDetailsById = async (userId) => {
    if (!userId || userDetails[userId]) return;

    try {
      const response = await apiService.get(endpoints.getUserById(userId));
      setUserDetails((prev) => ({
        ...prev,
        [userId]: response.data.data || {
          email: 'Unknown',
          department: { name: 'Unknown' },
        },
      }));
    } catch {
      setUserDetails((prev) => ({
        ...prev,
        [userId]: {
          email: 'Error fetching user',
          department: { name: 'Error fetching department' },
        },
      }));
    }
  };

  useEffect(() => {
    sortedData.forEach((record) => {
      if (record.created_by) fetchUserDetailsById(record.created_by);
      if (record.approved_by) fetchUserDetailsById(record.approved_by);
      if (record.updated_by) fetchUserDetailsById(record.updated_by);
    });
  }, [sortedData]);

  const renderDetails = (record) => {
    const stageInfo =
      Object.values(notificationStatusMap).find(
        (item) => item.name === record.stage
      ) || {};
    const createdBy = userDetails[record.created_by] || {};
    const approvedBy = record.approved_by
      ? userDetails[record.approved_by]
      : null;

    return (
      <Box
        sx={{
          p: 2,
          borderLeft: `6px solid ${stageInfo.color || '#ccc'}`,
          backgroundColor: sortedData.length === 1 ? 'grey.100' : 'transparent',
          borderRadius: sortedData.length === 1 ? 2 : 0,
          display: 'grid',
          rowGap: 1,
          columnGap: 2,
        }}
      >
        {[
          ['Current Document No', record.current_document_no],
          // ['Previous Document No', record.previous_document_no || 'N/A'],
          // ['Stage', record.stage],
          // [
          //   'Closed Date',
          //   record.closed_date
          //     ? dayjs(record.closed_date).format('YYYY-MM-DD HH:mm:ss')
          //     : 'N/A',
          // ],
          ['Is Closed', record.is_closed ? 'Yes' : 'No'],
          [
            'Actioned By',
            createdBy.firstName + createdBy.middleName + createdBy.lastName ||
              'N/A',
          ],
          ['Department', createdBy.department?.name || 'N/A'],
          [
            'Actioned Date',
            dayjs(record.created_date).format('YYYY-MM-DD HH:mm:ss'),
          ],

          // [
          //   'Updated Date',
          //   record.updated_date
          //     ? dayjs(record.updated_date).format('YYYY-MM-DD HH:mm:ss')
          //     : 'N/A',
          // ],
          // [
          //   'Approved By',
          //   approvedBy ? approvedBy.email || 'Loading...' : 'N/A',
          // ],
        ].map(([label, value], i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1 }}>
            <Typography sx={{ fontWeight: 600, minWidth: 180 }}>
              {label}:
            </Typography>
            <Typography
              sx={{
                color:
                  value === 'N/A' || value === 'Loading...'
                    ? 'text.secondary'
                    : 'text.primary',
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const steps = Object.values(notificationStatusMap);
  const activeStep = sortedData.notification_status ?? 0;
  const formatStage = (stage) => {
    return stage.replace(/_/g, ' ').toLowerCase(); // Replace underscores with spaces and convert to lowercase
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', p: 2 }}>
      <Stepper alternativeLabel>
        {steps.map((step, index) => {
          const matchedRecord = sortedData.find(
            (record) => formatStage(record.stage) === step.name.toLowerCase()
          );
          const isClosed = matchedRecord?.is_closed === true;

          return (
            <Step key={index} completed={isClosed}>
              <StepLabel>
                <Typography sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
                  {toProperCase(step.name)}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <div className="overflow-y-auto max-h-[65vh]">
        {sortedData.length >= 2
          ? sortedData.map((record) => (
              <BaseCollapse
                key={record.id}
                name={record.stage}
                titleFontSize="16"
                className="mb-4"
              >
                <div className="px-8">{renderDetails(record)}</div>
              </BaseCollapse>
            ))
          : sortedData.map((record) => (
              <Box key={record.id} sx={{ mb: 2 }}>
                <div className="">{renderDetails(record)}</div>
              </Box>
            ))}
      </div>
    </Box>
  );
};

export default DocumentHistory;
