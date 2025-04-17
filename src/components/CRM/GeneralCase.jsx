import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const GeneralCase = () => {
  const columnDefs = [
    {
      field: 'seriesNo',
      headerName: 'Series No',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'referenceNo',
      headerName: 'Reference No',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyName',
      headerName: 'Party Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyEmail',
      headerName: 'Party Email',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'partyPhone',
      headerName: 'Party Phone',
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
      headerName: 'Source',
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
      headerName: 'Received At',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'attachments',
      headerName: 'Attachments',
      headerClass: 'prefix-header',
      filter: false,
      flex: 1,
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
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'General Policy' : 'Create New General Policy';

  const fields = [
    // { name: 'id', label: 'ID', type: 'text', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    {
      name: 'referenceNo',
      label: 'Reference No',
      type: 'text',
      required: true,
    },
    { name: 'partyName', label: 'Party Name', type: 'text', required: true },
    { name: 'partyEmail', label: 'Party Email', type: 'text', required: true },
    { name: 'partyPhone', label: 'Party Phone', type: 'text', required: true },
    { name: 'nature', label: 'Nature', type: 'text', required: true },
    { name: 'source', label: 'Source', type: 'text', required: true },
    { name: 'remarks', label: 'Remarks', type: 'text', required: true },
    { name: 'receivedAt', label: 'Received At', type: 'date', required: true },
    // {
    //   name: 'attachments',
    //   label: 'Attachments',
    //   type: 'file',
    //   required: false,
    // },
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
            apiEndpoint={endpoints.createGeneralPolicy}
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
        fetchApiEndpoint={endpoints.getGeneralPolicy}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Policy"
        currentTitle="General Policy"
      />
    </div>
  );
};

export default GeneralCase;
