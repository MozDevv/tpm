'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const Complaints = () => {
  const columnDefs = [
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'pensionerNumber',
      headerName: 'Pensioner Number',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'personalNumber',
      headerName: 'Personal Number',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'requesterName',
      headerName: 'Requester Name',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'header',
      headerName: 'Header',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'message',
      headerName: 'Message',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,

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
      field: 'portalReferenceId',
      headerName: 'Portal Reference ID',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'closedById',
      headerName: 'Closed By ID',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'currentlyVisibleById',
      headerName: 'Currently Visible By ID',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'closedAt',
      headerName: 'Closed At',
      headerClass: 'prefix-header',
      filter: true,

      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'closingComments',
      headerName: 'Closing Comments',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'lastEscalationTime',
      headerName: 'Last Escalation Time',
      headerClass: 'prefix-header',
      filter: true,

      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'wasEscalated',
      headerName: 'Was Escalated',
      headerClass: 'prefix-header',
      filter: true,

      cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'taskId',
      headerName: 'Task ID',
      headerClass: 'prefix-header',
      filter: true,
    },
  ];
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

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

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'Department' : 'Create New Department';

  const fields = [
    {
      name: 'NationalId',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    {
      name: 'PensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: true,
    },
    {
      name: 'EmployeeNumber',
      label: 'Employee Number',
      type: 'text',
      required: true,
    },
    {
      name: 'PhoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'EmailAddress',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      name: 'Name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'Header',
      label: 'Header',
      type: 'text',
      required: true,
    },
    {
      name: 'Message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ReferenceId',
      label: 'Reference ID',
      type: 'text',
      required: true,
    },
    {
      name: 'Attachments',
      label: 'Attachments',
      type: 'file',
      multiple: true,
      required: false,
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
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
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
      <BaseTable
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
        breadcrumbTitle="Complaints"
        currentTitle="Complaints"
      />
    </div>
  );
};

export default Complaints;
