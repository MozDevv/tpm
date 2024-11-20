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
    {
      value: 'monthName',
      label: 'Month Name',
      type: 'select',
      required: true,
      options: [
        { id: 'January', name: 'January' },
        { id: 'February', name: 'February' },
        { id: 'March', name: 'March' },
        { id: 'April', name: 'April' },
        { id: 'May', name: 'May' },
        { id: 'June', name: 'June' },
        { id: 'July', name: 'July' },
        { id: 'August', name: 'August' },
        { id: 'September', name: 'September' },
        { id: 'October', name: 'October' },
        { id: 'November', name: 'November' },
        { id: 'December', name: 'December' },
      ],
    },
    { value: 'startDate', label: 'Start Date', type: 'date', required: true },
    {
      value: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      value: 'isDateLocked',
      label: 'Is Date Locked',
      type: 'select',
      notRequired: true,
      options: [
        { id: true, name: 'Yes' },
        { id: false, name: 'No' },
      ],
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
            <BaseAutoSaveInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.addAccountingPeriod}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateAccountingPeriod}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.getAccountingPeriods}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
            />
            <div className="max-h-[450px] overflow-y-auto">
              <BaseInputTable
                title="Accounting Period"
                fields={subgroupFields}
                id={clickedItem?.id}
                idLabel="accountingPeriodId"
                getApiService={apiService.get}
                postApiService={apiService.post}
                putApiService={apiService.put}
                getEndpoint={financeEndpoints.getAccountingPeriodById(
                  clickedItem?.id
                )}
                deleteApiService={apiService.delete}
                apiService={apiService}
                deleteEndpoint={financeEndpoints.deleteAccountingPeriodLines}
                postEndpoint={financeEndpoints.addAccountingPeriodLines}
                putEndpoint={financeEndpoints.updateAccountingPeriodLines}
                passProspectivePensionerId={true}
                fetchChildren="accountingPeriodLines"
              />
            </div>
          </div>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addAccountingPeriod}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateAccountingPeriod}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getAccountingPeriodById}
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
