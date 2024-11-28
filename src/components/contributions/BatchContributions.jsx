'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';
import financeEndpoints from '@/components/services/financeApi';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { parseDate } from '@/utils/dateFormatter';
import BaseInputCard from '../baseComponents/BaseInputCard';
import generateExcelTemplate from '@/utils/excelHelper';
import endpoints from '../services/setupsApi';
import { apiService as setupsApiService } from '../services/setupsApi';

const BatchContributions = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      periodReference: item.periodReference,
      description: item.description,
      contributionTypeId: item.contributionTypeId,

      // roles: item.roles,
    }));
  };

  const [uploadExcel, setUploadExcel] = React.useState(false);
  const [sponsors, setSponsors] = React.useState([]);

  const generateMembersTemplate = () => {
    const mapDataFunction = (data) => [
      [
        'Payroll Number',
        'KRA Pin',
        'National ID',
        'PSSF Number',
        'Surname',
        'First Name',
        'Last Name',
        'Other Name',
        'Gender',
        'Date of Birth',
      ], // Headers
      ...data.map((item) => [
        item.payrollNumber, // Payroll Number
        item.kraPin, // KRA Pin
        item.nationalId, // National ID
        item.pssfNumber, // PSSF Number
        item.surname, // Surname
        item.firstName, // First Name
        item.lastName, // Last Name
        item.otherName, // Other Name
        item.gender, // Gender
        new Date(item.dateOfBirth).toLocaleDateString('en-GB'),
      ]),
    ];

    generateExcelTemplate(
      financeEndpoints.getMemberUploadTemplate,
      mapDataFunction,
      'members_upload_template.xlsx',
      'Members Template'
    );
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
    // generateMembersTemplate: () => {
    //   generateMembersTemplate();
    // },
    // uploadMembers: () => {
    //   setUploadExcel(true);
    // },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Batch - ' + clickedItem?.periodReference
    : 'Create Batch Contribution';

  const [vendorPG, setVendorPG] = React.useState([]);
  const [contributionTypes, setContributionTypes] = React.useState([]);

  const fetchContributionsTypes = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getContributionType
      );
      setContributionTypes(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContributionsTypes();
  }, []);
  const fields = [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'periodReference',
      label: 'Period Reference',
      type: 'date',
      required: true,
    },
    {
      name: 'contributionTypeId',
      label: 'Contribution Type',
      type: 'select',
      options: contributionTypes.map((item) => ({
        id: item.id,
        name: item.contributionTypeName,
      })),
      required: true,
    },
    {
      name: 'file',
      label: 'Upload Excel',
      type: 'file',
      required: true,
      fileName: 'Upload Contributions Excel',
    },
  ];

  const columnDefs = [
    {
      field: 'periodReference',
      headerName: 'Period Reference',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
      pinned: 'left',
      valueFormatter: (params) => {
        return params.value ? parseDate(params.value) : '';
      },
    },

    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'contributionTypeId',
      headerName: 'Contribution Type',
      headerClass: 'prefix-header',
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

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteVendor(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {' '}
        {clickedItem ? (
          <>
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.uploadContributions}
              postApiFunction={apiService.post}
              useRequestBody={false}
              setOpenBaseCard={setOpenBaseCard}
              isBranch={true}
              refreshData={false}
            />
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.uploadContributions}
            postApiFunction={apiService.post}
            useRequestBody={false}
            setOpenBaseCard={setOpenBaseCard}
            isBranch={true}
            refreshData={false}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getContributionBatches}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Contributions Processing"
        currentTitle="Contributions Processing"
      />
    </div>
  );
};

export default BatchContributions;
