'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';
import financeEndpoints from '@/components/services/financeApi';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { parseDate } from '@/utils/dateFormatter';
import BaseInputCard from '../baseComponents/BaseInputCard';
import generateExcelTemplate from '@/utils/excelHelper';

const BatchUploadMembers = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      batchNo: item.batchNo,
      description: item.description,
      numberOfMembers: item.numberOfMembers,
      uploadDate: item.uploadDate,

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
    generateMembersTemplate: () => {
      generateMembersTemplate();
    },
    uploadMembers: () => {
      setUploadExcel(true);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.batchNo
    : 'Create Batch Member Upload';

  const [vendorPG, setVendorPG] = React.useState([]);

  const fields = [
    {
      name: 'batchNo',
      label: 'Batch No',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'numberOfMembers',
      label: 'Number of Members',
      type: 'number',
      required: true,
    },
    {
      name: 'uploadDate',
      label: 'Upload Date',
      type: 'date',
      required: true,
    },
  ];

  const columnDefs = [
    {
      field: 'batchNo',
      headerName: 'Batch No',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
      pinned: 'left',
    },

    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'numberOfMembers',
      headerName: 'Number of Members',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'uploadDate',
      headerName: 'Upload Date',
      headerClass: 'prefix-header',
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? parseDate(params.value) : '';
      },
    },
  ];

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await apiService.get(financeEndpoints.getSponsors, {
          'paging.pageSize': 1000,
        });
        setSponsors(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSponsors();
  }, []);
  const uploadFields = [
    {
      name: 'sponsorId',
      label: 'Sponsor',
      type: 'select',
      required: true,
      options: sponsors.map((sponsor) => ({
        id: sponsor.id,
        name: sponsor.sponsorName,
      })),
    },
    {
      name: 'file',
      label: 'Upload Excel',
      type: 'file',
      required: true,
      fileName: 'Upload Members Excel',
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={uploadExcel}
        setOpenBaseCard={setUploadExcel}
        title={'Upload Budget'}
        clickedItem={clickedItem}
        isSecondaryCard={true}
      >
        {' '}
        <BaseInputCard
          fields={uploadFields}
          apiEndpoint={financeEndpoints.uploadMembersExcel}
          postApiFunction={apiService.post}
          useRequestBody={false}
          setOpenBaseCard={setUploadExcel}
          isBranch={true}
          refreshData={false}
        />
      </BaseCard>
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
            {' '}
            <BaseAutoSaveInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.addBatchUpload}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateBatchUpload}
              deleteApiEndpoint={financeEndpoints.deleteBatchUpload(
                clickedItem?.id
              )}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.getBatchUploads}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
            />
          </>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addBatchUpload}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateBatchUpload}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getBatchUploads}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getBatchUploads}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Batch Member Upload"
        currentTitle="Batch Member Upload"
      />
    </div>
  );
};

export default BatchUploadMembers;
