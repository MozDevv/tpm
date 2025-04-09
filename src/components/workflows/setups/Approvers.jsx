'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const Approvers = () => {
  const [users, setUsers] = useState([]);
  const [mdas, setMdas] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiService.get(endpoints.getUsers, {
          'paging.pageSize': 1000,
        });
        const data = res.data.data.map((item) => ({
          id: item.id,
          name: item.email,
          ...item,
          mdaId: item.mdaId,
          departmentId: item.departmentId,
        }));
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchMdas = async () => {
      try {
        const res = await apiService.get(endpoints.mdas, {
          'paging.pageSize': 1000,
        });

        if (res.data && Array.isArray(res.data.data)) {
          const data = res.data.data.map((item) => ({
            ...item,
          }));
          setMdas(data);
          fetchUsers();
        } else {
          console.error('Invalid data format received from the API.');
        }
      } catch (error) {
        console.error('Error fetching MDAs:', error);
      }
    };

    fetchMdas();
  }, []);
  const { data: departments } = useFetchAsync(
    endpoints.getDepartments,
    apiService
  );
  const mdaMap = new Map(mdas.map((mda) => [mda.id, mda.name]));
  const departmentMap = new Map(
    departments &&
      departments?.map((department) => [department.id, department.name])
  );

  const columnDefs = [
    {
      field: 'primary_approver_id',
      headerName: 'Approver Name',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user ? `${user.firstName} ${user.lastName}` : 'N/A';
      },
    },
    {
      field: 'primary_approver_id',
      headerName: 'Approver Role',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.department?.name || 'N/A';
      },
    },
    {
      field: 'primary_approver_id',
      headerName: 'Approver Ministry/Department',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        if (!params?.value) {
          return '-';
        }

        const user = users.find((user) => user.id === params.value);
        if (!user) {
          return '-';
        }

        const mdaName = mdaMap.get(user.mdaId);
        const departmentName = departmentMap.get(user.departmentId);

        return mdaName || user.department?.name || departmentName || '-';
      },
    },
    {
      field: 'primary_approver_id',
      headerName: 'Primary Approver',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || 'N/A';
      },
    },
    {
      field: 'secondary_approver_id',
      headerName: 'Secondary Approver',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || 'N/A';
      },
    },
    {
      field: 'direct_approver_id',
      headerName: 'Direct Approver',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || 'N/A';
      },
    },
  ];
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  // const [departments, setDepartments] = useState([]); // [1]

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      primary_approver_id: item.primary_approver_id,
      secondary_approver_id: item.secondary_approver_id,
      direct_approver_id: item.direct_approver_id,
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
  const [inputData, setInputData] = React.useState({});
  ``;
  const [clickedItem, setClickedItem] = React.useState(null);
  // const [inputData, ]

  const title = clickedItem ? 'Approver' : 'Create a New Approver';
  const getFilteredUsers = () => {
    if (!inputData?.userType) {
      return users; // Return all users if userType is not set
    }

    if (inputData.userType === 1) {
      if (inputData?.mdaId) {
        return users.filter((user) => user.mdaId === inputData.mdaId);
      }
    } else if (inputData?.departmentId && inputData.userType === 2) {
      return users.filter(
        (user) => user.departmentId === inputData.departmentId
      );
    }

    return users; // Default to all users if no valid filter is applied
  };

  const fields = [
    ...(clickedItem
      ? [
          {
            name: 'primary_approver_id',
            label: 'Primary Approver',
            type: 'autocomplete',
            options: users,
          },

          {
            name: 'secondary_approver_id',
            label: 'Secondary Approver',
            type: 'autocomplete',
            options: users,
          },

          {
            name: 'direct_approver_id',
            label: 'Direct Approver',
            type: 'autocomplete',
            options: users,
          },
        ]
      : [
          {
            name: 'userType',
            label: 'User Type',
            type: 'select',
            options: [
              { id: 1, name: 'MDA User' },

              { id: 2, name: 'Other User' },
            ],
          },
          ...(inputData && inputData.userType === 1
            ? [
                {
                  name: 'mdaId',
                  label: 'MDA',
                  type: 'autocomplete',
                  options: mdas,
                },
              ]
            : [
                {
                  name: 'departmentId',
                  label: 'Department',
                  type: 'autocomplete',
                  options:
                    departments &&
                    departments.map((item) => ({
                      id: item.departmentId,
                      name: item.name,
                    })),
                },
              ]),
          {
            name: 'primary_approver_id',
            label: 'Primary Approver',
            type: 'autocomplete',
            options: getFilteredUsers(),
          },
          {
            name: 'secondary_approver_id',
            label: 'Secondary Approver',
            type: 'autocomplete',
            options: getFilteredUsers(),
          },
          {
            name: 'direct_approver_id',
            label: 'Direct Approver',
            type: 'autocomplete',
            options: getFilteredUsers(),
          },
        ]),
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
        deleteApiEndpoint={endpoints.deleteApprovalUser(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateApprovalUser}
            postApiFunction={apiService.put}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <>
            {' '}
            <BaseInputCard
              setInputData={setInputData}
              fields={fields}
              apiEndpoint={endpoints.createApprovalUser}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
            />{' '}
          </>
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getApprovalUsers}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Approvers"
        currentTitle="Approvers"
      />
    </div>
  );
};

export default Approvers;
