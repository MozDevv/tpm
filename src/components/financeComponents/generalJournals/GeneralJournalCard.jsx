import React, { useState } from "react";
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

function GeneralJournalCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  transformData,
}) {
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(null);
  const tableFields = [
    {
      value: "accountTypeId",
      label: "Account Type",
      type: "select",
      required: true,
      options: [
        {
          id: 1,
          name: "General_Ledger",
        },
        {
          id: 2,
          name: "Vendor",
        },
        {
          id: 3,
          name: "Customer",
        },
        {
          id: 4,
          name: "Bank",
        },
      ],
    },

    {
      value: "accountId",
      label: "Account No",
      type: "select",
      required: true,
      options: selectedAccountTypeId
        ? selectedAccountTypeId.map((acc) => {
            return {
              id: acc.id,
              name: acc.accountNo,
              accountName: acc.name,
            };
          })
        : [{ id: null, name: "Select Account Type First" }],
    },
    {
      value: "accountName",
      label: "Account Name",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      value: "amount",
      label: "Amount",
      type: "number",
      required: true,
    },
    {
      value: "debitAmount",
      label: "Debit Amount",
      type: "number",
      required: true,
    },
    {
      value: "creditAmount",
      label: "Credit Amount",
      type: "number",
      required: true,
    },
  ];

  const fetchNewOptions = async (accountTypeId) => {
    try {
      const res = await apiService.get(
        financeEndpoints.getAccountByAccountType(accountTypeId)
      ); // Pass accountTypeId to the endpoint
      if (res.status === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      return []; // Return an empty array if an error occurs
    }
  };

  const totalAmounts = [
    { name: "Number of Entries", value: 1 },

    { name: "Total Debit", value: "0.00" },
    { name: "Total Credit", value: "0.00" },
    { name: "Balance", value: "0.00" },
    { name: "Total Balance", value: "0.00" },
  ];
  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-y-auto mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px]">
            <div className="">
              <BaseAutoSaveInputCard
                fields={fields}
                apiEndpoint={financeEndpoints.addGeneralJournal}
                putApiFunction={apiService.post}
                updateApiEndpoint={financeEndpoints.editGeneralJournal}
                postApiFunction={apiService.post}
                getApiEndpoint={financeEndpoints.getGeneralJournalsById}
                getApiFunction={apiService.get}
                transformData={transformData}
                setOpenBaseCard={setOpenBaseCard}
                clickedItem={clickedItem}
                useRequestBody={true}
              />
            </div>

            <BaseFinanceInputTable
              setSelectedAccountTypeId={setSelectedAccountTypeId}
              selectedAccountTypeId={selectedAccountTypeId}
              title="Journal Entries"
              fields={tableFields}
              id={clickedItem?.id}
              idLabel="journalId"
              getApiService={apiService.get}
              postApiService={apiService.post}
              putApiService={apiService.put}
              getEndpoint={financeEndpoints.getGeneralJournalsById(
                clickedItem?.id
              )}
              postEndpoint={financeEndpoints.addGeneralJournalLine}
              putEndpoint={financeEndpoints.editGeneralJournalLine}
              passProspectivePensionerId={true}
            />

            <div className="flex justify-between mt-10 w-full">
              <div className="flex flex-row justify-between w-full">
                {totalAmounts.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 justify-between"
                  >
                    <span className="text-sm font-semibold text-gray-600">
                      {item.name}
                    </span>
                    <span className="items-end text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralJournalCard;
