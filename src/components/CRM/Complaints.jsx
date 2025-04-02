'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const Complaints = () => {
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
    {
      name: 'NationalId',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    {
      name: 'PensionerNumber',
      label: 'Pensioner Number',
      type: 'text',
      required: true,
    },
    {
      name: 'EmployeeNumber',
      label: 'Employee Number',
      type: 'text',
      required: true,
    },
    {
      name: 'PhoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'EmailAddress',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      name: 'Name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'Header',
      label: 'Header',
      type: 'text',
      required: true,
    },
    {
      name: 'Message',
      label: 'Message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ReferenceId',
      label: 'Reference ID',
      type: 'text',
      required: true,
    },
    {
      name: 'Attachments',
      label: 'Attachments',
      type: 'file',
      multiple: true,
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
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createComplaint}
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
        fetchApiEndpoint={endpoints.getComplaints}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Complaints"
        currentTitle="Complaints"
      />
    </div>
  );
};

export default Complaints;
