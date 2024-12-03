'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '../services/financeApi';
import { apiService as financeApiService } from '../services/financeApi';

const MemberContributions = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [contributionTypes, setContributionTypes] = React.useState([]);
  const [contributionBatch, setContributionBatch] = React.useState([]);

  const fetchContributionsTypes = async () => {
    try {
      const response = await financeApiService.get(
        financeEndpoints.getContributionType
      );
      setContributionTypes(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContributionBatches = async () => {
    try {
      const response = await financeApiService.get(
        financeEndpoints.getContributionBatches
      );
      setContributionBatch(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContributionBatches();
    fetchContributionsTypes();
  }, []);
  const columnDefs = [
    {
      field: 'no',
      headerName: 'No',
      headerClass: 'prefix-header',
      width: 90,
      filter: true,
    },

    {
      field: 'memberName',
      headerName: 'Member Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'personalNumber',
      headerName: 'Personal Number',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'employeeContribution',
      headerName: 'Employee Contribution',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'employerContribution',
      headerName: 'Employer Contribution',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'totalContribution',
      headerName: 'Total Contribution',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'periodReference',
      headerName: 'Period Reference',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? formatDate(params.value) : '';
      },
    },
    {
      field: 'isNewMember',
      headerName: 'Is New Member',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'contributionBatchId',
      headerName: 'Contribution Batch Id',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        if (contributionBatch && contributionBatch.length > 0) {
          const contributionBatchItem = contributionBatch.find(
            (item) => item.id === params.value
          );
          return contributionBatchItem ? contributionBatchItem.description : '';
        }
        return '';
      },
    },
    {
      field: 'contributionTypeId',
      headerName: 'Contribution Type ',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        if (contributionTypes && contributionTypes.length > 0) {
          const contributionType = contributionTypes.find(
            (item) => item.id === params.value
          );
          return contributionType ? contributionType.contributionTypeName : '';
        }
        return '';
      },
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,

      id: item.id,
      memberName: item.memberName,
      personalNumber: item.personalNumber,
      employeeContribution: item.employeeContribution,
      employerContribution: item.employerContribution,
      totalContribution: item.totalContribution,
      periodReference: item.periodReference,
      isNewMember: item.isNewMember,
      contributionBatchId: item.contributionBatchId,
      contributionTypeId: item.contributionTypeId,
      contributionTypeName: item.contributionTypeName,
    }));
  };

  const handlers = {};

  const baseCardHandlers = {};

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? `${clickedItem?.memberName}`
    : 'Create New Member';

  const fields = [
    /**
    * {
      "id": "ddd643be-dced-418f-ab2c-8db0a636c585",
      "memberId": "08dda78e-2ce6-4a9e-b454-c782074a66f2",
      "memberName": "Mark Smith Jackson",
      "personalNumber": "PR123480",
      "employeeContribution": 5500,
      "employerContribution": 5500,
      "totalContribution": 11000,
      "periodReference": "2024-12-07T00:00:00Z",
      "isNewMember": true,
      "contributionBatchId": "077b202e-f2aa-4fc5-9ed9-14165bda560e",
      "contributionTypeId": "7ca8b4b9-ff5c-4be4-b989-7093fdcfab70",
      "contributionTypeName": null
    },
    */
    { name: 'memberName', label: 'Member Name', type: 'text', required: true },

    {
      name: 'personalNumber',
      label: 'Personal Number',
      type: 'text',
      required: true,
    },

    {
      name: 'employerContribution',
      label: 'Employer Contribution',
      type: 'amount',
      required: true,
    },

    {
      name: 'totalContribution',
      label: 'Total Contribution',
      type: 'amount',
      required: true,
    },

    {
      name: 'periodReference',
      label: 'Period Reference',
      type: 'date',
      required: true,
    },

    {
      name: 'isNewMember',
      label: 'Is New Member',
      type: 'switch',
      required: true,
    },

    {
      name: 'contributionTypeId',
      label: 'Contribution Type Id',
      type: 'text',
      required: true,
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
            apiEndpoint={endpoints.createDepartment}
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
        fetchApiEndpoint={financeEndpoints.getContributions}
        fetchApiService={financeApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Contributions"
        currentTitle="Contributions"
      />
    </div>
  );
};

export default MemberContributions;
