import React, { useEffect, useState } from 'react';
import {
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  MenuItem,
  Autocomplete,
  Tooltip,
  Button,
} from '@mui/material';
import endpoints, { apiService } from '../services/setupsApi';
import {
  AccessTime,
  ArrowForward,
  CheckCircle,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveRedEye,
  Visibility,
} from '@mui/icons-material';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { Empty, message } from 'antd';

function BaseTaskDetails({
  users,
  documentType,
  documentId,
  minimize,
  setMinimize,
}) {
  const [taskDetails, setTaskDetails] = useState({});
  const [reassignUser, setReassignUser] = useState('');

  useEffect(() => {
    getTaskDetails();
  }, []);

  const getTaskDetails = async () => {
    try {
      const res = await apiService.get(
        endpoints.getTaskDetails(documentId, documentType)
      );
      setTaskDetails(res.data.data || {});
    } catch (error) {
      console.error('Error getting task details:', error);
      setTaskDetails({});
    }
  };

  const handleReassign = async () => {
    try {
      const res = await apiService.post(endpoints.reassignTask, {
        taskId: taskDetails.id,
        userId: reassignUser.id,
      });
      if (res.status === 200 && res.data.succeeded) {
        message.success('Task reassigned successfully');
        getTaskDetails();
      } else if (res.data.messages[0] && res.data.succeeded === false) {
        message.error(res.data.messages[0]);
      }
    } catch (error) {}
  };

  const documentStatus = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: RemoveRedEye, name: 'Keep in View', color: '#2e7d32' }, // Green
    3: { icon: ArrowForward, name: 'Moved', color: '#d32f2f' }, // Red
    4: { icon: CheckCircle, name: 'Completed', color: '#4caf50' }, // Green
  };

  const types = {
    0: { name: 'Claim', color: '#1976d2' },
    1: { name: 'Contribution', color: '#fbc02d' },
    2: { name: 'Returns', color: '#2e7d32' },
    3: { name: 'Payroll', color: '#d32f2f' },
  };

  const documentStatusComponent = () => {
    const status = documentStatus[taskDetails.status] || 'N/A';
    const IconComponent =
      documentStatus[taskDetails.status]?.icon || Visibility;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconComponent
          style={{
            color: status.color,
            marginRight: '6px',
            fontSize: '17px',
          }}
        />
        <span
          style={{
            color: status.color,
            fontWeight: 'semibold',
            fontSize: '12px',
          }}
        >
          {status.name}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        zIndex: 9999999999,
      }}
      className="rounded-lg px-4 mt-[-10px] z-50 bg-white"
    >
      <div className="flex justify-between items-center w-full border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold text-primary">
          Task Allocation Details
        </h2>

        {!minimize ? (
          <Tooltip title="Show Less">
            <IconButton onClick={() => setMinimize(!minimize)}>
              <KeyboardArrowDown
                sx={{
                  color: 'primary.main',
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Show More">
            <IconButton onClick={() => setMinimize(!minimize)}>
              <KeyboardArrowUp
                sx={{
                  color: 'primary.main',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </div>
      {!minimize && (
        <div className="grid grid-cols-3 gap-6">
          <div
            className="px-4 py-1 rounded-sm bg-white "
            style={{
              borderLeft: `6px solid ${
                documentStatus[taskDetails.status]?.color || '#ccc'
              }`,
            }}
          >
            <div className="space-y-2">
              {/* Status */}
              <div className="flex items-center">
                <Typography
                  variant="body2"
                  className="text-gray-600 w-24 font-medium"
                >
                  Status:
                </Typography>
                {documentStatusComponent()}
              </div>

              {/* Task Type */}
              <div className="flex items-center">
                <Typography
                  variant="body2"
                  className="text-gray-600 w-24 font-medium"
                >
                  Task Type:
                </Typography>
                <span
                  className="font-semibold text-sm"
                  style={{ color: types[taskDetails.type]?.color || 'black' }}
                >
                  {types[taskDetails.type]?.name || 'N/A'}
                </span>
              </div>

              {/* Closing Date */}
              <div className="flex items-center">
                <Typography
                  variant="body2"
                  className="text-gray-600 w-24 font-medium"
                >
                  Closing Date:
                </Typography>
                <span className="text-sm text-gray-800 font-semibold">
                  {taskDetails.end_date
                    ? new Date(taskDetails.end_date).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-4 rounded-lg ">
            {taskDetails.current_user ? (
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Assigned To:
                  </span>{' '}
                  {taskDetails.current_user.firstName}{' '}
                  {taskDetails.current_user.lastName || ''}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Email:
                  </span>{' '}
                  {taskDetails.current_user.email || 'N/A'}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Employee Number:
                  </span>{' '}
                  {taskDetails.current_user.employeeNumber || 'N/A'}
                </p>
              </div>
            ) : (
              <Empty
                description={
                  <span
                    className="text-gray-800 font-sans"
                    style={{ fontSize: '14px' }}
                  >
                    Unassigned, No user allocated.
                  </span>
                }
                style={{
                  p: 0,
                  // marginTop: '-6px',
                }}
                imageStyle={{ height: 48 }}
                // image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
          <div className="px-4 mt-[-8px] bg-gray-50 rounded-lg flex items-center w-full">
            <div className="w-full">
              <Typography variant="subtitle2" gutterBottom>
                Reassign Task
              </Typography>
              <Autocomplete
                id="reassign-user"
                options={(users && users.length > 0 && users) || []}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName || ''} - ${
                    option.email || ''
                  }`
                }
                onChange={(event, newValue) => {
                  setReassignUser(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select User to Reassign Task"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="ml-4 mt-7">
              <Button
                variant="contained"
                color="primary"
                onClick={handleReassign}
                size="small"
                startIcon={<ArrowForward />}
              >
                Reassign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaseTaskDetails;
