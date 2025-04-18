import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';

const Ombudsman = () => {
  const statusIcons = {
    0: { icon: Visibility, name: 'On Going', color: '#1976d2' }, // Blue
    // 1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    1: { icon: Verified, name: 'Resolved', color: '#2e7d32' }, // Green
    // 3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };
  const columnDefs = [
    {
      field: 'seriesNo',
      headerName: 'Document No',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      pinned: 'left', // Pinning to the left ensures it's the first column
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'ombudsmanBranch',
      headerName: 'Ombudsman Branch',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    {
      field: 'complaintChannel',
      headerName: 'Complaint Channel',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'partyName',
      headerName: 'Party Name',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

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
                fontSize: '13px',
              }}
            >
              {status.name}
            </span>
          </div>
        );
      },
    },

    {
      field: 'pensionerNumber',
      headerName: 'Pensioner Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'partyEmail',
      headerName: 'Party Email',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'partyPhone',
      headerName: 'Party Phone',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'pensionerNationalID',
      headerName: 'Pensioner National ID',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    {
      field: 'complaintIssue',
      headerName: 'Complaint Issue',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'rootCause',
      headerName: 'Root Cause',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

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
                fontSize: '13px',
              }}
            >
              {status.name}
            </span>
          </div>
        );
      },
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'receivedAt',
      headerName: 'Received At',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
  ];
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
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

  const title = clickedItem ? 'Ombusdman Case' : 'Create New Ombusdman Case';

  const fields = [
    // { name: 'id', label: 'ID', type: 'text', required: false },
    {
      name: 'referecenceNo',
      label: 'Reference No',
      type: 'text',
      required: true,
    },
    {
      name: 'ombudsmanBranch',
      label: 'Ombudsman Branch',
      type: 'text',
      required: true,
    },
    {
      name: 'complaintChannel',
      label: 'Complaint Channel',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'On Going' },
        { id: 1, name: 'Resolved' },
      ],
    },
    { name: 'partyName', label: 'Party Name', type: 'text', required: true },
    {
      name: 'pensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: false,
    },
    { name: 'partyEmail', label: 'Party Email', type: 'text', required: false },
    {
      name: 'partyPhone',
      label: 'Party Phone',
      type: 'phone_number',
      required: false,
    },
    {
      name: 'pensionerNationalID',
      label: 'Pensioner National ID',
      type: 'text',
      required: false,
    },
    {
      name: 'pensionerPersonalNo',
      label: 'Pensioner Personal No',
      type: 'text',
      required: false,
    },
    {
      name: 'complaintIssue',
      label: 'Complaint Issue',
      type: 'text',
      required: true,
    },
    { name: 'rootCause', label: 'Root Cause', type: 'text', required: true },
    // { name: 'status', label: 'Status', type: 'number', required: false },
    { name: 'receivedAt', label: 'Received At', type: 'date', required: false },
    // { name: 'attachments', label: 'Attachments', type: 'file', required: false },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },

    {
      name: 'attachments',
      label: 'Attachments',
      type: 'attachments',
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
        // deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        // deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            // apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            // postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createOmbudsman}
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
        fetchApiEndpoint={endpoints.getOmbudsman}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Ombudsman Cases"
        currentTitle="Ombudsman Cases"
        segmentFilterParameter2="status"
        // excelTitle="Ombudsman Cases"
        isOmbudsman={true}
        segmentOptions2={[
          { value: 0, label: 'On Going' },
          { value: 1, label: 'Resolved' },
        ]}
      />
    </div>
  );
};

export default Ombudsman;
