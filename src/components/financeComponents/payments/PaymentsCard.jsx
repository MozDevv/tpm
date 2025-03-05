import React, { use, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { apiService } from '@/components/services/financeApi';
import { apiService as preApiservice } from '@/components/services/preclaimsApi';
import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import BaseFinanceInputCard from '@/components/baseComponents/BaseFinanceInputCard';
import BaseFinanceInputTable from '@/components/baseComponents/BaseFinanceInputTable';
import financeEndpoints from '@/components/services/financeApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import PensionerDetails from '@/components/assessment/assessmentDataCapture/PensionerDetails';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import AssessmentCard from './PensionerDetailsTabs';

const { TabPane } = Tabs;

function PaymentsCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  transformData,
  setClickedItem,
  disableAll,
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
              ...acc,
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
      value: 'accountTypeId',
      label: 'Account Type',
      type: 'select',
      required: true,

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
      value: 'accountNo',
      label: 'Account No',
      type: 'text',
      required: true,
      disabled: true,
      options: allOptions && allOptions,
    },

    {
      value: 'accountId',
      label: 'Account Name',
      type: 'select',
      required: true,

      options: allOptions && allOptions,
    },

    {
      value: 'narration',
      label: 'Narration',
      type: 'text',
      required: true,
    },

    {
      value: 'vatExcempt',
      label: 'VAT Excempt',
      type: 'select',
      options: [
        { id: true, name: 'Yes' },
        { id: false, name: 'No' },
      ],
      required: true,
    },

    {
      value: 'taxCode',
      label: 'Tax Code',
      type: 'select',
      notRequired: true,
      options: productPostingGroups,
    },
    {
      value: 'taxAmount',
      label: 'Tax Amount',
      type: 'amount',
      notRequired: true,
      disabled: true,
    },

    {
      value: 'wtaxCode',
      label: 'W/Tax Code',
      type: 'select',
      notRequired: true,
      options: productPostingGroups,
    },
    {
      value: 'wtaxAmount',
      label: 'W/Tax Amount',
      type: 'amount',
      notRequired: true,
      disabled: true,
    },

    {
      value: 'amount',
      label: 'Amount',
      type: 'amount',
      notRequired: true,
      disabled: false,
    },
    // {
    //   value: 'wvatCode',
    //   label: 'W/T Vat Code',
    //   type: 'select',
    //   required: true,
    //   options: productPostingGroups,
    // },
    // {
    //   value: 'retentionCode',
    //   label: 'Retention Code',
    //   type: 'select',
    //   required: true,
    //   options: productPostingGroups,
    // },

    // {
    //   value: 'vatCode',
    //   label: 'VAT Code',
    //   type: 'select',
    //   required: true,
    //   options: productPostingGroups,
    // },

    // {
    //   value: "currency",
    //   label: "Currency",
    //   type: "select",
    //   required: true,
    //   options: [
    //     {
    //       id: "usd",
    //       name: "USD",
    //     },
    //     {
    //       id: "kes",
    //       name: "KES",
    //     },
    //     {
    //       id: "eur",
    //       name: "EUR",
    //     },
    //   ],
    // },
    // {
    //   value: 'vatAmount',
    //   label: 'VAT Amount',
    //   type: 'amount',
    //   required: false,
    //   disabled: true,
    // },

    // {
    //   value: 'wvatAmount',
    //   label: 'W/T Vat Amount',
    //   type: 'amount',
    //   required: false,
    //   disabled: true,
    // },
    // {
    //   value: 'retentionAmount',
    //   label: 'Retention Amount',
    //   type: 'amount',
    //   required: false,
    //   disabled: true,
    // },
    {
      value: 'netAmount',
      label: 'Net Amount',
      type: 'amount',
      notRequired: true,
      disabled: true,
    },

    {
      value: 'appliesToDocType',
      label: 'Applies To Doc Type',
      type: 'select',
      notRequired: true,
      options: [
        { id: 0, name: 'Payment Voucher' },
        { id: 1, name: 'Purchase Invoice' },
        { id: 2, name: 'Sales Invoice' },
        { id: 3, name: 'Receipt' },
        { id: 4, name: 'Purchase Credit Memo' },
        { id: 5, name: 'Sales Credit Memo' },
        { id: 6, name: 'Journal Voucher' },
      ],
    },
    {
      value: 'appliesToDocNumber',
      label: 'Applies To Doc Number',
      type: 'text',
      notRequired: true,
    },

    {
      value: 'purpose',
      label: 'Purpose',
      type: 'text',
      notRequired: true,
    },
    {
      value: 'bankId',
      label: 'Bank',
      type: 'select',
      required: true,
      options: banks,
      notRequired: true,
    },
    {
      value: 'bankBranchId',
      label: 'Bank Branch',
      type: 'select',
      required: true,
      notRequired: true,
      options: branches,
    },
    {
      value: 'bankAccountNo',
      label: 'Bank Account No',
      type: 'text',
      required: true,
      notRequired: true,
    },
    {
      value: 'bankAccountName',
      label: 'Bank Account Name',
      type: 'text',
      required: true,
      notRequired: true,
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
  const [retiree, setRetiree] = useState(null);

  const fetchRetiree = async () => {
    try {
      const res = await preApiservice.get(
        preClaimsEndpoints.getProspectivePensioner(
          clickedItem?.prospectivePensionerId
        )
      );
      if (res.status === 200) {
        setRetiree(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRetiree();
  }, []);

  const tabPanes = [
    {
      title: 'Payment Details',
      key: '1',
      content: (
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
                disableAll={disableAll}
              />
            </div>

            <div className="max-h-[90vh] h-[99vh] overflow-y-auto">
              <div className="flex-grow">
                {' '}
                {/* Make this grow too */}
                {clickedItem?.prospectivePensionerId &&
                  clickedItem.source !== 0 && (
                    <div className="ml-[-13px]">
                      <PensionerDetails
                        isPayment={true}
                        clickedItem={clickedItem}
                        retireeId={clickedItem?.prospectivePensionerId}
                      />
                    </div>
                  )}
                <BaseFinanceInputTable
                  disableAll={disableAll}
                  allOptions={allOptions}
                  setSelectedAccountTypeId={setSelectedAccountTypeId}
                  selectedAccountTypeId={selectedAccountTypeId}
                  title="Payment Lines"
                  fields={tableFields}
                  id={clickedItem?.id}
                  idLabel="paymentId"
                  getApiService={apiService.get}
                  postApiService={apiService.post}
                  putApiService={apiService.post}
                  getEndpoint={financeEndpoints.getPaymentLines(
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
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Pensioner Work History',
      key: '2',
      content: <></>,
    },
  ];

  return (
    <div className="p-2">
      <div>
        <div className="mt-[-10px]">
          {/* <BaseTabs tabPanes={tabPanes} /> */}

          {clickedItem?.source === 1 || clickedItem?.source === 2 ? (
            <AssessmentCard
              claim={clickedItem}
              clickedItem={retiree}
              claimId={clickedItem?.claimId}
              disableAll={disableAll}
              setOpenBaseCard={setOpenBaseCard}
              allOptions={allOptions}
              setSelectedAccountTypeId={setSelectedAccountTypeId}
              selected
            >
              <div className="px-5 mt-[-20px] h-[95vh] max-h-[95vh] overflow-y-auto">
                <div className="flex flex-col">
                  <div className="flex-grow">
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
                      disableAll={disableAll}
                    />
                  </div>
                  <div className="max-h-[90vh] h-[99vh] overflow-y-auto">
                    <div className="flex-grow">
                      <BaseFinanceInputTable
                        disableAll={disableAll}
                        allOptions={allOptions}
                        setSelectedAccountTypeId={setSelectedAccountTypeId}
                        selectedAccountTypeId={selectedAccountTypeId}
                        title="Payment Lines"
                        fields={tableFields}
                        id={clickedItem?.id}
                        idLabel="paymentId"
                        getApiService={apiService.get}
                        postApiService={apiService.post}
                        putApiService={apiService.post}
                        getEndpoint={financeEndpoints.getPaymentLines(
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
                  </div>
                </div>
              </div>
            </AssessmentCard>
          ) : (
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
                    disableAll={disableAll}
                  />
                </div>

                <div className="max-h-[90vh] h-[99vh] overflow-y-auto">
                  <div className="flex-grow">
                    <BaseFinanceInputTable
                      disableAll={disableAll}
                      allOptions={allOptions}
                      setSelectedAccountTypeId={setSelectedAccountTypeId}
                      selectedAccountTypeId={selectedAccountTypeId}
                      title="Payment Lines"
                      fields={tableFields}
                      id={clickedItem?.id}
                      idLabel="paymentId"
                      getApiService={apiService.get}
                      postApiService={apiService.post}
                      putApiService={apiService.post}
                      getEndpoint={financeEndpoints.getPaymentLines(
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentsCard;
