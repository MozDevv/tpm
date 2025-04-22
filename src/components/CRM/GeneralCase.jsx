import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseExpandCard from '../baseComponents/BaseExpandCard';
import ClaimLookupPolicy from './ClaimLookupPolicy';
import { Dialog } from '@mui/material';
import GeneralCaseReport from './GeneralCaseReport';
import useFetchAsync from '../hooks/DynamicFetchHook';

const GeneralCase = () => {
  const columnDefs = [
    {
      field: 'seriesNo',
      headerName: 'Document No',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      pinned: 'left', // Pinning to the left ensures
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    // {
    //   field: 'referenceNo',
    //   headerName: 'Reference No',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   flex: 1,
    // },
    {
      field: 'subject',
      headerName: 'Subject',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyName',
      headerName: 'Source',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyEmail',
      headerName: 'Source Email',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyPhone',
      headerName: 'Source Phone Number',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'nature',
      headerName: 'Nature',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'source',
      headerName: 'Receiving Channel',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'receivedAt',
      headerName: 'Date Recieved',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    // {
    //   field: 'attachments',
    //   headerName: 'Attachments',
    //   headerClass: 'prefix-header',
    //   filter: false,
    //   flex: 1,
    // },
  ];
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
      // roles: item.roles,
    }));
  };

  const [claimLookup, setClaimLookup] = React.useState(false);

  const [openReport, setOpenReport] = React.useState(false);

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    // delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
    claimLookup: () => setClaimLookup(true),
    'General Case Report': () => {
      setOpenReport(true);
      // setClickedItem(null);
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

  const title = clickedItem
    ? 'General Policy'
    : 'Incoming general policy matters';
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

    { name: 'subject', label: 'Subject', type: 'text', required: true },
    {
      name: 'referenceNo',
      label: 'Reference No',
      type: 'text',
      required: true,
    },
    { name: 'partyName', label: 'Source', type: 'text', required: true },
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
    { name: 'nature', label: 'Nature', type: 'text', required: true },
    {
      name: 'receivedAt',
      label: 'Date Recieved',
      type: 'date',
      required: true,
    },
    { name: 'remarks', label: 'Remarks', type: 'textarea', required: true },
    {
      name: 'source',
      label: 'Receiving Channel',
      type: 'text',
      required: true,
    },
    {
      name: 'attachments',
      label: 'Attachments',
      type: 'attachments',
      required: false,
      addName: true,
    },
  ];
  const reportItems = ['General Case Report'];

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
          <GeneralCaseReport
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
            apiEndpoint={endpoints.createGeneralPolicy}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
            showRequired={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createGeneralPolicy}
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
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getGeneralPolicy}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Policy Matters"
        currentTitle="General Policy Matters"
      />
    </div>
  );
};

export default GeneralCase;
