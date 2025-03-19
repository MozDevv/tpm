'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { dateFormatter, formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import BaseSecondaryTable from '@/components/baseComponents/BaseSecondaryTable';
import BaseSecondaryCard from '@/components/baseComponents/BaseSecondaryCard';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { message } from 'antd';

const columnDefs = [
  {
    field: 'receiptCode',
    headerName: 'Receipt Code',
    filter: true,
    flex: 1,
    pinned: 'left',
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    field: 'generatedDate',
    headerName: 'Generated Date',
    filter: true,
    flex: 1,
    valueFormatter: (params) => dateFormatter(params.value),
  },
  {
    field: 'fromNumber',
    headerName: 'From Number',
    filter: true,
    flex: 1,
  },
  {
    field: 'toNumber',
    headerName: 'To Number',
    filter: true,
    flex: 1,
  },
];

const RecieptGenerator = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [openSubGroup, setOpenSubGroup] = React.useState(false);
  const [clickedSubGroup, setClickedSubGroup] = React.useState(null);
  const [postedData, setPostedData] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.receiptCode || 'Receipt Generation'
    : 'Generate New Receipt ';

  const fields = [
    {
      name: 'fromNumber',
      label: 'From Number',
      type: 'number',
    },
    {
      name: 'toNumber',
      label: 'To Number',
      type: 'number',
      required: true,
    },
  ];

  const subgroupFields = [
    {
      value: 'receiptNo',
      label: 'Receipt No',
      type: 'number',
    },

    {
      value: 'receiptCode',
      label: 'Receipt Code',
      type: 'number',
    },
    { value: 'isUsed', label: 'Is Used', type: 'checkbox' },
  ];
  useEffect(() => {
    if (postedData) {
      setClickedItem({
        ...clickedItem,
        subGroups: [postedData, ...clickedItem?.subGroups],
      });
    }
  }, [postedData]);

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
          <div className="">
            <BaseInputCard
              fields={fields.map((item) => ({ ...item, disabled: true }))}
              apiEndpoint={financeEndpoints.generateReceiptNo}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
            <div className="max-h-[450px] overflow-y-auto px-2">
              <BaseInputTable
                title="Receipt Lines"
                fields={subgroupFields}
                id={clickedItem?.id}
                idLabel="accountingPeriodId"
                getApiService={apiService.get}
                postApiService={apiService.post}
                putApiService={apiService.post}
                getEndpoint={financeEndpoints.getGeneratedReceiptLines(
                  clickedItem?.id
                )}
                deleteApiService={apiService.delete}
                apiService={apiService}
                deleteEndpoint={financeEndpoints.deleteAccountingPeriodLines}
                postEndpoint={financeEndpoints.addAccountingPeriodLines}
                putEndpoint={financeEndpoints.updateAccountingPeriodLines}
                passProspectivePensionerId={true}
                disableAll={true}
                refreshFetch={clickedItem}
                scrollable={true}
              />
            </div>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.generateReceiptNo}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            // setOpenBaseCard={setOpenBaseCard}
            setClickedItem={setClickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getGeneratedReceiptHeaders}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Recept Generation"
        currentTitle="Recept Generation"
        openSubGroup={openSubGroup}
      />
    </div>
  );
};

export default RecieptGenerator;
