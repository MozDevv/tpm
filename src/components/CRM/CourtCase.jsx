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
import { Dialog } from '@mui/material';
import OmbudsmanReport from './OmbudsmanReport';
import CourtCaseReport from './CourtCaseReport';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { statusIcons } from './GeneralCase';
import BaseApprovalCard from '../baseComponents/BaseApprovalCard';

const CourtCase = () => {
  const statusIcons2 = {
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
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const status = statusIcons2[params.value];
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
      headerName: 'Approval Status',
      field: 'approvalStatus',
      width: 150,
      filter: true,
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
  const [openReport, setOpenReport] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);

  const reportItems = ['Court Case Report'];

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    approvalRequest: () => console.log('Approval Request clicked'),
    sendApprovalRequest: () => setOpenApprove(1),
    cancelApprovalRequest: () => setOpenApprove(2),
    approveDocument: () => setOpenApprove(3),
    rejectDocumentApproval: () => setOpenApprove(4),
    delegateApproval: () => {
      setOpenApprove(5);
      setWorkFlowChange(Date.now());
    },

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
    'Court Case Report': () => {
      setOpenReport(true);
      // setClickedItem(null);
    },
  };

  const baseCardHandlers = {
    approvalRequest: () => console.log('Approval Request clicked'),
    sendApprovalRequest: () => setOpenApprove(1),
    cancelApprovalRequest: () => setOpenApprove(2),
    approveDocument: () => setOpenApprove(3),
    rejectDocumentApproval: () => setOpenApprove(4),
    delegateApproval: () => {
      setOpenApprove(5);
      setWorkFlowChange(Date.now());
    },
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'Court Case' : 'Create New Court Case';

  const { data: postalCodes } = useFetchAsync(
    endpoints.getPostalCodes,
    apiService
  );

  const fields = [
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

    { name: 'caseNo', label: 'Case No', type: 'text', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: false },
    {
      name: 'referenceNo',
      label: 'Reference No',
      type: 'text',
      required: false,
    },
    {
      name: 'partyName',
      label: 'Represented By',
      type: 'text',
      required: false,
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
      name: 'nextMentionDate',
      label: 'Next Mention Date',
      type: 'date',
      required: false,
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
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
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
          <CourtCaseReport
            columnDefs={columnDefs}
            setOpenReport={setOpenReport}
          />
        </div>
      </Dialog>{' '}
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
            showRequired={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createCourtCase}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
            showRequired={true}
          />
        )}
      </BaseCard>
      <BaseTable
        reportItems={reportItems}
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
          setSelectedRows(selectedRows);
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
