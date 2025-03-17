'use client';
import React, { useEffect } from 'react';

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

const columnDefs = [
  {
    field: 'pensionerNo',
    headerName: 'Pensioner No',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <div className=" text-primary underline font-semibold">
          {params.value}
        </div>
      );
    },
  },

  {
    field: 'pensionerName',
    headerName: 'Pensioner Name',
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
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  // const []

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      // roles: item.roles,
    }));
  };

  const handlers = {};

  const baseCardHandlers = {
    addReturnToIGC: () => {
      handleReturnToIgc();
    },
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
              claim={{ ...clickedItem, prospectivePensionerId, claimId }}
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
        breadcrumbTitle="Old Cases"
        currentTitle="Old Cases"
      />
    </div>
  );
};

export default OldCases;
