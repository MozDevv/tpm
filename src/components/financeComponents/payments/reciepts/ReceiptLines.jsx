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
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const { TabPane } = Tabs;

function RecieptLines({ clickedItem, status }) {
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
        name: bank.code,
        bankName: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          id: branch.id,
          name: branch.branch_code,
          branchName: branch.name,

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

  const { data: receiptTypes } = useFetchAsync(
    financeEndpoints.getReceiptPostingGroups,
    apiService
  );
  const { data: paymentMethods } = useFetchAsync(
    financeEndpoints.getPaymentMethods,
    apiService
  );
  const { data: crAccounts } = useFetchAsync(
    financeEndpoints.getAccountByAccountTypeNoPage(0),
    apiService
  );
  const { data: drAccounts } = useFetchAsync(
    financeEndpoints.getAccountByAccountTypeNoPage(3),
    apiService
  );
  const tableFields = [
    /**{
  "ReceiptId": "3723dbc1-5dde-4a59-8e7c-a42004fa2b41",
  "PaymentMethodId": "69e90a4a-7eb1-4c40-a92e-9d3d489334ac",
  "BankId": "99285702-1196-4e11-8b70-725e50aef567",
  "BankBranchId": "5c3392d5-2807-403f-a34d-1c00325eccf1",
  "ChequeOrEftDate": "2024-03-25T00:00:00Z",
  "ChequeOrEftNo": "CHQ123458",
  "Amount": 1000.00,
  "AppliesToDocNo": "DOC788"
} */
    {
      value: 'paymentMethodId',
      label: 'Payment Method',
      type: 'select',
      options:
        paymentMethods &&
        paymentMethods.map((item) => {
          return {
            id: item.id,
            name: item.description,
          };
        }),
    },
    {
      value: 'chequeOrEftDate',
      label: 'Cheque/EFT Date',
      type: 'date',
      required: true,
    },

    {
      value: 'chequeOrEftNo',
      label: 'Cheque/EFT No',
      type: 'text',
      required: true,
    },
    {
      value: 'bankId',
      label: 'Bank Code',
      type: 'select',
      required: true,
      options: banks,
      required: true,
    },
    {
      value: 'bankName',
      label: 'Bank Name',
      type: 'text',
      disabled: true,
      // required
    },
    {
      value: 'bankBranchId',
      label: 'Bank Branch Code',
      type: 'select',
      required: true,
      required: true,
      options: branches,
    },
    {
      value: 'bankBranchName',
      label: 'Bank Branch Name',
      type: 'text',
      disabled: true,
    },
    {
      value: 'amount',
      label: 'Amount',
      type: 'amount',
      required: true,
    },
    {
      value: 'appliesToDocNo',
      label: 'Applies To Doc No',
      type: 'text',
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
                    disableAll={status !== 0 && status !== 1}
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
                    branches={branches}
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
