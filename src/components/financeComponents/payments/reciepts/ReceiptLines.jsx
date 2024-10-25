import React, { use, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { apiService } from '@/components/services/financeApi';
import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import BaseFinanceInputCard from '@/components/baseComponents/BaseFinanceInputCard';
import BaseFinanceInputTable from '@/components/baseComponents/BaseFinanceInputTable';
import financeEndpoints from '@/components/services/financeApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';

const { TabPane } = Tabs;

function RecieptLines({ clickedItem }) {
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(null);

  const [allOptions, setAllOptions] = useState(null);

  const fetchNewOptions = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getAllAccounts, {
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

      console.log(
        'All Options ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️❤️❤️❤️',
        res.data.data.map((acc) => {
          return {
            id: acc.id,
            name: acc.accountNo,
            accountName: acc.name,
            accountType: acc.accountType,
          };
        })
      );
    } catch (error) {
      console.log(error);
      return []; // Return an empty array if an error occurs
    }
  };

  const [accountTypes, setAccountTypes] = useState([]);

  const fetchAccountTypes = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.fetchGlAccountTypes
      );
      setAccountTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
    fetchNewOptions();
  }, []);

  const [productPostingGroups, setProductPostingGroups] = useState(null);

  useEffect(() => {
    const fetchProductPostingGroups = async () => {
      try {
        const res = await apiService.get(
          financeEndpoints.getProductPostingGroups,
          {
            'paging.pageSize': 2000,
          }
        );
        if (res.status === 200) {
          setProductPostingGroups(
            res.data.data.map((group) => {
              return {
                id: group.id,
                name: group.name,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductPostingGroups();
  }, []);

  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const tableFields = [
    {
      value: 'receiptType',
      label: 'Receipt Type',
      type: 'select',
      options: [
        { id: 0, name: 'Customer' },
        { id: 1, name: 'Vendor' },
      ],
    },
    {
      value: 'accountType',
      label: 'Account Type',
      type: 'select',
      options: [
        {
          id: 0,
          name: 'General_Ledger',
        },
        {
          id: 1,
          name: 'Vendor',
        },
        {
          id: 2,
          name: 'Customer',
        },
        {
          id: 3,
          name: 'Bank',
        },
      ],
    },
    {
      value: 'accountId',
      label: 'Account No',
      type: 'select',
      options: allOptions && allOptions,
    },
    // {
    //   value: 'accountName',
    //   label: 'Account Name',
    //   type: 'text',
    //   required: true,
    //   disabled: true,
    //   options: allOptions && allOptions,
    // },
    {
      value: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },

    {
      value: 'appliesToDocType',
      label: 'Applies To Doc Type',
      type: 'select',
      options: [
        {
          id: 0,
          name: 'Payment Voucher',
        },
        {
          id: 1,
          name: 'Purchase Invoice',
        },
        {
          id: 2,
          name: 'Sales Invoice',
        },
        {
          id: 3,
          name: 'Receipt',
        },
        {
          id: 4,
          name: 'Purchase Credit Memo',
        },
        {
          id: 5,
          name: 'Sales Credit Memo',
        },
        {
          id: 6,
          name: 'Journal Voucher',
        },
      ],
    },
    {
      value: 'appliesToDocNo',
      label: 'Applies To Doc No',
      type: 'text',
      required: true,
    },
  ];

  const [totalAmmounts, setTotalAmmounts] = useState([]);
  return (
    <div className="p-2   mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px] h-[95vh] max-h-[95vh] overflow-y-auto">
            <div className="flex flex-col">
              <div className="max-h-[90vh] h-[99vh] overflow-y-auto">
                <div className="flex-grow">
                  {' '}
                  {/* Make this grow too */}
                  <BaseFinanceInputTable
                    allOptions={allOptions}
                    setSelectedAccountTypeId={setSelectedAccountTypeId}
                    selectedAccountTypeId={selectedAccountTypeId}
                    title="Receipt Lines"
                    fields={tableFields}
                    id={clickedItem?.id}
                    idLabel="receiptId"
                    getApiService={apiService.get}
                    postApiService={apiService.post}
                    putApiService={apiService.post}
                    getEndpoint={financeEndpoints.getReceiptLines(
                      clickedItem?.id
                    )}
                    deleteEndpoint={financeEndpoints.deleteReceiptLine}
                    postEndpoint={financeEndpoints.addReceiptLine}
                    putEndpoint={financeEndpoints.updateReceiptLine}
                    passProspectivePensionerId={true}
                    setTotalAmmounts={setTotalAmmounts}
                  />
                </div>

                {/* <div className="flex justify-between mt-10">
                  <div className="flex flex-row justify-between w-full">
                    {totalAmmounts.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 justify-between"
                      >
                        <span className="text-sm font-semibold text-gray-600">
                          {item.name}
                        </span>
                        <span className="items-end text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecieptLines;
