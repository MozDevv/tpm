import React, { useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';
import BaseExpandCard from '../baseComponents/BaseExpandCard';
import ClaimLookupPolicy from './ClaimLookupPolicy';
import { Dialog } from '@mui/material';
import OmbudsmanReport from './OmbudsmanReport';
import useFetchAsync from '../hooks/DynamicFetchHook';

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
      headerName: 'Represented By',
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
    // {
    //   field: 'partyEmail',
    //   headerName: 'Party Email',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   width: 200,
    // },
    // {
    //   field: 'partyPhone',
    //   headerName: 'Party Phone',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   width: 200,
    // },
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
      field: 'remarks',
      headerName: 'Corrective Action',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'receivedAt',
      headerName: 'Date Recieved',
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
  const [claimLookup, setClaimLookup] = React.useState(false);
  const [refreshData, setRefreshData] = React.useState(false);
  const [openReport, setOpenReport] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
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
    'Ombudsman Report': () => setOpenReport(true),
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
            formData.append('referenceNo', 'attachments');

            await apiService.post(endpoints.createOmbudsman, formData);
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
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const { data: postalCodes } = useFetchAsync(
    endpoints.getPostalCodes,
    apiService
  );

  const title = clickedItem ? 'Ombusdman Case' : 'Create New Ombusdman Case';
  const [formData, setFormData] = useState();

  const fields = [
    // { name: 'id', label: 'ID', type: 'text', required: false },
    {
      name: 'pensionerIdentifierType',
      label: 'Identifier Type',
      type: 'select',

      required: true,
      options: [
        { id: 0, name: 'National Id' },
        { id: 1, name: 'Passport Number' },
      ],
    },

    {
      name: 'pensionerIdentificationNumber',
      label: 'Identification Number',
      type: 'claimSearch',
      required: true,
    },

    {
      name: 'pensionerFirstName',
      label: 'Pensioner First Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerMiddleName',
      label: 'Pensioner Middle Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerSurname',
      label: 'Pensioner Surname',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerEmail',
      label: 'Pensioner Email',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerPhone',
      label: 'Pensioner Phone',
      type: 'text',
      disabled: true,
    },

    {
      name: 'pensionerPersonalNo',
      label: 'Pensioner Personal No',
      type: 'text',
      required: false,
      disabled: true,
    },
    {
      name: 'pensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: false,
      disabled: true,
    },

    {
      name: 'referenceNo',
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
      name: 'postalCodeId',
      label: 'Postal Code',
      type: 'select',
      table: true,
      required: true,
      options: postalCodes?.map((item) => ({
        id: item.id,
        name: item.code,
        accountNo: item.name,
      })),
    },
    {
      name: 'postalAddress',
      label: 'Postal Address',
      type: 'text',
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
    {
      name: 'partyName',
      label: 'Represented By',
      type: 'text',
      required: true,
    },

    // { name: 'partyEmail', label: 'Party Email', type: 'text', required: false },
    // {
    //   name: 'partyPhone',
    //   label: 'Party Phone',
    //   type: 'phone_number',
    //   required: false,
    // },

    {
      name: 'complaintIssue',
      label: 'Complaint Issue',
      type: 'text',
      required: true,
    },
    {
      name: 'rootCause',
      label: 'Root Cause',
      type: 'textarea',
      required: true,
    },
    // { name: 'status', label: 'Status', type: 'number', required: false },
    {
      name: 'receivedAt',
      label: 'Date Recieved',
      type: 'date',
      required: true,
    },
    // { name: 'attachments', label: 'Attachments', type: 'file', required: false },
    {
      name: 'remarks',
      label: 'Corrective Remarks',
      type: 'textarea',
      required: false,
    },

    {
      name: 'attachments',
      label: 'Attachments',
      type: 'attachments',
      required: false,
    },
  ];

  const reportItems = ['Ombudsman Report'];

  return (
    <div className="">
      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '30vw',
            maxWidth: '35vw',
          },
        }}
      >
        <div className="px-6">
          <OmbudsmanReport
            columnDefs={columnDefs}
            setOpenReport={setOpenReport}
          />
        </div>
      </Dialog>
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
            apiEndpoint={endpoints.createOmbudsman}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
            showRequired={true}
          />
        ) : (
          <BaseInputCard
            setInputData={setFormData}
            fields={fields}
            apiEndpoint={endpoints.createOmbudsman}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
            showRequired={true}
          />
        )}
      </BaseCard>
      <BaseTable
        refreshData={refreshData}
        reportItems={reportItems}
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
        onSelectionChange={(selectedRows) => {
          setSelectedItems(selectedRows);
        }}
        segmentOptions2={[
          { value: 0, label: 'On Going' },
          { value: 1, label: 'Resolved' },
        ]}
      />
    </div>
  );
};

export default Ombudsman;
