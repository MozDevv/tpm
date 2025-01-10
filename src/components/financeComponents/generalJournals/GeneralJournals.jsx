'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';

import CountyCard from '@/components/pensionsComponents/setups/counties/CountyCard';
import GeneralJournalCard from './GeneralJournalCard';
import financeEndpoints from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import BaseAutoSaveInputCard from '../../baseComponents/BaseAutoSaveInputCard';
import { Dialog, Select } from '@mui/material';
import PostGL from './PostGL';
import { formatNumber } from '@/utils/numberFormatters';

const columnDefs = [
  {
    headerName: 'Document No',
    field: 'documentNo',

    pinned: 'left', // Pinning to the left ensures it's the first column
    checkboxSelection: true,
    headerCheckboxSelection: true,
    flex: 1,
  },
  {
    headerName: 'Document Type',
    field: 'documentType',
    flex: 1,
    valueFormatter: (params) => {
      const options = [
        { id: 0, name: 'Payment Voucher' },
        { id: 1, name: 'Purchase Invoice' },
        { id: 2, name: 'Sales Invoice' },
        { id: 3, name: 'Receipt' },
        { id: 4, name: 'Purchase Credit Memo' },
        { id: 5, name: 'Sales Credit Memo' },
        { id: 6, name: 'Journal Voucher' },
      ];

      const selectedOption = options.find(
        (option) => params.value === option.id
      );
      return selectedOption ? selectedOption.name : '';
    },
  },
  {
    headerName: 'Narration',
    field: 'narration',
    flex: 1,
  },
  {
    headerName: 'Amount',
    field: 'amount',
    flex: 1,
    cellStyle: { marginLeft: '50px' },
    valueFormatter: (params) => {
      return params.value ? formatNumber(params.value) : '0.00';
    },
  },

  {
    headerName: 'External Document No',
    field: 'externalDocumentNo',
    flex: 1,
  },
  {
    headerName: 'Posting Date',
    field: 'postingDate',
    flex: 1,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
  {
    headerName: 'VAT Date',
    field: 'vatDate',
    flex: 1,
    cellRenderer: function (params) {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    },
  },
];

const GeneralJournals = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      documentType: item.documentType,
      documentNo: item.documentNo,
      externalDocumentNo: item.externalDocumentNo,
      postingDate: item.postingDate,
      vatDate: item.vatDate,

      amount: item.amount,
      isPosted: item.isPosted,
      ...item,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
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
    postToGL: () => selectedRows.length > 0 && setOpenPostToGL(true),
  };

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

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
    createConstituency: () => {
      setDialogType('branch');
      setOpenAction(true);
    },

    ...(clickedItem &&
      openBaseCard && {
        postToGL: () => {
          if (selectedRows.length === 0 && clickedItem && openBaseCard) {
            setSelectedRows([clickedItem]);
          }
          setOpenPostToGL(true);
        },
      }),
  };

  const title = clickedItem
    ? `${clickedItem.documentNo}`
    : 'Create New General Journal';

  const fields = [
    {
      name: 'documentType',
      label: 'Document Type',
      type: 'select',
      required: true,

      options: [
        { id: 0, name: 'Payment Voucher' },
        { id: 1, name: 'Purchase Invoice' },
        { id: 2, name: 'Sales Invoice' },
        { id: 3, name: 'Receipt' },
        { id: 4, name: 'Purchase Credit Memo' },
        { id: 5, name: 'Sales Credit Memo' },
        { id: 6, name: 'Journal Voucher' },
      ],
    },
    {
      name: 'documentNo',
      label: 'Document No',
      type: 'text',

      disabled: true,
    },
    {
      name: 'externalDocumentNo',
      label: 'External Document No',
      type: 'text',
    },
    {
      name: 'narration',
      label: 'Narration',
      type: 'text',
    },
    {
      name: 'postingDate',
      label: 'Posting Date',
      type: 'date',
      required: true,
    },
    {
      name: 'vatDate',
      label: 'VAT Date',
      type: 'date',
      required: true,
    },

    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      options: [
        {
          id: 'usd',
          name: 'USD',
        },
        {
          id: 'kes',
          name: 'KES',
        },
        {
          id: 'eur',
          name: 'EUR',
        },
      ],
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'isPosted',
      label: 'Is Posted',
      type: 'switch',
    },
  ];

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (selectedRows) => {
    console.log('Selected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };

  return (
    <div className="">
      {/* {JSON.stringify(selectedRows)} */}
      <Dialog
        open={openPostToGL}
        onClose={() => setOpenPostToGL(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
        }}
      >
        <PostGL
          clickedItem={clickedItem}
          setOpenBaseCard={setOpenBaseCard}
          selectedRows={selectedRows}
          setOpenPostGL={setOpenPostToGL}
          setSelectedRows={setSelectedRows}
        />
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        isUserComponent={false}
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
      >
        {clickedItem ? (
          <GeneralJournalCard
            fields={fields}
            apiEndpoint={financeEndpoints.editGeneralJournal}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            setClickedItem={setClickedItem}
            transformData={transformData}
          />
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addGeneralJournal}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.editGeneralJournal}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getGeneralJournalsById}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        openPostToGL={openPostToGL}
        onSelectionChange={handleSelectionChange}
        openAction={openAction}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getGeneralJournals}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Journals"
        currentTitle="General Journals"
      />
    </div>
  );
};

export default GeneralJournals;
