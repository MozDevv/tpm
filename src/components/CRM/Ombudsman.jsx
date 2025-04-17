import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const Ombudsman = () => {
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
    { name: 'partyName', label: 'Party Name', type: 'text', required: true },
    {
      name: 'pensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: false,
    },
    { name: 'partyEmail', label: 'Party Email', type: 'text', required: false },
    { name: 'partyPhone', label: 'Party Phone', type: 'text', required: false },
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
    { name: 'status', label: 'Status', type: 'number', required: false },
    { name: 'remarks', label: 'Remarks', type: 'text', required: false },
    { name: 'receivedAt', label: 'Received At', type: 'date', required: false },
    // { name: 'attachments', label: 'Attachments', type: 'file', required: false },
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
      />
    </div>
  );
};

export default Ombudsman;
