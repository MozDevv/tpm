import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import endpoints, { apiService } from '../services/setupsApi';
import {
  AccessTime,
  ArrowForward,
  CheckCircle,
  KeyboardArrowDown,
  RemoveRedEye,
  Visibility,
} from '@mui/icons-material';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { message } from 'antd';

function BaseTaskDetails({ documentType, documentId }) {
  const [taskDetails, setTaskDetails] = useState({});
  const [reassignUser, setReassignUser] = useState('');

  const { data: users } = useFetchAsync(endpoints.getUsers, apiService);

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
    <div className=" rounded-lg px-4 mt-[-10px] z-50">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-base font-semibold text-primary ">
          Task Allocation Details
        </h2>
        <div className="">
          <IconButton>
            <KeyboardArrowDown
              sx={{
                color: 'primary.main',
              }}
            />
          </IconButton>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          style={{
            paddingX: '16px',
            borderRadius: '8px',
          }}
        >
          <p
            className="text-gray-700 flex gap-3 items-center"
            style={{ marginBottom: '8px' }}
          >
            <p className="text-[12px] font-semibold text-gray-600">Status:</p>
            <span>{documentStatusComponent()}</span>
          </p>
          <p
            className="text-gray-700 flex gap-3 items-center"
            style={{ marginBottom: '8px' }}
          >
            <p className="text-[12px] font-semibold text-gray-600">
              Task Type:
            </p>
            <span
              style={{
                color: types[taskDetails.type]?.color || 'black',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              {types[taskDetails.type]?.name || 'N/A'}
            </span>
          </p>
          <p
            className="text-gray-700 flex gap-3 items-center"
            style={{ marginBottom: '8px' }}
          >
            <p className="text-[12px] font-semibold text-gray-600">End Date:</p>
            <span
              style={{
                fontSize: '12px',
              }}
            >
              {taskDetails.end_date
                ? new Date(taskDetails.end_date).toLocaleDateString()
                : 'N/A'}
            </span>
          </p>
        </div>
        <div>
          <Typography variant="subtitle1" gutterBottom>
            Assigned User
          </Typography>
          {taskDetails.current_user ? (
            <div>
              <p className="text-gray-700">
                <p className="text-[12px] font-semibold text-gray-600">
                  Assigned To:
                </p>{' '}
                {taskDetails.current_user.firstName}{' '}
                {taskDetails.current_user.lastName || ''}
              </p>
              <p className="text-gray-700">
                <p className="text-[12px] font-semibold text-gray-600">Emal:</p>{' '}
                {taskDetails.current_user.email || 'N/A'}
              </p>
              <p className="text-gray-700">
                <p className="text-[12px] font-semibold text-gray-600">
                  Employee Number:
                </p>{' '}
                {taskDetails.current_user.employeeNumber || 'N/A'}
              </p>
            </div>
          ) : (
            <p className="text-gray-700 text-[12px]">No user assigned</p>
          )}
        </div>
        <div
          style={{
            paddingX: '8px',
            borderRadius: '8px',
            marginTop: '-15px',
          }}
        >
          <Typography variant="subtitle2">Reassign Task</Typography>
          <Autocomplete
            id="reassign-user"
            options={
              (users &&
                users.filter((user) =>
                  user.department.name.toLowerCase().includes('claims')
                )) ||
              []
            }
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName || ''}`
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
              />
            )}
          />

          <div className="mt-2">
            <Button
              variant="contained"
              color="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleReassign}
              size="small"
            >
              Reassign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaseTaskDetails;
