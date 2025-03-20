'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import BaseDrilldown from '@/components/baseComponents/BaseDrilldown';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const ReceiptPostingGroup = () => {
  const { data } = useFetchAsync(financeEndpoints.getReceiptType, apiService);
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const columnDefs = [
    {
      field: 'no',
      headerName: 'No',
      headerClass: 'prefix-header',
      width: 90,
      filter: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'receiptTypeName',
      headerName: 'Receipt Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'crAccountName',
      headerName: 'CR Account',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'drAccountName',
      headerName: 'DR Account',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  const [glAccounts, setGlAccounts] = React.useState([]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getGLAccountsAccounttype(0),
        {
          'paging.pageSize': 150,
        }
      );

      setGlAccounts(
        response.data.data.map((account) => ({
          id: account.id,
          name: account.accountNo,
          accountNo: account.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const [bankAcc, setBankAcc] = React.useState([]);

  const fetchGlAccounts2 = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getGLAccountsAccounttype(3),
        {
          'paging.pageSize': 150,
        }
      );

      // const accounts = response.data.data.filter(
      //   (acc) => acc.accountTypeName === 'POSTING'
      // );

      setBankAcc(
        response.data.data.map((account) => ({
          id: account.id,
          name: account.accountNo,
          accountNo: account.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts2();
    fetchGlAccounts();
  }, []);
  const getAccountName = (id) => {
    const account =
      Array.isArray(glAccounts) && glAccounts.find((acc) => acc.id === id);
    return account ? account.name : '';
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
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

    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },

    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Receipt Posting Group'
    : 'Create New Receipt Posting Group';

  const fields = [
    { name: 'description', label: 'Description', type: 'text', required: true },

    {
      name: 'receiptTypeId',
      label: 'Receipt Type',
      type: 'select',
      required: true,
      options:
        data && Array.isArray(data)
          ? data.map((item) => ({ id: item.id, name: item.receiptTypeName }))
          : [],
    },
    {
      name: 'crAccountId',
      label: 'CR Account',
      type: 'select',
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: 'drAccountId',
      label: 'DR Account',
      type: 'select',
      required: true,
      options: bankAcc,
      table: true,
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteReceiptPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <>
            {' '}
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.updateReceiptPostingGroup}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />{' '}
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addReceiptPostingGroup}
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
        fetchApiEndpoint={financeEndpoints.getReceiptPostingGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Receipt Posting Groups"
        currentTitle="Receipt Posting Groups"
      />
    </div>
  );
};

export default ReceiptPostingGroup;
