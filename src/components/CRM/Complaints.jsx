'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import BaseComplaintsTable from '../baseComponents/BaseComplaintsTable';
import { Alert, Card, Result, Table } from 'antd';
import { Button, Snackbar } from '@mui/material';
import { DownloadOutlined, Launch } from '@mui/icons-material';
import BaseCollapse from '../baseComponents/BaseCollapse';

const Complaints = () => {
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
      field: 'personalNumber',
      headerName: 'Personal Number',
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

  const baseCardHandlers = {};

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

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
            setPreviewContent(
              <embed
                src={record.edmsFileUrl}
                type={record.mimeType}
                width="100%"
                height="1000px"
              />
            );
            setPreviewOpen(true);
          }}
        >
          Preview
        </Button>
      ),
    },
    {
      title: 'Download',
      key: 'download',
      width: '25%',
      render: (_, record) => (
        <Button
          icon={<DownloadOutlined />}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            maxHeight: '26px',
            fontSize: '12px',
          }}
          onClick={() => {
            window.open(record.edmsDownloadUrl, '_blank');
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <div className="pt-5">
            <BaseCollapse name="Complaint Details">
              <div className="  rounded-lg p-3 shadow-sm mx-2">
                <Card
                  style={{
                    borderColor: '#91d5ff',
                    borderRadius: 10,
                    background: '#f0faff',
                    padding: '6px',
                  }}
                  bodyStyle={{ padding: '6px 12px' }}
                >
                  <div className="text-blue-800 font-semibold text-base">
                    {clickedItem?.header}
                  </div>

                  <p className="text-blue-700 text-sm mt-2">
                    {clickedItem?.message}
                  </p>
                </Card>
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
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4">
                      {/* Left Column */}
                      <div className="flex-1 min-w-[200px] gap-2">
                        <p className="text-[12px] text-gray-700">
                          <strong>Type:</strong> {clickedItem.task.type}
                        </p>
                        <p className="text-[12px] text-gray-700">
                          <strong>Status:</strong>{' '}
                          {clickedItem.task.status === 1
                            ? 'Active'
                            : 'Inactive'}
                        </p>
                        <p className="text-[12px] text-gray-700">
                          <strong>CRM Related:</strong>{' '}
                          {clickedItem.task.is_crm_related ? 'Yes' : 'No'}
                        </p>
                      </div>

                      {/* Right Column */}
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-[12px] text-gray-700">
                          <strong>Assigned To:</strong>{' '}
                          {clickedItem.task.current_user
                            ? `${clickedItem.task.current_user.firstName} ${clickedItem.task.current_user.lastName}`
                            : 'N/A'}
                        </p>
                        <p className="text-[12px] text-gray-700">
                          <strong>Assigned User Email:</strong>{' '}
                          {clickedItem.task.current_user?.email || 'N/A'}
                        </p>
                        <p className="text-[12px] text-gray-700">
                          <strong>Phone Number:</strong>{' '}
                          {clickedItem.task.current_user?.phoneNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-500">
                    No task details available.
                  </p>
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
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getComplaints}
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
