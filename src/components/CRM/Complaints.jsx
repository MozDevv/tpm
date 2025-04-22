'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import BaseComplaintsTable from '../baseComponents/BaseComplaintsTable';
import { Alert, Card, Divider, Empty, message, Result, Table } from 'antd';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Close,
  DownloadOutlined,
  Launch,
  Task,
  Verified,
} from '@mui/icons-material';
import BaseCollapse from '../baseComponents/BaseCollapse';
import useFetchAsync from '../hooks/DynamicFetchHook';
import BaseEdmsViewer from '../baseComponents/BaseEdmsViewer';

const Complaints = ({ status }) => {
  const columnDefs = [
    {
      field: 'created_date',
      headerName: 'Created Date',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      pinned: 'left', // Pinning to the left ensures it's the first column
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">
            {parseDate(params.value)}
          </p>
        );
      },
    },
    {
      field: 'header',
      headerName: 'Header',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'message',
      headerName: 'Message',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'pensionerNumber',
      headerName: 'Pensioner Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,

      cellRenderer: (params) => {
        const statusMap = {
          0: { name: 'Open', color: '#1976d2' },
          1: { name: 'Assigned', color: '#fbc02d' },
          2: { name: 'Escalated', color: '#2e7d32' },
          3: { name: 'Closed', color: '#d32f2f' },
        };
        const status = statusMap[params.value];
        return status ? (
          <span style={{ color: status.color, fontWeight: 'bold' }}>
            {status.name}
          </span>
        ) : null;
      },
    },
    {
      field: 'personalNumber',
      headerName: 'Personal Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    {
      field: 'closedAt',
      headerName: 'Closed At',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,

      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'closingComments',
      headerName: 'Closing Comments',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'lastEscalationTime',
      headerName: 'Last Escalation Time',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,

      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'wasEscalated',
      headerName: 'Was Escalated',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,

      cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
    },
  ];
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [selectedRows, setSelectedRows] = React.useState([]);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      // roles: item.roles,
    }));
  };

  const [openComplaintDialog, setOpenComplaintDialog] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [openEscalate, setOpenEscalate] = React.useState(false);
  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    ...(clickedItem &&
    (clickedItem.status === 0 ||
      clickedItem.status === 1 ||
      clickedItem?.status === 2)
      ? {
          closeComplaint: () => {
            setOpenComplaintDialog(true);
          },
          escalateComplaint: () => {
            setOpenEscalate(true);
          },
        }
      : {}),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);

  const title = clickedItem ? 'Complaint' : 'Create New Complaint';

  const fields = [
    {
      name: 'nationalId',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    {
      name: 'pensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'emailAddress',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      name: 'header',
      label: 'Header',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    ...(clickedItem?.status === 3
      ? [
          {
            name: 'closedAt',
            label: 'Closed At',
            type: 'datetime',
            required: false,
          },

          {
            name: 'lastEscalationTime',
            label: 'Last Escalation Time',
            type: 'text',
            required: false,
          },
          {
            name: 'wasEscalated',
            label: 'Was Escalated',
            type: 'select',
            options: [
              { id: true, name: 'Yes' },
              { id: false, name: 'No' },
            ],
            required: false,
          },
          {
            name: 'closingComments',
            label: 'Closing Comments',
            type: 'textarea',
            required: false,
          },
        ]
      : []),
  ];
  const fileColumns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '50%',
    },
    //upload date
    {
      title: 'Upload Date',
      dataIndex: 'created_date',
      key: 'created_date',
      width: '25%',
      render: (text) => {
        return <p>{parseDate(text)}</p>;
      },
    },
    {
      title: 'File Type',
      dataIndex: 'mimeType',
      key: 'mimeType',
      width: '25%',
    },

    {
      title: 'Preview',
      key: 'preview',
      width: '25%',
      render: (_, record) => (
        <Button
          icon={<Launch />}
          style={{
            backgroundColor: '#006990',
            color: 'white',
            border: 'none',
            maxHeight: '26px',
            fontSize: '12px',
          }}
          onClick={() => {
            setPreviewContent(record);
            console.log('Previewing file:', record);
            // Pass the edmsFileId to the ViewerPage component
            // setPreviewContent(<BaseEdmsViewer docId={record.edmsFileId} />);
            setPreviewOpen(true);
          }}
        >
          Preview
        </Button>
      ),
    },
    // {
    //   title: 'Download',
    //   key: 'download',
    //   width: '25%',
    //   render: (_, record) => (
    //     <Button
    //       icon={<DownloadOutlined />}
    //       style={{
    //         backgroundColor: '#28a745',
    //         color: 'white',
    //         border: 'none',
    //         maxHeight: '26px',
    //         fontSize: '12px',
    //       }}
    //       onClick={() => {
    //         window.open(record.edmsDownloadUrl, '_blank');
    //       }}
    //     >
    //       Download
    //     </Button>
    //   ),
    // },
  ];

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState(null);
  const [comments, setComments] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [openEditCard, setOpenEditCard] = React.useState(false);
  const { data: users } = useFetchAsync(endpoints.getUsers, apiService);

  const handleCloseComplaint = async () => {
    try {
      const response = await apiService.post(endpoints.closeComplaint, {
        requestId: clickedItem.id,
        comments: comments,
      });
      if (response.status === 200) {
        setOpenComplaintDialog(false);
        setComments('');
        setOpenBaseCard(false);
        setClickedItem(null);
        message.success(response.data);
      } else {
        console.error('Error closing complaint:', response.data.message);
      }
    } catch (error) {
      console.error('Error closing complaint:', error);
    }
  };

  const [openEscalateDialog, setOpenEscalateDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const { data: departments } = useFetchAsync(
    endpoints.getDepartments,
    apiService
  );

  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState(null);

  const handleEscalateComplaint = async () => {
    try {
      const response = await apiService.post(endpoints.esclateComplaint, {
        requestId: clickedItem.id,
        comments: comments,
        escalatedTo: selectedUser?.id,
      });
      if (response.status === 200) {
        setOpenEscalateDialog(false);
        setComments('');
        setSelectedUser(null);
        setClickedItem(null);
      } else {
        console.error('Error escalating complaint:', response.data.message);
      }
    } catch (error) {
      console.error('Error escalating complaint:', error);
    }
  };

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );

  return (
    <div className="">
      {previewOpen && (
        <BaseEdmsViewer
          doc={previewContent}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      <Dialog
        open={openEscalate}
        onClose={() => setOpenEscalate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <div className="flex items-center mb-5">
          <p className="text-primary relative font-semibold text-lg">
            Escalate Complaint
          </p>
          <IconButton
            sx={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              backgroundColor: 'white',

              borderRadius: '50%',
              padding: '3px',
              marginRight: '10px',
              color: '#006990',
            }}
            onClick={() => setOpenEscalate(false)}
          >
            <Close sx={{ color: '#006990' }} />
          </IconButton>
        </div>

        <div className="mb-4">
          <label
            htmlFor="escalateTo"
            className="text-xs font-medium text-gray-700"
          >
            Department
          </label>
          <Autocomplete
            options={departments && departments}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setSelectedDepartment(newValue); // Set the selected department
              setFilteredUsers(
                users.filter(
                  (user) => user.departmentId === newValue?.departmentId
                ) // Filter users by department
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Select Department"
              />
            )}
            value={selectedDepartment}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="escalateTo"
            className="text-xs font-medium text-gray-700"
          >
            Escalate To
          </label>
          <Autocomplete
            options={filteredUsers || []} // Use the filtered users
            getOptionLabel={(option) =>
              `${option.firstName || ''} ${option.lastName || ''}`.trim()
            }
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Select User"
              />
            )}
            value={selectedUser}
          />
        </div>

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
            minRows={3}
            style={{
              fontSize: '13px',
              width: '100%',
              padding: '9px',
              borderRadius: '4px',
              border: '1px solid gray',
            }}
          />
        </div>

        <div className="mt-5">
          <Button
            onClick={handleEscalateComplaint}
            variant="contained"
            fullWidth
            color="primary"
          >
            Escalate Complaint
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={openComplaintDialog}
        onClose={() => setOpenComplaintDialog(false)}
        maxWidth="sm"
        fullWidth
        //add padding to the dialog
        PaperProps={{
          style: {
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <div className="flex items-center mb-5">
          <p className="text-primary relative font-semibold text-lg ">
            Close Complaint
          </p>
          <IconButton
            sx={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              backgroundColor: 'white',

              borderRadius: '50%',
              padding: '3px',
              marginRight: '10px',
              color: '#006990',
            }}
            onClick={() => setOpenComplaintDialog(false)}
          >
            <Close sx={{ color: '#006990' }} />
          </IconButton>
        </div>

        <div>
          <label
            htmlFor="comments"
            className=" text-xs font-medium text-gray-700"
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
              fontSize: '13px',
              width: '100%',
              padding: '9px',
              borderRadius: '4px',
              border: '1px solid gray',
            }}
          />
        </div>
        <div className="mt-5">
          <Button
            onClick={handleCloseComplaint}
            variant="contained"
            fullWidth
            color="primary"
          >
            Close Complaint
          </Button>
        </div>
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <div className="pt-5 h-[75vh] overflow-y-auto">
            <BaseCollapse name="Complaint Details">
              <div className="px-4">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                    bgcolor: '#f0f9ff', // Very light blue
                    borderRadius: 1,
                    borderLeft: '4px solid #006990',
                  }}
                >
                  <Chip
                    label={clickedItem?.header}
                    size="small"
                    sx={{
                      backgroundColor: '#006990',
                      color: 'white',
                      fontWeight: 'bold',
                      alignSelf: 'flex-start',
                    }}
                  />
                  <p className="text-[15px] text-primary font-sans font-semibold">
                    {clickedItem?.message}
                  </p>
                </Box>
              </div>
              <BaseInputCard
                fields={fields}
                apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
                postApiFunction={apiService.post}
                clickedItem={clickedItem}
                useRequestBody={true}
                setOpenBaseCard={setOpenBaseCard}
                disableAll={true}
              />
            </BaseCollapse>

            <BaseCollapse className="mt-[-10px]" name="Complaint Attachments">
              <div className="px-6 pt-2">
                {clickedItem?.attachments &&
                  clickedItem.attachments.length > 0 && (
                    <Table
                      columns={fileColumns}
                      dataSource={clickedItem?.attachments}
                      pagination={false}
                      rowKey="id"
                      className="antcustom-table"
                      rowClassName={() => 'px-4'} // Add padding to rows
                      onHeaderRow={() => {
                        return {
                          className: 'px-4', // Add padding to headers
                        };
                      }}
                    />
                  )}
              </div>
            </BaseCollapse>
            <BaseCollapse name="Task Details" className="mt-6">
              <div className="px-6 pt-2">
                {clickedItem?.task ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-md flex w-full justify-between relative">
                    {/* Chip for Closed Status */}
                    <div className="absolute top-2 right-2">
                      {clickedItem.task.status === 1 ? (
                        <Chip
                          label="Open"
                          // icon={
                          //   <Verified
                          //     sx={{ color: 'white', fontSize: '16px' }}
                          //   />
                          // }
                          size="small"
                          sx={{
                            backgroundColor: '#2e7d32', // Green background for Active
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      ) : (
                        <Chip
                          label="Closed"
                          // icon={
                          //   <Close sx={{ color: 'white', fontSize: '16px' }} />
                          // }
                          size="small"
                          sx={{
                            backgroundColor: '#0070f3', // Red background for Inactive
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </div>
                    <div className="flex items-start mb-4 mr-3">
                      <div className="bg-blue-100 text-blue-800 rounded-lg p-3">
                        <Task />
                      </div>
                      {clickedItem.task.current_user && (
                        <>
                          <div className="space-y-2 ml-3">
                            <h5 className="text-sm font-medium">
                              Assigned User
                            </h5>
                            <p className="text-sm">
                              {clickedItem.task.current_user.firstName}{' '}
                              {clickedItem.task.current_user.lastName}
                            </p>
                            <p className="text-sm text-blue-600">
                              {clickedItem.task.current_user.email}
                            </p>
                            <p className="text-sm">
                              {clickedItem.task.current_user.phoneNumber ||
                                'No phone'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="">
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CRM Related</span>
                        <span>
                          {clickedItem.task.is_crm_related ? 'Yes' : 'No'}
                        </span>
                      </div> */}
                    </div>
                  </div>
                ) : (
                  <Empty description="No task details available" />
                )}
              </div>
            </BaseCollapse>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createComplaint}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseComplaintsTable
        status={status}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={
          status || status === 0
            ? endpoints.getComplaintByStatus(status)
            : endpoints.getComplaints
        }
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        breadcrumbTitle="Complaints"
        title="Complaints"
      />
    </div>
  );
};

export default Complaints;
