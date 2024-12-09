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
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Button } from '@mui/material';
import BaseTabs from '../baseComponents/BaseTabs';
import { saveAs } from 'file-saver';

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

  const generateMembersTemplate = async () => {
    try {
      // Fetch the file as a blob
      const res = await apiService.get(
        financeEndpoints.downloadMemberTemplate,
        {
          responseType: 'blob', // Axios will treat the response as a binary Blob
        }
      );

      // Check if the response is a valid Blob
      if (res.data instanceof Blob) {
        // Create a download link for the Blob
        const url = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Member Upload Template.xlsx'; // Set desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up DOM
        URL.revokeObjectURL(url); // Release memory
      } else {
        console.error('Invalid file data received from the API.');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
    }
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
    ? 'Batch - ' + clickedItem?.batchNo
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
    ...(clickedItem
      ? []
      : [
          {
            name: 'file',
            label: 'Upload Excel',
            type: 'file',
            required: true,
            fileName: 'Upload Members Excel',
          },
        ]),
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

  const [mdas, setMdas] = useState([]);

  const fetchMdas = async () => {
    try {
      const res = await setupsApiService.get(endpoints.mdas, {
        'paging.pageNumber': 1,
        'paging.pageSize': 1000,
      });
      setMdas(
        res.data.data.map((mda) => ({
          id: mda.id,
          name: mda.description,
        }))
      );
    } catch (error) {
      console.error('Error fetching MDAs:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []);

  const formData = new FormData();

  const [previewDetails, setPreviewDetails] = useState([]);

  const handlePreview = async (file) => {
    console.log('Preview clicked');
    formData.append('file', file);

    try {
      const res = await apiService.post(
        financeEndpoints.previewMemberDetails,
        formData
      );

      if (res.data.succeeded) {
        setPreviewDetails(res.data.data);
        console.log('Preview data:', res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const membershipStatusMap = {
    0: { name: 'Active', color: '#2ecc71' }, // Green
    1: { name: 'Deferred', color: '#e74c3c' }, // Red
    2: { name: 'Died', color: '#95a5a6' }, // Grey
    3: { name: 'Retired', color: '#9b59b6' }, // Purple
    4: { name: 'Leave of absence', color: '#f39c12' }, // Orange
    5: { name: 'Secondment', color: '#3498db' }, // Blue
    6: { name: 'Fully paid', color: '#1abc9c' }, // Turquoise
  };
  const previewColdefs = [
    {
      field: 'payrollNumber',
      headerName: 'Payroll Number',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      pinned: 'left',
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },

    {
      field: 'membershipStatus',
      headerName: 'Membership Status',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,

      cellRenderer: (params) => {
        const status = membershipStatusMap[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 1,
              // borderColor: status.color,
              maxHeight: '22px',
              cursor: 'pointer',
              color: status.color,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {status.name}
          </Button>
        );
      },
    },
    {
      field: 'kraPin',
      headerName: 'KRA Pin',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },
    {
      field: 'pssfNumber',
      headerName: 'PSSF Number',
      headerClass: 'prefix-header',
      width: 200,
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
      width: 200,
      filter: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('en-GB');
      },
    },
    {
      field: 'sponsorId',
      headerName: 'Sponsor ID',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => {
        return mdas.find((sponsor) => sponsor.id === params.value)?.name;
      },
    },

    {
      field: 'dateOfJoiningScheme',
      headerName: 'Date of Joining Scheme',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'dateOfEmployment',
      headerName: 'Date of Employment',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'dateOfLeaving',
      headerName: 'Date of Leaving',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },
    {
      field: 'emailAdress',
      headerName: 'Email Address',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
    },

    {
      field: 'maritalStatus',
      headerName: 'Marital Status',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => {
        const options = [
          { id: 0, name: 'Single' },
          { id: 1, name: 'Married' },
          { id: 2, name: 'Divorced' },
          { id: 3, name: 'Widowed' },
        ];
        const option = options.find((opt) => opt.id === params.value);
        return option ? option.name : '';
      },
    },
  ];

  const fetchMembers = async () => {};

  const tabPanes = [
    {
      key: '1',
      title: 'Batch Information',
      content: (
        <div>
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
        </div>
      ),
    },
    {
      key: '2',
      title: 'Batch Members',
      content: (
        <div className="ag-theme-quartz min-h-[600px] max-h-[600px] h-[200px]  gap-3">
          <Button
            variant="text"
            // onClick={exportData}
            startIcon={
              <img
                src="/excel.png"
                alt="excel"
                className=""
                height={20}
                width={24}
              />
            }
            sx={{
              color: '#006990',
              fontSize: '14px',
              fontWeight: 'semibold',
              textTransform: 'none',
              alignItems: 'start',
              mb: 1,
            }}
          >
            Export to Excel
          </Button>
          <AgGridReact
            columnDefs={previewColdefs}
            rowData={previewDetails}
            pagination={false}
            domLayout="normal"
            alwaysShowHorizontalScroll={true}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
              // onGridReady(params);
            }}
            animateRows={true}
            rowSelection="multiple"
            className="custom-grid ag-theme-quartz"
          />
        </div>
      ),
    },
    //
  ];
  return (
    <div className="">
      {/* <BaseCard
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
      </BaseCard> */}
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
        {!clickedItem ? (
          <>
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.addBatchUpload}
              postApiFunction={apiService.post}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={false}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
              handlePreview={handlePreview}
            />
          </>
        ) : (
          <BaseTabs tabPanes={tabPanes} />
        )}
        {!clickedItem && previewDetails && previewDetails.length > 0 && (
          <div className="px-6 bg-gray-100 min-h-[600px] max-h-[600px] h-[200px]">
            <AgGridReact
              columnDefs={previewColdefs}
              rowData={previewDetails}
              pagination={false}
              domLayout="normal"
              alwaysShowHorizontalScroll={true}
              onGridReady={(params) => {
                // onGridReady(params);
              }}
              animateRows={true}
              rowSelection="multiple"
              className="custom-grid ag-theme-quartz"
            />
          </div>
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
