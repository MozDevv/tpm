'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

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
  {
    field: 'created_date',
    headerName: 'Created Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'isMDA',
    headerName: 'Is Mda',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
  {
    field: 'isCustomerCare',
    headerName: 'Is Customer Care',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const ClaimInquiry = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.departmentId,
      name: item.name,
      description: transformString(item.description),
      created_date: item.created_date,
      isMDA: item.isMDA,
      isCustomerCare: item.isCustomerCare,
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
    // {
    //   "personalNumber": "string",
    //   "pensionerNationalId": "string",
    //   "dependantNationalId": "string",
    //   "pensionerNumber": "string",
    //   "dependantNumber": "string"
    // }
    {
      name: 'pensionerNumber',
      type: 'text',
      label: 'Pensioner Number',
    },
    {
      name: 'personalNumber',
      type: 'text',
      label: 'Personal Number',
    },
    {
      name: 'pensionerNationalId',
      type: 'text',
      label: 'Pensioner National ID',
    },
    {
      name: 'dependantNationalId',
      type: 'text',
      label: 'Dependant National ID',
    },

    {
      name: 'dependantNumber',
      type: 'text',
      label: 'Dependant Number',
    },
  ];

  return (
    <div className="bg-white mt-8 px-5">
      <BaseInputCard
        fields={fields}
        apiEndpoint={endpoints.createDepartment}
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        useRequestBody={true}
        setOpenBaseCard={setOpenBaseCard}
      />
    </div>
  );
};

export default ClaimInquiry;
