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

import endpoints from '../services/setupsApi';
import { apiService as setupsApiService } from '../services/setupsApi';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Button, Dialog, IconButton, Tooltip } from '@mui/material';
import BaseTabs from '../baseComponents/BaseTabs';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { BASE_CORE_API } from '@/utils/constants';
import { generateErrorTooltip } from '../baseComponents/generateErrorTooltip';
import {
  AccessTime,
  Cancel,
  Close,
  HighlightOff,
  Verified,
  Visibility,
} from '@mui/icons-material';
import { Alert, message } from 'antd';
import BatchActions from './BatchActions';
import BaseSubmitForApproval from './BatchActions';
import useFetchAsync from '../hooks/DynamicFetchHook';

const BatchUploadMembers = ({ status }) => {
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
      members: item.members,
      batchUploadStatus: item.batchUploadStatus,

      // roles: item.roles,
    }));
  };

  const [uploadExcel, setUploadExcel] = React.useState(false);
  const [sponsors, setSponsors] = React.useState([]);

  const generateMembersTemplate = async () => {
    const token = localStorage.getItem('token'); // Replace 'token' with the actual key used in your app

    try {
      // Fetch the file as a blob
      const response = await axios.get(
        `${BASE_CORE_API}api/Contribution/DownloadMemberTemplate`,
        {
          responseType: 'blob', // Specify that the response is a binary Blob
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Member Upload Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error('Error downloading te file:', error);
    }
  };

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openPV, setOpenPV] = React.useState(false);

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
    ...(status === 0 && {
      submitPaymentForApproval: () => {
        setSelectedRows([clickedItem]);
        setOpenPV(true);
        console.log('Submit Payment For Approval');
      },
    }),
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
    ...(status === 0 && {
      submitPaymentForApproval: () => {
        setSelectedRows([clickedItem]);
        setOpenPV(true);
        console.log('Submit Payment For Approval');
      },
    }),
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
  const { data: contributionTypes } = useFetchAsync(
    financeEndpoints.getContributionType,
    apiService
  );

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
    {
      name: 'memberTypeId',
      label: 'Member Type',
      type: 'select',
      options:
        contributionTypes &&
        contributionTypes.map((item) => ({
          id: item.id,
          name: item.contributionTypeName,
        })),
      required: true,
    },
  ];
  const statusIcons = {
    /**  {
          {
        Mem_New,
        Mem_Pending,
        Mem_Approved,
        Mem_Rejected,
    }
      } */
    0: { icon: Visibility, name: 'New', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };

  const columnDefs = [
    {
      field: 'batchNo',
      headerName: 'Batch No',
      headerClass: 'prefix-header',
      flex: 1,

      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },

    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'batchUploadStatus',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '20px',
            }}
          >
            <IconComponent
              style={{
                color: status.color,
                marginRight: '6px',
                fontSize: '17px',
              }}
            />
            <span
              style={{
                color: status.color,
                fontWeight: 'semibold',
                fontSize: '13px',
              }}
            >
              {status.name}
            </span>
          </div>
        );
      },
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
    //add memberTypeId
    {
      field: 'memberTypeId',
      headerName: 'Member Type',
      headerClass: 'prefix-header',
      flex: 1,
      valueFormatter: (params) => {
        return params.value
          ? contributionTypes.find((item) => item.id === params.value)
              ?.contributionTypeName
          : '';
      },
    },
  ];

  const selectedHeaders = [
    // { label: 'ID', field: 'id', align: 'left' },
    { label: 'Batch No', field: 'batchNo', align: 'left' },
    { label: 'Description', field: 'description', align: 'left' },
    { label: 'Upload Date', field: 'uploadDate', align: 'left' },
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
        if (
          res.data.data.some(
            (detail) => Object.keys(detail.errorMessage).length > 0
          )
        ) {
          message.error('Some records have errors. Please upload a valid file');
          setPreviewDetails(res.data.data);
          console.log('Preview data:', res.data.data);
        } else {
          message.success('Preview successful');
          setPreviewDetails(res.data.data);
        }
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
      field: 'no',
      headerName: 'No',
      headerClass: 'prefix-header',
      width: 100,
      valueFormatter: (params) => {
        return (params.node.rowIndex + 1).toString(); // Convert to string explicitly
      },
      pinned: 'left',

      cellRenderer: (params) => {
        // Ensure errorMessage exists before accessing it
        const errorMessage = params.data.errorMessage || {};

        const hasError = Object.keys(errorMessage).length > 0;

        if (hasError) {
          const fieldsWithErrors = Object.keys(errorMessage);
          const errorTooltip = `
              <div>
                <strong style="display: block; margin-bottom: 8px; padding-left: 15px;">
                  <span style="font-size: 1.5em;">⚠️</span> Validation Error
                </strong>
                <div style="color: #d9534f;">
                  Error in the following fields: ${fieldsWithErrors.join(', ')}
                </div>
              </div>
            `;

          // If there’s an error, return the tooltip and the value in a styled div
          return (
            <Tooltip
              title={<div dangerouslySetInnerHTML={{ __html: errorTooltip }} />}
              arrow
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    fontSize: '0.875rem',
                    padding: '8px',
                    borderRadius: '8px',
                    maxWidth: '250px',
                    wordWrap: 'break-word',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'opacity 0.3s ease-in-out',
                  },
                  '& .MuiTooltip-arrow': {
                    color: '#f5f5f5',
                  },
                },
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <HighlightOff fontSize="large" sx={{ color: '#d9534f' }} />

                {(params.node.rowIndex + 1).toString()}
              </div>
            </Tooltip>
          );
        }

        return (params.node.rowIndex + 1).toString(); // Return value when no error
      },
    },
    {
      field: 'payrollNumber',
      headerName: 'Payroll Number',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.hasError?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },

    {
      field: 'membershipStatus',
      headerName: 'Membership Status',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },

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
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'pssfNumber',
      headerName: 'PSSF Number',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      headerClass: 'prefix-header',
      width: 100,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('en-GB');
      },
    },
    {
      field: 'sponsorId',
      headerName: 'Sponsor ID',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
      valueFormatter: (params) => {
        return mdas.find((sponsor) => sponsor.id === params.value)?.name;
      },
    },

    {
      field: 'dateOfJoiningScheme',
      headerName: 'Date of Joining Scheme',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'dateOfEmployment',
      headerName: 'Date of Employment',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'dateOfLeaving',
      headerName: 'Date of Leaving',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },
    {
      field: 'emailAdress',
      headerName: 'Email Address',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
    },

    {
      field: 'maritalStatus',
      headerName: 'Marital Status',
      headerClass: 'prefix-header',
      width: 200,
      cellRenderer: (params) => generateErrorTooltip(params),
      cellStyle: (params) => {
        const fieldName = params.colDef.field;
        const capitalizedFieldName =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (params.data.errorMessage?.[capitalizedFieldName]) {
          return {
            border: '2px solid red',
          };
        }

        return {
          fontFamily: 'Montserrat',
          borderRight: '1px solid #f0f0f0',
          fontSize: '13px',
        };
      },
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
            rowData={clickedItem?.members}
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
      ),
    },
    //
  ];
  const handleSelectionChange = (selectedRows) => {
    console.log('Selected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };
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
      <Dialog
        open={openPV && selectedRows.length > 0}
        onClose={() => {
          setOpenPV(false);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
          zIndex: 999999999,
        }}
      >
        <BaseSubmitForApproval
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setOpenPostGL={setOpenPV}
          setOpenBaseCard={setOpenBaseCard}
          clickedItem={clickedItem}
          status={status}
          submitForApprovalEndpoint={financeEndpoints.submitBatchForApproval2}
          selectedHeaders={selectedHeaders}
          apiService={apiService}
        />
      </Dialog>
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
              apiEndpoint={financeEndpoints.uploadMembersExcel}
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
          <div className="">
            {previewDetails.some(
              (detail) => Object.keys(detail.errorMessage).length > 0
            ) && (
              <div className="pb-3">
                <Alert
                  message="Some records have errors. Please upload a valid file"
                  type="error"
                  showIcon
                />
              </div>
            )}
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
          </div>
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        onSelectionChange={handleSelectionChange}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getUploadBatchByStatus(status)}
        fetchApiService={apiService.get}
        transformData={transformData}
        openApproveDialog={openPV}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Batch Member Upload"
        currentTitle="Batch Member Upload"
      />
    </div>
  );
};

export default BatchUploadMembers;
