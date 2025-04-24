'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import AssessmentCard from '../payments/PensionerDetailsTabs';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import { apiService as preApiservice } from '@/components/services/preclaimsApi';
import { message } from 'antd';
import {
  useApprovalRefreshStore,
  useSelectedSegmentStore,
} from '@/zustand/store';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';

const columnDefs = [
  {
    field: 'documentNo',
    headerName: 'Document No',
    filter: true,
    flex: 1,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    cellRenderer: (params) => {
      return (
        <div className=" text-primary underline font-semibold">
          {params.value}
        </div>
      );
    },
    pinned: 'left',
  },
  {
    field: 'pensionerNo',
    headerName: 'Pensioner No',
    filter: true,
    flex: 1,
  },

  {
    field: 'pensionerName',
    headerName: 'Pensioner Name',
    filter: true,
    flex: 1,
  },
  {
    field: 'approvalStatus',
    headerName: 'Approval Status',
    filter: true,
    flex: 1,
  },
  {
    field: 'notificationStatus',
    headerName: 'Notification Status',
    filter: true,
    flex: 1,
  },
  {
    field: 'returnReason',
    headerName: 'Return Reason',
    filter: true,
    flex: 1,
  },

  {
    field: 'amount',
    headerName: 'Amount',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <div className="text-right text-primary">
          {formatNumber(params.value)}
        </div>
      );
    },
  },
];

