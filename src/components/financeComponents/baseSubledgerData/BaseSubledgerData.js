import { formatDate, parseDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';

export const getColumnDefsByType = (type) => {
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
        // {
        //   field: 'accountId',
        //   headerName: 'Account',
        //   flex: 1,
        //   filter: true,
        //   valueGetter: (params) => {
        //     const account = allOptions?.find(
        //       (acc) => acc.id === params.data.accountId
        //     );
        //     return account?.name ?? 'N/A';
        //   },
        // },
        {
          field: 'transactionDate',
          headerName: 'Transaction Date',
          flex: 1,
          filter: true,
          valueFormatter: (params) => formatDate(params.value),
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
          field: 'description',
          headerName: 'Description',
          flex: 1,
          filter: true,
        },

        {
          field: 'amount',
          headerName: 'Amount',
          flex: 1,
          filter: true,

          cellRenderer: (params) => {
            return (
              <p className=" text-primary text-right font-semibold">
                {formatNumber(params.value)}
              </p>
            );
          },
        },

        {
          field: 'transactionDate',
          headerName: 'Transaction Date',
          flex: 1,
          filter: true,
          valueFormatter: (params) => parseDate(params.value),
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
          field: 'transactionDate',
          headerName: 'Transaction Date',
          flex: 1,
          filter: true,
          valueFormatter: (params) => parseDate(params.value),
        },

        {
          field: 'transactionNo',
          headerName: 'Transaction No',
          flex: 1,
          filter: true,
        },
      ];

    default:
      return [];
  }
};

export const transformDataByType = (data) => {
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
