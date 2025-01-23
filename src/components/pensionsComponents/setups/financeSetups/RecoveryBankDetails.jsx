'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import { name } from 'dayjs/locale/en-au';
import endpoints from '@/components/services/setupsApi';
import { apiService as setupsApiService } from '@/components/services/setupsApi';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const RecoveryBankDetails = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    if (clickedItem) {
      setSelectedBank(clickedItem.bank_id);
    }
  }, [clickedItem]);

  const { data } = useFetchAsync(
    financeEndpoints.getRecoveryDeductions,
    apiService
  );
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: 'deductionsAndRefundId',
      headerName: 'Deductions And Refund Id',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const item = data.find((item) => item.id === params.value);
        return item?.itemName;
      },
    },
    {
      field: 'bankAccountName',
      headerName: 'Bank Account Name',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'bankAccountNo',
      headerName: 'Bank Account No',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'bankBranchId',
      headerName: 'Bank Branch Id',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const branch = branches.find((branch) => branch.id === params.value);
        return branch?.name;
      },
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,

      deductionsAndRefundId: item.deductionsAndRefundId,
      bankAccountName: item.bankAccountName,
      bankAccountNo: item.bankAccountNo,
      bankBranchId: item.bankBranchId,
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

  const title = clickedItem
    ? 'Recovery Bank Details'
    : 'Create New Recovery Bank Details';

  const fields = [
    /**{
  "deductionsAndRefundId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "bankAccountName": "string",
  "bankAccountNo": "string",
  "bankBranchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
} */
    {
      name: 'deductionsAndRefundId',
      label: 'Deductions And Refund Id',
      type: 'select',
      options:
        data &&
        Array.isArray(data) &&
        data.map((item) => ({
          id: item.id,
          name: item.itemName,
        })),
    },

    {
      name: 'bank_id',
      label: 'Bank',
      type: 'autocomplete',
      options: banks,
    },
    {
      name: 'bankBranchId',
      label: 'Bank Branch Id',
      type: 'select',
      options: branches.filter((branch) => branch.bankId === selectedBank),
    },
    {
      name: 'bankAccountName',
      label: 'Bank Account Name',
      type: 'text',
    },
    {
      name: 'bankAccountNo',
      label: 'Bank Account No',
      type: 'text',
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
        deleteApiEndpoint={financeEndpoints.deleteRecoveryBankDetails(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateRecoveryBankDetails}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            setSelectedBank={setSelectedBank}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addRecoveryBankDetails}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            setSelectedBank={setSelectedBank}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getRecoveryBankDetails}
        deleteApiEndpoint={financeEndpoints.deleteRecoveryBankDetails(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Recovery Bank Details"
        currentTitle="Recovery Bank Details"
      />
    </div>
  );
};

export default RecoveryBankDetails;
