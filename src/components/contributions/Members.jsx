'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';
import financeEndpoints from '@/components/services/financeApi';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';

const Members = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      payrollNumber: item.payrollNumber,
      kraPin: item.kraPin,
      nationalId: item.nationalId,
      pssfNumber: item.pssfNumber,
      surname: item.surname,
      firstName: item.firstName,
      lastName: item.lastName,
      otherName: item.otherName,
      gender: item.gender,
      dateOfBirth: item.dateOfBirth,
      sponsorId: item.sponsorId,

      // roles: item.roles,
    }));
  };

  const [uploadExcel, setUploadExcel] = React.useState(false);
  const [sponsors, setSponsors] = React.useState([]);

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

  const title = clickedItem ? clickedItem?.payrollNumber : 'Create New Member';

  const [vendorPG, setVendorPG] = React.useState([]);

  const fields = [
    {
      name: 'surname',
      label: 'Surname',
      type: 'text',
      required: true,
    },

    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'otherName',
      label: 'Other Name',
      type: 'text',
      required: true,
    },
    {
      name: 'payrollNumber',
      label: 'Payroll Number',
      type: 'text',
      required: true,
    },
    {
      name: 'kraPin',
      label: 'KRA Pin',
      type: 'text',
      required: true,
    },
    {
      name: 'nationalId',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    {
      name: 'pssfNumber',
      label: 'PSSF Number',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { id: 'Male', name: 'Male' },
        { id: 'Female', name: 'Female' },
      ],
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
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
  ];

  const columnDefs = [
    {
      field: 'payrollNumber',
      headerName: 'Payroll Number',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      pinned: 'left',
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'otherName',
      headerName: 'Other Name',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },

    {
      field: 'kraPin',
      headerName: 'KRA Pin',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'pssfNumber',
      headerName: 'PSSF Number',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      headerClass: 'prefix-header',
      width: 100,
      filter: true,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('en-GB');
      },
    },
    {
      field: 'sponsorId',
      headerName: 'Sponsor ID',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      valueFormatter: (params) => {
        return sponsors.find((sponsor) => sponsor.id === params.value)
          ?.sponsorName;
      },
    },
    {
      field: 'memberUploadBatchId',
      headerName: 'Member Upload Batch ID',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
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

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteMember(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {' '}
        {clickedItem ? (
          <>
            {' '}
            <BaseAutoSaveInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.addMember}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateMember}
              deleteApiEndpoint={financeEndpoints.deleteMember(clickedItem?.id)}
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
            apiEndpoint={financeEndpoints.addMember}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateMember}
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
        fetchApiEndpoint={financeEndpoints.getMembers}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Member List"
        currentTitle="Member List"
      />
    </div>
  );
};

export default Members;
