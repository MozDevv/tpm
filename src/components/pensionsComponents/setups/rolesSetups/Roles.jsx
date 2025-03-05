import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

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
    field: 'departmentId',
    headerName: 'departmentID',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    hide: true,
  },
  {
    field: 'departmentName',
    headerName: 'Department',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const Roles = () => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]
  const [inputData, setInputData] = useState({});

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.roleId,
      no: index + 1 + (pageNumber - 1) * pageSize,
      name: item.name,
      description: transformString(item.description),
      created_date: item.created_date,
      departmentId: item.departmentID,
      departmentName: item?.department?.name,
      claimStage: item.claim_stage,
      officer_incharge_id: item.officer_incharge_id,
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

  const title = clickedItem ? 'Role' : 'Create a New Role';

  const { data: users } = useFetchAsync(endpoints.getUsers, apiService);

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'departmentId',
      label: 'Select Department',
      type: 'select',
      required: true,
      options: departments.map((d) => ({
        id: d.departmentId,
        name: d.name,
      })),
    },

    ...(departments &&
    inputData &&
    inputData.departmentId &&
    departments
      .find((d) => d.departmentId === inputData.departmentId)
      ?.name.toLowerCase()
      .includes('claims')
      ? [
          {
            name: 'claimStage',
            label: 'Claim Stage',
            type: 'select',
            required: false,
            options: [
              { id: 0, name: 'Claims Verification' },
              { id: 1, name: 'Claims Validation' },
              { id: 2, name: 'Claim Approval' },
            ],
          },
          {
            name: 'officer_incharge_id',
            label: 'Officer In Charge ID',
            type: 'autocomplete',
            required: false,
            options: users && users.map((u) => ({ id: u.id, name: u.email })),
          },
        ]
      : []),
  ];

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteRole(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateRole(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={false}
            setInputData={setInputData}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createRole}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            setInputData={setInputData}
          />
        )}
      </BaseCard>
      <BaseTable
        scrollable={true}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getRoles}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Roles Setups"
        currentTitle="Roles Setups"
      />
    </div>
  );
};

export default Roles;
