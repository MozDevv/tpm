import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import useFetchAsync from '../hooks/DynamicFetchHook';

const GeneralSendersSetups = () => {
  const columnDefs = [
    {
      field: 'no',
      headerName: 'No',
      headerClass: 'prefix-header',
      width: 90,
      filter: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      filter: true,
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

  const { data: numberSeries } = useFetchAsync(
    endpoints.getNumberSeries,
    apiService
  );

  const title = clickedItem
    ? 'General Matters Sender'
    : 'Create New General Matters Sender';

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    // {
    //   name: 'numberSeriesId',
    //   label: 'Number Series',
    //   type: 'select',
    //   required: true,
    //   table: true,
    //   options: numberSeries?.map((item) => ({
    //     id: item.id,
    //     name: item.code,
    //     accountNo: item?.description,
    //   })),
    // },
    /**  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "description": "string",
  "numberSeriesId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "priority": 0
} */
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
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createGeneralSenders}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createGeneralSenders}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
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
        fetchApiEndpoint={endpoints.getGeneralSenders}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Policy Matters Senders Setups"
        currentTitle="General Policy Matters Senders Setups"
      />
    </div>
  );
};

export default GeneralSendersSetups;
