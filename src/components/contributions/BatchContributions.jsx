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
import { Button, Dialog, Divider, IconButton } from '@mui/material';
import { ArrowBack, Close, IosShare, Launch } from '@mui/icons-material';
import ContirbutionsActions from './ContirbutionsActions';
import { message } from 'antd';
import BaseApprovalCard from '../baseComponents/BaseApprovalCard';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { BASE_CORE_API } from '@/utils/constants';
import axios from 'axios';
const BatchContributions = ({ status }) => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [openContirbutionsActions, setOpenContirbutionsActions] =
    useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [openApprove, setOpenApprove] = useState(0);
  const [workFlowChange, setWorkFlowChange] = useState(0);

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      periodReference: item.periodReference,
      description: item.description,
      contributionTypeId: item.contributionTypeId,

      ...item,
    }));
  };

  const generateMembersTemplate = async () => {
    const token = localStorage.getItem('token'); // Replace 'token' with the actual key used in your app

    try {
      // Fetch the file as a blob
      const response = await axios.get(
        `${BASE_CORE_API}api/Contribution/GetContributionUploadTemplate`,
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
      link.setAttribute('download', 'Contribution Upload Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error('Error downloading te file:', error);
    }
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },
          edit: () => console.log('Edit clicked'),
          delete: () => console.log('Delete clicked'),
          reports: () => console.log('Reports clicked'),
          notify: () => console.log('Notify clicked'),

          submitContributionsForApproval: () =>
            setOpenContirbutionsActions(true),
          generateContributionUploadTemplate: () => {
            generateMembersTemplate();
          },
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const baseCardHandlers = {
    ...(clickedItem && status === 2
      ? {
          createPaymentVoucher: async () => {
            if (!clickedItem) {
              message.warning(
                'Please select a batch to create a payment voucher.'
              );
              return;
            }

            try {
              // Prepare the payload
              const payload = {
                contributionBatchId:
                  clickedItem?.contributions[0]?.contributionBatchId, // Use the selected batch's ID
                contributionTypeId:
                  clickedItem?.contributions[0]?.contributionTypeId, // Use the selected batch's contribution type ID
              };

              // Send the API request
              const response = await apiService.post(
                financeEndpoints.createContributionPv, // Replace with the correct endpoint
                payload
              );

              // Handle the response
              if (response.status === 200 && response.data.succeeded) {
                setOpenBaseCard(false); // Close the card
                message.success('Payment voucher created successfully.');
                // Optionally refresh data or perform other actions
              } else if (response.status === 200 && !response.data.succeeded) {
                message.error(
                  response.data.messages[0] ||
                    'Failed to create payment voucher.'
                );
              } else {
                message.error(
                  'An error occurred while creating the payment voucher.'
                );
              }
            } catch (error) {
              console.error('Error creating payment voucher:', error);
              message.error(
                'An error occurred while creating the payment voucher.'
              );
            }
          },
        }
      : {}),
    ...(status === 0
      ? {
          create: () => {
            setOpenBaseCard(true);
            setClickedItem(null);
          },
          edit: () => console.log('Edit clicked'),
          delete: () => console.log('Delete clicked'),
          reports: () => console.log('Reports clicked'),
          notify: () => console.log('Notify clicked'),

          submitContributionsForApproval: () =>
            setOpenContirbutionsActions(true),
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
    ...(!clickedItem && {
      generateContributionUploadTemplate: () => {
        generateMembersTemplate();
      },
    }),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);

  const [gridApi, setGridApi] = React.useState(null);
  const gridApiRef = useRef(null);

  const title = clickedItem
    ? 'Batch - ' + clickedItem?.description
    : 'Create Batch Contribution';

  const [vendorPG, setVendorPG] = React.useState([]);
  const [contributionTypes, setContributionTypes] = React.useState([]);
  const [contributionBatch, setContributionBatch] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

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

  const { data: months } = useFetchAsync(
    financeEndpoints.getMonths,
    apiService
  );

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
      name: 'monthId',
      label: 'Month',
      type: 'autocomplete',
      options:
        months &&
        months.map((item) => ({
          id: item.id,
          name: item.description,
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
    //  $$$
    //  $$
    //  $
    // $
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
        /**    Cont_Open,
        Cont_Pending_Approval,
        Cont_Approved,
        Cont_Rejected,
        Cont_Pv_Created,
        Cont_paid, */
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Approved' },
        { id: 2, name: 'Posted' },
        { id: 3, name: 'Reversed' },
        { id: 4, name: 'Pv Created' },
        { id: 5, name: 'Paid' },
      ],
      required: true,
      disabled: true,
    },
  ];

  const notificationStatusMap = {
    /**  /**    Cont_Open,
        Cont_Pending_Approval,
        Cont_Approved,
        Cont_Rejected,
        Cont_Pv_Created,
        Cont_paid,  */
    0: { name: 'New', color: '#f39c12' }, // Light Red
    1: { name: 'Pending Approval', color: '#49D907' }, // Bright Orange
    2: { name: 'Approved', color: '#3498db' }, // Light Blue
    3: { name: 'Rejected', color: '#970FF2' }, // Amethyst
    4: { name: 'PV Created', color: '#970FF2' }, // Carrot Orange
    5: { name: 'Paid Contributions', color: '#1abc9c' }, // Light Turquoise
    6: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
    7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
  };

  const columnDefs = [
    {
      field: 'documentNo',
      headerName: 'Document No',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'periodNarration',
      headerName: 'Period',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,

      valueFormatter: (params) => {
        return params.value ? params.value : '';
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

  const [refreshData, setRefreshData] = useState(12);

  const handleSubmitBatchForApproval = async () => {
    selectedRows.forEach(async (row) => {
      try {
        const response = await apiService.post(
          financeEndpoints.submitBatchForApproval,
          { contributionBatchId: row.id }
        );
        if (response.status === 200 && response.data.succeeded) {
          message.success('Contributions submitted for approval successfully');
          fetchContributionBatches();
          setOpenContirbutionsActions(false);
          setRefreshData((prev) => prev + 1);
        } else {
          message.error('Failed to submit contributions for approval');
        }
      } catch (error) {
        message.error('Failed to submit contributions for approval');
        console.log(error);
      }
    });
  };

  const [openPreview, setOpenPreview] = useState(false);

  const formData = new FormData();

  const handlePreview = async (file) => {
    console.log('Preview clicked');

    try {
      const res = await apiService.post(
        financeEndpoints.previewMemberDetails,
        formData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            minWidth: '70vw',
            height: 'auto',
            minHeight: '75vh',
            position: 'relative',
          },
        }}
        open={openContirbutionsActions && selectedRows.length > 0}
        onClose={() => setOpenContirbutionsActions(false)}
      >
        <div className="pt-10 px-5 overflow-y-auto h-[70vh] flex flex-col gap-2">
          <div className={`flex items-center gap-1`}>
            <IconButton
              sx={{
                border: '1px solid #006990',
                borderRadius: '50%',
                padding: '3px',
                marginRight: '10px',
                color: '#006990',
              }}
              onClick={() => setOpenContirbutionsActions(false)}
            >
              <ArrowBack sx={{ color: '#006990' }} />
            </IconButton>
            <p className="text-lg text-primary font-semibold">
              Batch Contributions to be Submitted for Approval
            </p>
          </div>
          <IconButton
            onClick={() => setOpenContirbutionsActions(false)}
            sx={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              color: 'primary',
            }}
          >
            <Close
              sx={{
                color: 'primary.main',
              }}
            />
          </IconButton>

          <Button
            variant="text"
            onClick={handleSubmitBatchForApproval}
            startIcon={<IosShare />}
            sx={{
              fontSize: '14px',
              fontWeight: 'semibold',
              textTransform: 'none',
              alignItems: 'start',

              mt: 2,
              width: '320px',
            }}
          >
            Send Contributions for Approval
          </Button>
          <Divider className="mb-2" />
          {selectedRows &&
            selectedRows.length > 0 &&
            selectedRows.map((row, index) => (
              <div key={index} className="mb-4  pt-4 px-4">
                <h3 className="text-[15px]  italic font-semibold mb-4 text-primary">{`Contributions for ${row.description}`}</h3>
                <div className="ag-theme-quartz min-h-[200px] max-h-[400px] h-[200px] gap-3">
                  <AgGridReact
                    columnDefs={membersColumnDefs}
                    rowData={row.contributions || []}
                    pagination={false}
                    domLayout="autoheight"
                    alwaysShowHorizontalScroll={true}
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit();
                      onGridReady(params);
                    }}
                    noRowsOverlayComponent={BaseEmptyComponent}
                    rowSelection="multiple"
                    className="custom-grid ag-theme-quartz"
                  />
                </div>
                <Divider className="py-4" />
              </div>
            ))}
        </div>
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <>
            <BaseTabs tabPanes={tabPanes} />
          </>
        ) : (
          <BaseInputCard
            handlePreview={handlePreview}
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
        refreshData={refreshData}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getContributionBatchesByStatus(
          status
        )}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Contributions"
        currentTitle="Contributions"
        onSelectionChange={(selectedRows) => {
          setSelectedRows(selectedRows);
        }}
        openApproveDialog={openApprove}
      />
    </div>
  );
};

export default BatchContributions;
