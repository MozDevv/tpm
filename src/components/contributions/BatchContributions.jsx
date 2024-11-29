'use client';
import React, { useEffect, useRef, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';
import financeEndpoints from '@/components/services/financeApi';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import BaseInputCard from '../baseComponents/BaseInputCard';
import generateExcelTemplate from '@/utils/excelHelper';
import endpoints from '../services/setupsApi';
import { apiService as setupsApiService } from '../services/setupsApi';
import BaseTabs from '../baseComponents/BaseTabs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import BaseEmptyComponent from '../baseComponents/BaseEmptyComponent';
import ListNavigation from '../baseComponents/ListNavigation';
import { Button } from '@mui/material';
import { Launch } from '@mui/icons-material';
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

      ...item,
      // roles: item.roles,
    }));
  };

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
  const [gridApi, setGridApi] = React.useState(null);
  const gridApiRef = useRef(null);

  const title = clickedItem
    ? 'Batch - ' + clickedItem?.description
    : 'Create Batch Contribution';

  const [vendorPG, setVendorPG] = React.useState([]);
  const [contributionTypes, setContributionTypes] = React.useState([]);
  const [contributionBatch, setContributionBatch] = React.useState([]);

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
    fetchContributionBatches();
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

  const fetchedFields = [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'periodReference',
      label: 'Period Reference',
      type: 'date',
      required: true,
      disabled: true,
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
      disabled: true,
    },

    {
      name: 'noOfStaff',
      label: 'No Of Staff',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'batchTotal',
      label: 'Batch Total',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'totalNewEntrants',
      label: 'Total New Entrants',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'totalDormant',
      label: 'Total Dormant',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'totalExitedMembers',
      label: 'Total Exited Members',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'batchStatus',
      label: 'Batch Status',
      type: 'select',
      options: [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Approved' },
        { id: 2, name: 'Posted' },
        { id: 3, name: 'Reversed' },
      ],
      required: true,
      disabled: true,
    },
  ];

  const notificationStatusMap = {
    0: { name: 'Pending', color: '#f39c12' }, // Light Red
    1: { name: 'Approved', color: '#49D907' }, // Bright Orange
    2: { name: 'Posted', color: '#3498db' }, // Light Blue
    3: { name: 'Reversed', color: '#970FF2' }, // Amethyst
    4: { name: 'IN REVIEW', color: '#970FF2' }, // Carrot Orange
    5: { name: 'PENDING APPROVAL', color: '#1abc9c' }, // Light Turquoise
    6: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
    7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
  };

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
      field: 'noOfStaff',
      headerName: 'No Of Staff',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'batchTotal',
      headerName: 'Batch Total',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'batchStatus',
      headerName: 'Batch Status',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        const status = notificationStatusMap[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 3,
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
      field: 'contributionTypeId',
      headerName: 'Contribution Type',
      headerClass: 'prefix-header',
      flex: 1,
      valueFormatter: (params) => {
        if (contributionTypes && contributionTypes.length > 0) {
          const contributionType = contributionTypes.find(
            (item) => item.id === params.value
          );
          return contributionType
            ? contributionType.contributionTypeName
            : 'N/A';
        }
        return 'N/A';
      },
    },

    {
      field: 'totalNewEntrants',
      headerName: 'Total New Entrants',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'totalDormant',
      headerName: 'Total Dormant',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'totalExitedMembers',
      headerName: 'Total Exited Members',
      headerClass: 'prefix-header',
      flex: 1,
    },
  ];

  const membersColumnDefs = [
    {
      field: 'no',
      headerName: 'No',
      headerClass: 'prefix-header',
      width: 90,
      filter: true,
      valueGetter: 'node.rowIndex + 1',
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
        return params.value ? parseDate(params.value) : '';
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

  const exportData = () => {
    gridApi.exportDataAsCsv({
      fileName: `members.csv`, // Set the desired file name here
    });
  };

  const tabPanes = [
    {
      key: '1',
      title: 'Batch Information',
      content: (
        <div>
          <BaseAutoSaveInputCard
            fields={fetchedFields}
            apiEndpoint={financeEndpoints.uploadContributions}
            getApiEndpoint={financeEndpoints.getContributionBatches}
            getApiService={apiService.get}
            postApiFunction={apiService.post}
            useRequestBody={false}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
            refreshData={false}
          />
        </div>
      ),
    },
    {
      key: '2',
      title: 'Batch Contributions',
      content: (
        <div className="ag-theme-quartz min-h-[600px] max-h-[600px] h-[200px]  gap-3">
          <Button
            variant="text"
            onClick={exportData}
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
            columnDefs={membersColumnDefs}
            rowData={clickedItem?.contributions || []}
            pagination={false}
            domLayout="normal"
            alwaysShowHorizontalScroll={true}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
              onGridReady(params);
            }}
            noRowsOverlayComponent={BaseEmptyComponent}
            rowSelection="multiple"
            className="custom-grid ag-theme-quartz"
            onRowClicked={(e) => {
              console.log('e.data', e.data);
              setClickedRow(e.data);
              setOpenBaseCard(true);
            }}
          />
        </div>
      ),
    },
    //
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

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
        {clickedItem ? (
          <>
            <BaseTabs tabPanes={tabPanes} />
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
        breadcrumbTitle="Contribution Processing"
        currentTitle="Contribution Processing"
      />
    </div>
  );
};

export default BatchContributions;
