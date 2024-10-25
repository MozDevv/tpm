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

const columnDefs = [
  {
    field: 'no',
    headerName: 'No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
  },
  {
    field: 'finYearName',
    headerName: 'Accounting Period Name',
    headerClass: 'prefix-header',
    filter: true,
    width: 250,
  },
  {
    field: 'fromDate',
    headerName: 'From Date',
    headerClass: 'prefix-header',
    valueFormatter: (params) => dateFormatter(params.value),
    filter: true,
    width: 250,
  },

  {
    field: 'toDate',
    headerName: 'To Date',
    headerClass: 'prefix-header',
    valueFormatter: (params) => dateFormatter(params.value),
    filter: true,
    width: 250,
  },
  {
    field: 'isClosed',
    headerName: 'Is Closed',
    headerClass: 'prefix-header',
    filter: true,
    width: 100,
  },
];

const AccountingPeriod = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      toDate: item.toDate,
      fromDate: item.fromDate,
      finYearName: item.finYearName,
      isClosed: item.isClosed,
      subGroups: item.accountingPeriodLines.map((subgroup) => ({
        id: subgroup.id,
        startDate: subgroup.startDate,
        monthName: subgroup.monthName,
        description: subgroup.description,
        isDateLocked: subgroup.isDateLocked,
        isInventoryPeriodClosed: subgroup.isInventoryPeriodClosed,
      })),
    }));
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
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [openSubGroup, setOpenSubGroup] = React.useState(false);
  const [clickedSubGroup, setClickedSubGroup] = React.useState(null);
  const [postedData, setPostedData] = React.useState(null);

  const title = clickedItem
    ? 'Accounting Period'
    : 'Create New Accounting Period';

  const fields = [
    {
      name: 'finYearName',
      label: 'Accounting Period Name',
      type: 'text',
      required: true,
    },
    {
      name: 'fromDate',
      label: 'From Date',
      type: 'date',
      required: true,
    },
    {
      name: 'toDate',
      label: 'To Date',
      type: 'date',
      required: true,
    },
    {
      name: 'isClosed',
      label: 'Is Closed',
      type: 'switch',
      required: true,
    },
  ];
  const subGroupColumnDefs = [
    {
      field: 'startDate',
      headerName: 'Start Date',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => dateFormatter(params.value),
    },
    {
      field: 'monthName',
      headerName: 'Month Name',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'isDateLocked',
      headerName: 'Is Date Locked',
      headerClass: 'prefix-header',
      filter: true,
    },
    // {
    //   field: "isInventoryPeriodClosed",
    //   headerName: "Is Inventory Period Closed",
    //   headerClass: "prefix-header",
    //   filter: true,
    // },
  ];

  const subgroupFields = [
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'monthName', label: 'Month Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    {
      name: 'isDateLocked',
      label: 'Is Date Locked',
      type: 'switch',
      required: true,
    },
    // {
    //   name: "isInventoryPeriodClosed",
    //   label: "Is Inventory Period Closed",
    //   type: "switch",
    //   required: true,
    // },
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
      <BaseSecondaryCard
        openBaseCard={openSubGroup}
        setOpenBaseCard={setOpenSubGroup}
        title={
          clickedSubGroup
            ? 'Edit Accounting Period'
            : 'Create New Accounting Period'
        }
        clickedItem={clickedSubGroup}
        deleteApiEndpoint={financeEndpoints.deleteAccountingPeriodLines(
          clickedSubGroup?.id
        )}
        deleteApiService={apiService.delete}
        fields={subgroupFields}
        updateEndpoint={financeEndpoints.updateAccountingPeriodLines}
        createEndpoint={financeEndpoints.addAccountingPeriodLines}
        postApiFunction={apiService.post}
        setPostedData={setPostedData}
        id={clickedItem?.id}
        idLabel="accountingPeriodId"
        isBranch={true}
        setClickedItem={setClickedSubGroup}
      />
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteAccountingPeriod(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <div className="">
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.updateAccountingPeriod}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
            <BaseSecondaryTable
              columnDefs={subGroupColumnDefs}
              rowData={clickedItem?.subGroups}
              onRowClicked={(e) => {
                console.log('Row clicked', e.data);
                setClickedSubGroup(e.data);
                setOpenSubGroup(true);
              }}
              handleButtonClick={() => {
                setOpenSubGroup(true);
                setClickedSubGroup(null);
              }}
              title={'Accounting Period Lines'}
            />
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addAccountingPeriod}
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
        fetchApiEndpoint={financeEndpoints.getAccountingPeriods}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Accounting Period"
        currentTitle="Accounting Period"
        openSubGroup={openSubGroup}
      />
    </div>
  );
};

export default AccountingPeriod;
