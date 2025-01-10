'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import { formatNumber } from '@/utils/numberFormatters';

const LedgerEntries = ({ type }) => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const handlers = {
    // create: () => {
    //   setOpenBaseCard(true);
    //   setClickedItem(null);
    // },
    // edit: () => console.log("Edit clicked"),
    // delete: () => console.log("Delete clicked"),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    // create: () => {
    //   setOpenBaseCard(true);
    //   setClickedItem(null);
    // },
    // edit: (item) => {
    //   // setOpenBaseCard(true);
    //   // setClickedItem(item);
    // },
    // delete: (item) => {
    //   //  setOpenBaseCard(true);
    //   //  setClickedItem(item);
    // },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.documentNo
    : 'Create New Legder Entry';

  const getSubLedgerEndpoint = (type) => {
    switch (type) {
      case 'General Ledger Entries':
        return financeEndpoints.glSubLedger;
      case 'Vendor Ledger Entries':
        return financeEndpoints.vendorSubLedger;
      case 'Customer Ledger Entries':
        return financeEndpoints.customerSubLedger;
      case 'Bank Account Ledger Entries':
        return financeEndpoints.bankSubLedger;
      default:
        throw new Error(`Unknown ledger type: ${type}`);
    }
  };

  const getFieldsByType = (type) => {
    switch (type) {
      case 'Vendor Ledger Entries':
      case 'Customer Ledger Entries':
        return [
          {
            name: 'transactionNo',
            label: 'Transaction No',
            type: 'text',
            required: true,
          },
          {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            required: true,
          },
          {
            name: 'externalDocumentNo',
            label: 'External Document No',
            type: 'text',
            required: true,
          },
          {
            name: 'accountId',
            label: 'Account',
            type: 'select',
            required: true,
            options: allOptions,
          },
          {
            name: 'transactionDate',
            label: 'Transaction Date',
            type: 'date',
            required: true,
          },
          { name: 'amount', label: 'Amount', type: 'number', required: true },
          {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
          },
        ];

      case 'Bank Account Ledger Entries':
        return [
          {
            name: 'transactionNo',
            label: 'Transaction No',
            type: 'text',
            required: true,
          },
          {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            required: true,
          },
          {
            name: 'externalDocumentNo',
            label: 'External Document No',
            type: 'text',
            required: true,
          },
          {
            name: 'glBankCode',
            label: 'GL Bank Code',
            type: 'text',
            required: true,
          },
          {
            name: 'glEntryNo',
            label: 'GL Entry No',
            type: 'text',
            required: true,
          },
          {
            name: 'transactionDate',
            label: 'Transaction Date',
            type: 'date',
            required: true,
            disabled: true,
          },
          { name: 'amount', label: 'Amount', type: 'number', required: true },
          {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: true,
          },
        ];

      case 'General Ledger Entries':
        return [
          {
            name: 'transactionNo',
            label: 'Transaction No',
            type: 'text',
            required: true,
          },
          {
            name: 'documentNo',
            label: 'Document No',
            type: 'text',
            required: true,
          },
          {
            name: 'transactionDate',
            label: 'Transaction Date',
            type: 'date',
            required: true,
          },
          { name: 'amount', label: 'Amount', type: 'number', required: true },
          {
            name: 'accountNo',
            label: 'Account No',
            type: 'text',
            required: true,
          },
        ];

      default:
        return [];
    }
  };

  const [allOptions, setAllOptions] = React.useState([]);
  const fetchNewOptions = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getAccounts, {
        'paging.pageSize': 2000,
      }); // Pass accountTypeId to the endpoint
      if (res.status === 200) {
        setAllOptions(
          res.data.data.map((acc) => {
            return {
              id: acc.id,
              name: acc.accountNo,
              accountName: acc.name,
              accountType: acc.accountType,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
      return []; // Return an empty array if an error occurs
    }
  };

  useEffect(() => {
    fetchNewOptions();
  }, []);

  const getAccountName = (no) => {
    const account = allOptions.find((acc) => acc.no === no);
    return account ? account.name : '';
  };

  const getColumnDefsByType = (type) => {
    switch (type) {
      case 'Vendor Ledger Entries':
      case 'Customer Ledger Entries':
        return [
          {
            field: 'documentNo',
            headerName: 'Document No',
            flex: 1,
            filter: true,
            pinned: 'left',
          },
          {
            field: 'transactionNo',
            headerName: 'Transaction No',
            flex: 1,
            filter: true,
          },

          {
            field: 'externalDocumentNo',
            headerName: 'External Document No',
            flex: 1,
            filter: true,
          },
          {
            field: 'accountId',
            headerName: 'Account',
            flex: 1,
            filter: true,
            valueGetter: (params) => {
              const account = allOptions?.find(
                (acc) => acc.id === params.data.accountId
              );
              return account?.name ?? 'N/A';
            },
          },
          {
            field: 'transactionDate',
            headerName: 'Transaction Date',
            flex: 1,
            filter: true,
            valueFormatter: (params) => parseDate(params.value),
          },
          {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            filter: true,
            valueFormatter: (params) => {
              return formatNumber(params.value);
            },
            cellStyle: { textAlign: 'center' },
          },
          {
            field: 'description',
            headerName: 'Description',
            width: 250,
            filter: true,
          },
        ];

      case 'Bank Account Ledger Entries':
        return [
          {
            field: 'documentNo',
            headerName: 'Document No',
            flex: 1,
            filter: true,
            pinned: 'left',
          },

          {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            filter: true,
            valueFormatter: (params) => {
              return formatNumber(params.value);
            },
            cellStyle: { textAlign: 'center' },
          },
          {
            field: 'externalDocumentNo',
            headerName: 'External Document No',
            flex: 1,
            filter: true,
          },
          {
            field: 'transactionNo',
            headerName: 'Transaction No',
            flex: 1,
            filter: true,
          },
          {
            field: 'glEntryNo',
            headerName: 'GL Entry No',
            flex: 1,
            filter: true,
          },
          {
            field: 'glBankCode',
            headerName: 'GL Bank Code',
            flex: 1,
            filter: true,
          },

          {
            field: 'transactionDate',
            headerName: 'Transaction Date',
            flex: 1,
            filter: true,
            valueFormatter: (params) => parseDate(params.value),
          },

          {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            filter: true,
          },
        ];

      case 'General Ledger Entries':
        return [
          {
            field: 'documentNo',
            headerName: 'Document No',
            flex: 1,
            filter: true,
            pinned: 'left',
          },
          {
            field: 'accountNo',
            headerName: 'Account No',
            flex: 1,
            filter: true,
          },
          {
            field: 'accountName',
            headerName: 'Account Name',
            flex: 1,
            filter: true,
            valueFormatter: (params) => {
              const account = allOptions?.find(
                (acc) => acc.name === params.data.accountNo
              );
              return account?.accountName ?? 'N/A';
            },
          },
          {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            filter: true,
            valueFormatter: (params) => {
              const number = params.value;
              return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(number);
            },
            cellStyle: { textAlign: 'center' },
          },

          {
            field: 'transactionDate',
            headerName: 'Transaction Date',
            flex: 1,
            filter: true,
            cellRenderer: (params) => parseDate(params.value),
          },

          // {
          //   field: "transactionNo",
          //   headerName: "Transaction No",
          //   flex: 1,
          //   filter: true,
          // },
        ];

      default:
        return [];
    }
  };

  const transformDataByType = (data) => {
    return data.map((item, index) => {
      switch (type) {
        case 'Vendor Ledger Entries':
        case 'Customer Ledger Entries':
          return {
            no: index + 1,
            id: item.id,
            transactionNo: item.transactionNo,
            documentNo: item.documentNo,
            externalDocumentNo: item.externalDocumentNo,
            accountId: item.accountId || item.accountNo,
            transactionDate: item.transactionDate,
            amount: item.amount,
            description: transformString(item.description),
          };

        case 'Bank Account Ledger Entries':
          return {
            no: index + 1,
            id: item.id,
            transactionNo: item.transactionNo,
            documentNo: item.documentNo,
            externalDocumentNo: item.externalDocumentNo,
            glBankCode: item.glBankCode,
            transactionDate: item.transactionDate,
            amount: item.amount,
            description: transformString(item.description),
            glEntryNo: item.glEntryNo,
          };

        case 'General Ledger Entries':
          return {
            no: index + 1,
            id: item.id,
            transactionNo: item.transactionNo,
            documentNo: item.documentNo,
            transactionDate: item.transactionDate,
            amount: item.amount,
            accountNo: item.accountNo,
          };

        default:
          return {};
      }
    });
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
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={getFieldsByType(type).map((field) => ({
              ...field,
              disabled: true,
            }))}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={getFieldsByType(type)}
            apiEndpoint={endpoints.createDepartment}
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
        columnDefs={getColumnDefsByType(type)}
        fetchApiEndpoint={getSubLedgerEndpoint(type)}
        fetchApiService={apiService.get}
        transformData={transformDataByType}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle={type}
        currentTitle={type}
      />
    </div>
  );
};

export default LedgerEntries;
