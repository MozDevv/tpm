'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import { name } from 'dayjs/locale/en-au';

const ApprovalStages = () => {
  const [users, setUsers] = useState([]);
  const [approvalTypes, setApprovalTypes] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiService.get(endpoints.getUsers);
        if (res.status === 200) {
          const data = res.data.data.map((item) => ({
            id: item.id,
            name: item.email,
          }));
          setUsers(data);
          //  getApprovalUsers();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchApprovalTypes = async () => {
      try {
        const res = await apiService.get(endpoints.getApprovalTypes);
        const data = res.data.data.map((item) => ({
          id: item.id,
          name: item.approval_type_name,
        }));
        setApprovalTypes(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchApprovalTypes();
    fetchUsers();
  }, []);

  const [approvers, setApprovers] = useState([]);
  useEffect(() => {
    if (users.length > 0) {
      getApprovalUsers();
    }
  }, [users]);

  const getApprovalUsers = async () => {
    try {
      const res = await apiService.get(endpoints.getApprovalUsers);
      const data = res.data.data.map((item) => ({
        id: item.id,
        name: users.find((user) => user.id === item.primary_approver_id)?.name,
        row1: users.find((user) => user.id === item.primary_approver_id)?.name,
        row2: users.find((user) => user.id === item.secondary_approver_id)
          ?.name,
      }));
      setApprovers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columnDefs = [
    {
      field: 'approval_type_id',
      headerName: 'Approval Type',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = approvalTypes.find((user) => user.id === params.value);
        return user?.name || 'N/A';
      },
    },
    {
      field: 'approval_stage_sequence',
      headerName: 'Approval Stage Sequence',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'approval_stage_name',
      headerName: 'Approval Stage Name',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'approval_level_name',
      headerName: 'Approval Level Name',
      headerClass: 'prefix-header',
      filter: true,
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
      field: 'on_reject_return_to',
      headerName: 'On Reject Return To',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || 'N/A';
      },
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      approval_type_id: item.approval_type_id,
      approval_stage_sequence: item.approval_stage_sequence,
      approval_stage_name: item.approval_stage_name,
      approval_level_name: item.approval_level_name,
      primary_approver_id: item.primary_approver_id,
      on_reject_return_to: item.on_reject_return_to,

      // roles: item.roles,
    }));
  };

  const handlers = {
    filter: () => console.log('Filter clicked'),
    openInExcel: () => console.log('Export to Excel clicked'),
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

  const title = clickedItem
    ? 'Approval Stages'
    : 'Create a New Approval Stages';

  const fields = [
    {
      name: 'approval_type_id',
      label: 'Approval Type',
      type: 'autocomplete',
      options: approvalTypes,
    },
    {
      name: 'approval_stage_sequence',
      label: 'Approval Stage Sequence',
      type: 'number',
      required: true,
    },
    {
      name: 'approval_stage_name',
      label: 'Approval Stage Name',
      type: 'text',
      required: true,
    },
    {
      name: 'approval_level_name',
      label: 'Approval Level Name',
      type: 'text',
      required: true,
    },
    {
      name: 'primary_approver_id',
      label: 'Primary Approver',
      type: 'table',
      row1: 'Primary Approver',
      row2: 'Secondary Approver',
      options: approvers,
    },
    {
      name: 'on_reject_return_to',
      label: 'On Reject Return To',
      type: 'autocomplete',
      options: users,
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
        deleteApiEndpoint={endpoints.deleteApprovalStage(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateApprovalStage}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createApprovalStage}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getApprovalStages}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Approval Stages"
        currentTitle="Approval Stages"
      />
    </div>
  );
};

export default ApprovalStages;
