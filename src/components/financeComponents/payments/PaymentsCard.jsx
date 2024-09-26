import React, { use, useEffect, useState } from "react";
import { Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

import { AgGridReact } from "ag-grid-react";
import BaseInputTable from "@/components/baseComponents/BaseInputTable";
import { apiService } from "@/components/services/financeApi";
import BaseFinanceInputCard from "@/components/baseComponents/BaseFinanceInputCard";
import BaseFinanceInputTable from "@/components/baseComponents/BaseFinanceInputTable";
import financeEndpoints from "@/components/services/financeApi";
import BaseAutoSaveInputCard from "@/components/baseComponents/BaseAutoSaveInputCard";

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
}) {
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(null);

  const [allOptions, setAllOptions] = useState(null);

  const fetchNewOptions = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getAllAccounts, {
        "paging.pageSize": 2000,
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
        "All Options ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️❤️❤️❤️",
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
            "paging.pageSize": 2000,
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

  const tableFields = [
    {
      value: "accountTypeId",
      label: "Account Type",
      type: "select",
      required: true,

      options: [
        {
          id: 0,
          name: "General_Ledger",
        },
        {
          id: 1,
          name: "Vendor",
        },
        {
          id: 2,
          name: "Customer",
        },
        {
          id: 3,
          name: "Bank",
        },
      ],
    },

    {
      value: "accountId",
      label: "Account No",
      type: "select",
      required: true,

      options: allOptions && allOptions,
    },
    {
      value: "accountNo",
      label: "Account Name",
      type: "text",
      required: true,
      disabled: true,
      options: allOptions && allOptions,
    },

    {
      value: "vatExcempt",
      label: "VAT Excempt",
      type: "select",
      options: [
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ],
      required: true,
    },
    {
      value: "vatCode",
      label: "VAT Code",
      type: "select",
      required: true,
      options: productPostingGroups,
    },
    {
      value: "taxCode",
      label: "Tax Code",
      type: "select",
      required: true,
      options: productPostingGroups,
    },
    {
      value: "wtaxCode",
      label: "W/Tax Code",
      type: "select",
      required: true,
      options: productPostingGroups,
    },
    {
      value: "wvatCode",
      label: "W/T Vat Code",
      type: "select",
      required: true,
      options: productPostingGroups,
    },
    {
      value: "retentionCode",
      label: "Retention Code",
      type: "select",
      required: true,
      options: productPostingGroups,
    },
    {
      value: "amount",
      label: "Amount",
      type: "number",
      required: true,
      disabled: false,
    },

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
    {
      value: "vatAmount",
      label: "VAT Amount",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      value: "taxAmount",
      label: "Tax Amount",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      value: "wtaxAmount",
      label: "W/Tax Amount",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      value: "wvatAmount",
      label: "W/T Vat Amount",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      value: "retentionAmount",
      label: "Retention Amount",
      type: "number",
      required: false,
      disabled: true,
    },
    {
      value: "netAmount",
      label: "Net Amount",
      type: "number",
      required: false,
      disabled: true,
    },
  ];

  const totalAmounts1 = [
    { name: "Number of Entries", value: 1 },

    { name: "Total Debit", value: "0.00" },
    { name: "Total Credit", value: "0.00" },
    { name: "Balance", value: "0.00" },
    { name: "Total Balance", value: "0.00" },
  ];

  const [totalAmmounts, setTotalAmmounts] = useState(totalAmounts1);

  return (
    <div className="p-2   mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px] h-[95vh] max-h-[95vh] overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex-grow">
                {" "}
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
                  {" "}
                  {/* Make this grow too */}
                  <BaseFinanceInputTable
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

export default PaymentsCard;
