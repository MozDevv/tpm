import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import AssessmentCard from '@/components/assessment/assessmentDataCapture/AssessmentCard';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { useSelectedSegmentStore } from '@/zustand/store';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';

const SuspensionsResumptions = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const { selectedSegment, setSelectedSegment } = useSelectedSegmentStore();

  const columnDefs = [
    {
      field: 'documentNo',
      headerName: 'Document No',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
      pinned: 'left', // Pinning to the left ensures it's the first column
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'claim_no',
      headerName: 'Claim No',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'stageName',
      headerName: 'Stage Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'request_type_name',
      headerName: 'Request Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'is_resumed',
      headerName: 'Is Resumed',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'created_date',
      headerName: 'Created Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'created_by',
      headerName: 'Created By',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];
  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
      documentNo: item.document_no,
    }));
  };

  const [workFlowChange, setWorkFlowChange] = React.useState(null);
  const [openApprove, setOpenApprove] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(selectedSegment === 0
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
    ...(selectedSegment === 0
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

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? clickedItem?.claim_no : 'Create New Department';

  const fields = [
    {
      name: 'document_no',
      label: 'Document No',
      type: 'text',
      required: true,
      disabled: true,
    },

    {
      name: 'stageName',
      label: 'Stage Name',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'request_type_name',
      label: 'Request Type Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'is_resumed',
      label: 'Is Resumed',
      type: 'switch',
      disabled: true,
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'textarea',
      disabled: true,
    },
    {
      name: 'created_date',
      label: 'Created Date',
      type: 'dateTimePicker',
      disabled: true,
    },
    {
      name: 'created_by',
      label: 'Created By',
      type: 'text',
      required: true,
      disabled: true,
    },
  ];

  const [claim, setClaim] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const fetchClaimById = async (id) => {
    setLoading(true);
    try {
      const res = await apiService.get(endpoints.getClaimById(id));
      if (res.status == 200) {
        setClaim(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openBaseCard && clickedItem) {
      fetchClaimById(clickedItem.claim_id);
    }
  }, [openBaseCard]);
  return (
    <div className="">
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        onClose={() => setLoading(false)}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div">
          Fetching User Details
          <Box component="span" sx={{ animation: 'blink 1.4s infinite' }}>
            ...
          </Box>
        </Typography>
      </Backdrop>

      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.returnDocumentNo)
            : clickedItem
            ? [clickedItem.returnDocumentNo]
            : []
        }
      />
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {claim ? (
          <AssessmentCard
            claim={
              claim
                ? {
                    ...claim,
                    id_claim: claim?.id,
                    prospectivePensionerId: claim?.prospective_pensioner_id,
                  }
                : null
            }
            isPayroll={true}
            clickedItem={
              claim?.prospectivePensioner
                ? {
                    ...claim.prospectivePensioner,
                    id_claim: claim.id,
                    igc_beneficiary_track: claim?.igc_beneficiary_track,
                  }
                : null
            }
            // clickedIgc={clickedItem}
            childTitle="Request Details"
            claimId={claim?.id}
            setOpenBaseCard={setOpenBaseCard}
          >
            <BaseInputCard
              fields={fields}
              // apiEndpoint={endpoints.createDepartment}
              // postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
          </AssessmentCard>
        ) : (
          <BaseInputCard
            fields={fields}
            // apiEndpoint={endpoints.createDepartment}
            // postApiFunction={apiService.post}
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
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        fetchApiEndpoint={endpoints.getClaimSuspensionOrResumptionRequest}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Claims Suspension/Resumption Requests"
        currentTitle="Claims Suspension/Resumption Requests"
        segmentFilterParameter2="stage"
        segmentOptions2={[
          { value: 0, label: 'Pending Approval' },
          { value: 1, label: 'Approved Requests' },
        ]}
      />
    </div>
  );
};

export default SuspensionsResumptions;
