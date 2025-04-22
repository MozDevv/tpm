import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';
import BaseExpandCard from '../baseComponents/BaseExpandCard';
import ClaimLookupPolicy from './ClaimLookupPolicy';

const CourtCase = () => {
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
      field: 'caseNo',
      headerName: 'Case No',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    // {
    //   field: 'referenceNo',
    //   headerName: 'Reference No',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   width: 200,
    // },
    {
      field: 'partyName',
      headerName: 'Party Name',
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
      field: 'pensionerNationalID',
      headerName: 'Pensioner National ID',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'pensionerPersonalNo',
      headerName: 'Pensioner Personal No',
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
      field: 'nature',
      headerName: 'Nature',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'parties',
      headerName: 'Parties',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'region',
      headerName: 'Region',
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

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
      // roles: item.roles,
    }));
  };
  const [claimLookup, setClaimLookup] = React.useState(false);

  const [selectedItems, setSelectedItems] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);

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
    claimLookup: () => setClaimLookup(true),

    resolve: async () => {
      if (selectedItems && selectedItems.length > 0) {
        try {
          for (const item of selectedItems) {
            const { attachments, status, ...rest } = item;

            const formData = new FormData();

            Object.keys(rest).forEach((key) => {
              formData.append(key, rest[key]);
            });

            formData.append('status', 1);
            formData.append('referecenceNo', 'attachments');

            await apiService.post(endpoints.createCourtCase, formData);
          }
          setRefreshData((prev) => !prev);
          console.log('All selected items resolved successfully.');
        } catch (error) {
          console.error('Error resolving items:', error);
        }
      } else {
        console.log('No items selected to resolve.');
      }
    },
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

  const title = clickedItem ? 'Court Case' : 'Create New Court Case';

  const fields = [
    // { name: 'id', label: 'ID', type: 'text', required: false },
    { name: 'caseNo', label: 'Case No', type: 'text', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: false },
    {
      name: 'referenceNo',
      label: 'Reference No',
      type: 'text',
      required: false,
    },
    { name: 'partyName', label: 'Party Name', type: 'text', required: true },
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
    {
      name: 'pensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: true,
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
    { name: 'partyEmail', label: 'Party Email', type: 'text', required: false },
    {
      name: 'partyPhone',
      label: 'Party Phone',
      type: 'phone_number',
      required: false,
    },
    { name: 'nature', label: 'Nature', type: 'text', required: false },
    { name: 'parties', label: 'Parties', type: 'text', required: false },
    { name: 'region', label: 'Region', type: 'text', required: false },
    // { name: 'status', label: 'Status', type: 'number', required: false },
    { name: 'receivedAt', label: 'Received At', type: 'date', required: false },
    {
      name: 'attachments',
      label: 'Attachments',
      type: 'attachments',
      required: false,
    },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: false },
  ];

  return (
    <div className="">
      {' '}
      <BaseExpandCard
        open={claimLookup}
        onClose={() => setClaimLookup(false)}
        title="Claim Lookup"
        // handlers={handlers}
      >
        <ClaimLookupPolicy />
      </BaseExpandCard>
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
            apiEndpoint={endpoints.createCourtCase}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createCourtCase}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        refreshData={refreshData}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getCourtCase}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Court Case"
        currentTitle="Court Case"
        segmentFilterParameter2="status"
        onSelectionChange={(selectedRows) => {
          setSelectedItems(selectedRows);
        }}
        segmentOptions2={[
          { value: 0, label: 'On Going' },
          { value: 1, label: 'Resolved' },
        ]}
        // currentTitle="Departments Setups"
      />
    </div>
  );
};

export default CourtCase;
