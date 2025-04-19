import React, { useState, useEffect } from 'react';
import { Box, Chip, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Badge, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import endpoints, { apiService } from '../services/setupsApi';
import BaseCollapse from '../baseComponents/BaseCollapse';
import { toProperCase } from '@/utils/numberFormatters';
import { ErrorOutline, Verified } from '@mui/icons-material';

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
    const formatStage = (stage) => stage.replace(/_/g, ' ').toLowerCase();

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

  const getActionedBy = (record) => {
    const createdBy = userDetails[record.created_by] || {};
    return (
      createdBy.firstName + createdBy.middleName + createdBy.lastName || 'N/A'
    );
  };

  const getDepartment = (record) => {
    const createdBy = userDetails[record.created_by] || {};
    return createdBy.department?.name || 'N/A';
  };

  const columns = [
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (text, record) => (
        <span
          style={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {text}
          {!record.is_closed && (
            <span
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#e74c3c',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            ></span>
          )}
        </span>
      ),
    },
    {
      title: 'Document No',
      dataIndex: 'current_document_no',
      key: 'current_document_no',
    },

    {
      title: 'Status',
      dataIndex: 'is_closed',
      key: 'is_closed',
      render: (is_closed) => (
        <Tag color={is_closed ? 'green' : 'red'}>
          {is_closed ? 'Closed' : 'Open'}
        </Tag>
      ),
    },
    {
      title: 'Actioned By',
      key: 'actioned_by',
      render: (_, record) => getActionedBy(record),
    },
    {
      title: 'Department',
      key: 'department',
      render: (_, record) => getDepartment(record),
    },
    {
      title: 'Actioned Date',
      key: 'created_date',
      render: (_, record) =>
        dayjs(record.created_date).format('MMM DD, YYYY [at] hh:mm A'),
    },
  ];

  const steps = Object.values(notificationStatusMap);
  const activeStep = sortedData.notification_status ?? 0;
  const formatStage = (stage) => {
    return stage.replace(/_/g, ' ').toLowerCase();
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

      <div className="overflow-y-auto max-h-[75vh] mt-10">
        <Table
          dataSource={sortedData}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
          size="small"
          onRow={(record) => {
            const stageInfo =
              Object.values(notificationStatusMap).find(
                (item) => item.name === record.stage
              ) || {};
            return {
              style: {
                borderLeft: `4px solid ${stageInfo.color || '#ccc'}`,
              },
            };
          }}
        />
      </div>
    </Box>
  );
};

export default DocumentHistory;
