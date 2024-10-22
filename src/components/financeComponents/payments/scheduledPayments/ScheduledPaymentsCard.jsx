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

function ScheduledPaymentsCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  transformData,
  setClickedItem,
}) {
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

  useEffect(() => {
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
      value: 'documentNo',
      label: 'Document No',
      type: 'text',
      required: true,
    },
    {
      value: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      value: 'netAmount',
      label: 'Net Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'grossAmount',
      label: 'Gross Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'refundAmount',
      label: 'Refund Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'pensionAmount',
      label: 'Pension Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'deductionsAndRefundId',
      label: 'Deductions And Refund',
      type: 'text',
      required: true,
    },
    {
      value: 'paymentId',
      label: 'Payment',
      type: 'text',
      required: true,
    },

    {
      value: 'deductionAmount',
      label: 'Deduction Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'refundDescription',
      label: 'Refund Description',
      type: 'text',
      required: true,
    },
  ];

  const totalAmounts1 = [
    { name: 'Number of Entries', value: 1 },

    { name: 'Total Debit', value: '0.00' },
    { name: 'Total Credit', value: '0.00' },
    { name: 'Balance', value: '0.00' },
    { name: 'Total Balance', value: '0.00' },
  ];

  const [totalAmmounts, setTotalAmmounts] = useState(totalAmounts1);

  return (
    <div className="p-2   mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px] h-[95vh] max-h-[95vh] overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex-grow">
                {' '}
                {/* This allows the card to grow */}
                <BaseAutoSaveInputCard
                  setClickedItem={setClickedItem}
                  fields={fields}
                  apiEndpoint={financeEndpoints.addPayment}
                  putApiFunction={apiService.post}
                  updateApiEndpoint={financeEndpoints.updatePayment}
                  postApiFunction={apiService.post}
                  getApiEndpoint={financeEndpoints.getPaymentById(
                    clickedItem?.id
                  )}
                  getApiFunction={apiService.get}
                  transformData={transformData}
                  setOpenBaseCard={setOpenBaseCard}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                />
              </div>

              <div className="max-h-[90vh] h-[99vh] overflow-y-auto">
                <div className="flex-grow">
                  {' '}
                  {/* Make this grow too */}
                  <BaseFinanceInputTable
                    allOptions={allOptions}
                    setSelectedAccountTypeId={setSelectedAccountTypeId}
                    selectedAccountTypeId={selectedAccountTypeId}
                    title="Scheduled Payment Lines"
                    fields={tableFields}
                    id={clickedItem?.id}
                    idLabel="paymentId"
                    getApiService={apiService.get}
                    postApiService={apiService.post}
                    putApiService={apiService.post}
                    getEndpoint={financeEndpoints.getPaymentScheduleLines(
                      clickedItem?.id
                    )}
                    deleteEndpoint={financeEndpoints.deletePaymentLine}
                    setTotalAmmounts={setTotalAmmounts}
                    postEndpoint={financeEndpoints.addPaymentLine}
                    putEndpoint={financeEndpoints.updatePaymentLine}
                    passProspectivePensionerId={true}
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

export default ScheduledPaymentsCard;