const OldCases = () => {
  const { selectedSegment, setSelectedSegment } = useSelectedSegmentStore();

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [selectedRows, setSelectedRows] = React.useState([]);
  const { setapprovalRefresh } = useApprovalRefreshStore();

  // const []

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      // roles: item.roles,
    }));
  };

  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);
  const [refreshData, setRefreshData] = React.useState(0);
  const handlers = {
    ...((!selectedSegment ||
      selectedSegment === 0 ||
      selectedSegment === undefined) && {
      scheduleForNotification: () => handleScheduleForNotification(),
    }),

    ...(selectedSegment === 1
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

    ...(selectedSegment &&
      selectedSegment === 2 && {
        notifyUser: async () => {
          if (selectedRows.length === 0) {
            message.warning('Please select at least one row to notify.');
            return;
          }

          try {
            // Prepare the payload using selectedRows
            const payload = {
              paymentReturnNotificationDetail: selectedRows.map((row) => ({
                prospectivePensionerId: row.prospectivePensionerId,
                beneficiaryId: row.beneficiaryId || null, // Use null if not available
                reason: row.returnReasonEnum || 0, // Default to 0 if not provided
                returnOwnertType: row.returnOwnertType || 0, // Default to 0 if not provided
              })),
            };

            // Send the API request
            const res = await apiService.post(
              financeEndpoints.notifyUser,
              payload
            );

            // Handle the response
            if (
              res.status === 200 &&
              res.data.succeeded &&
              res.data.messages[0]
            ) {
              setapprovalRefresh(Date.now());

              message.success(res.data.messages[0]);
            } else if (
              res.status === 200 &&
              !res.data.succeeded &&
              res.data.messages[0]
            ) {
              message.error(res.data.messages[0]);
            } else {
              message.error('An error occurred while sending notifications.');
            }
          } catch (error) {
            console.error('Error sending notifications:', error);
            message.error('An error occurred while sending the notifications.');
          }
        },
      }),
  };

  const baseCardHandlers = {
    addReturnToIGC: () => {
      handleReturnToIgc();
    },
    ...(selectedSegment === 2 && {
      notifyUser: async () => {
        try {
          // Prepare the payload using clickedItem details
          const payload = {
            paymentReturnNotificationDetail: [
              {
                prospectivePensionerId: clickedItem?.prospectivePensionerId,
                beneficiaryId: clickedItem?.beneficiaryId || null, // Use null if not available
                reason: clickedItem?.returnReasonEnum || 0, // Default to 0 if not provided
                returnOwnertType: clickedItem?.returnOwnertType || 0, // Default to 0 if not provided
              },
            ],
          };

          // Send the API request
          const res = await apiService.post(
            financeEndpoints.notifyUser,
            payload
          );

          // Handle the response
          if (
            res.status === 200 &&
            res.data.succeeded &&
            res.data.messages[0]
          ) {
            setapprovalRefresh(Date.now());

            message.success(res.data.messages[0]);
          } else if (
            res.status === 200 &&
            !res.data.succeeded &&
            res.data.messages[0]
          ) {
            message.error(res.data.messages[0]);
          } else {
            message.error('An error occurred');
          }
        } catch (error) {
          console.error('Error sending notification:', error);
          message.error('An error occurred while sending the notification.');
        }
      },
    }),
  };

  const handleScheduleForNotification = async () => {
    const requestData =
      selectedRows.length > 0
        ? selectedRows.map((journal) => journal.returnNotificationTrackerId) // Return an array of returnNotificationTrackerId	s
        : clickedItem
        ? [clickedItem.returnNotificationTrackerId] // Wrap the single ID in an array
        : [];

    try {
      const res = await apiService.post(
        financeEndpoints.scheduleForNotification,
        {
          returnNotificationIds: requestData,
        }
      );
      if (res.status === 200 && res.data.succeeded && res.data.messages[0]) {
        setapprovalRefresh(Date.now());
        setRefreshData((prev) => prev + 1);
        message.success(res.data.messages[0]);
      } else if (
        res.status === 200 &&
        !res.data.succeeded &&
        res.data.messages[0]
      ) {
        message.error(
          res.data.messages?.[0] || 'Failed to post receipts to ledger.'
        );
      } else {
        message.error('Error scheduling');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturnToIgc = async () => {
    try {
      const res = await apiService.post(financeEndpoints.addReturnToIGC, {
        pensionerNumber: clickedItem.pensionerNo,
        returnType: clickedItem.returnType,
      });

      if (res.status === 200 && res.data.succeeded) {
        message.success('Return added to IGC successfully');
        // setOpenBaseCard(false);
      } else if (
        res.status === 200 &&
        !res.data.succeeded &&
        res.data.messages[0]
      ) {
        message.error(res.data.messages[0]);
      } else {
        message.error('An error occurred');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.pensionerNo
    : 'Create New Return Detail';

  const fields = [
    {
      name: 'returnType',
      label: 'Return Type',
      type: 'autocomplete',
      disabled: true,
      options: [
        {
          id: 0,
          name: 'None',
        },
        {
          id: 1,
          name: 'Death',
        },
        {
          id: 2,
          name: 'Dormant Account',
        },
        {
          id: 3,
          name: 'Wrong Bank Details',
        },
      ],
    },
    { name: 'pensionerName', label: 'Name', type: 'text', disabled: true },
    {
      name: 'pensionerNo',
      label: 'Pensioner No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'returnReason',
      label: 'Return Reason',
      type: 'text',
      disabled: true,
    },
    { name: 'amount', label: 'Amount', type: 'text', disabled: true },
  ];
  const returnLineFields = [
    {
      value: 'pensionerName',
      label: 'Pensioner Name',
      type: 'text',
      disabled: true,
    },
    {
      value: 'pensionerNo',
      label: 'Pensioner No',
      type: 'text',
      disabled: true,
    },
    {
      value: 'returnReason',
      label: 'Return Reason',
      type: 'text',
      disabled: true,
    },
    {
      value: 'amount',
      label: 'Amount',
      type: 'text',
      disabled: true,
    },
    {
      value: 'returnType',
      label: 'Return Type',
      type: 'select',
      options: [
        {
          id: 0,
          name: 'None',
        },
        {
          id: 1,
          name: 'Death',
        },
        {
          id: 2,
          name: 'Dormant Account',
        },
        {
          id: 3,
          name: 'Wrong Bank Details',
        },
      ],
    },
  ];

  const [retiree, setRetiree] = React.useState(null);
  const [clickedItem2, setClickedItem2] = React.useState(null);

  const [prospectivePensionerId, setProspectivePensionerId] =
    React.useState(null);
  const [claimId, setClaimId] = React.useState(null);

  const fetchRetiree = async (prospectivePensionerId) => {
    try {
      const res = await preApiservice.get(
        preClaimsEndpoints.getProspectivePensioner(prospectivePensionerId)
      );
      if (res.status === 200) {
        setRetiree(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (openBaseCard && clickedItem) {
      const fetchDetailsToGetPensioner = async () => {
        try {
          const res = await apiService.get(
            financeEndpoints.getOldCaseLinesByPensionerNo(
              clickedItem?.pensionerNo
            )
          );
          const details = res.data.data;
          setClickedItem2(details);

          // Check if there is a prospectivePensionerId
          const prospectivePensionerId = details.find(
            (item) => item.prospectivePensionerId
          )?.prospectivePensionerId;

          const claimId = details.find((item) => item.claimId)?.claimId;

          setClaimId(claimId);
          setProspectivePensionerId(prospectivePensionerId);
          if (prospectivePensionerId) {
            await fetchRetiree(prospectivePensionerId);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchDetailsToGetPensioner();
    }
  }, [openBaseCard, clickedItem]);

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
            <AssessmentCard
              claim={{
                ...clickedItem,
                prospectivePensionerId,
                id_claim: claimId,
              }}
              clickedItem={retiree}
              claimId={claimId}
              setOpenBaseCard={setOpenBaseCard}
              isOldCase={true}
            >
              <div className="">
                <BaseInputCard
                  fields={fields}
                  apiEndpoint={financeEndpoints.updateReturnLine}
                  postApiFunction={apiService.post}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                  setOpenBaseCard={setOpenBaseCard}
                />

                <BaseInputTable
                  disableAll={selectedSegment}
                  title="Return Details"
                  fields={returnLineFields}
                  id={clickedItem?.id}
                  idLabel="returnId"
                  getApiService={apiService.get}
                  postApiService={apiService.post}
                  putApiService={apiService.post}
                  getEndpoint={financeEndpoints.getOldCaseLinesByPensionerNo(
                    clickedItem?.pensionerNo
                  )}
                  postEndpoint={financeEndpoints.addReturnLine}
                  putEndpoint={financeEndpoints.updateOldCaseLine}
                  passProspectivePensionerId={true}
                />
              </div>
            </AssessmentCard>
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createDepartment}
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
        fetchApiEndpoint={financeEndpoints.getOldCasesReturnDetails}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Returns"
        currentTitle="Returns"
        segmentFilterParameter="stage"
        // segment2Criterion={0}
        segmentOptions={[
          { value: 0, label: 'New' },
          { value: 1, label: 'Pending Approval' },
          { value: 2, label: 'Pensioner Notified' },
          { value: 3, label: 'Required Details Submitted' },
          { value: 4, label: 'Paid' },
          { value: 5, label: 'Rejected' },
          { value: 6, label: 'Reverted' },
        ]}
        onSelectionChange={(selectedRows) => {
          setSelectedRows(selectedRows);
          console.log('Selected Rows:', selectedRows);
        }}
      />
    </div>
  );
};

export default OldCases;
