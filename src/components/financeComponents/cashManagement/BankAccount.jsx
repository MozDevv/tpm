"use client";
import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { apiService as setupsApiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";
import endpoints from "@/components/services/setupsApi";

const columnDefs = [
  {
    field: "bankAccountName",
    headerName: "Bank Account Name",
    headerClass: "prefix-header",

    filter: true,
  },
  {
    field: "bankAccountDescription",
    headerName: "Bank Account Description",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "bankAccountNo",
    headerName: "Bank Account No",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "isBlocked",
    headerName: "Is Blocked",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
];

const BankAccount = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);

  const transformData = (data) => {
    return data.map((item, index) => {
      const branch = branches.find((branch) => branch.id === item.bankBranchId);
      return {
        no: index + 1,
        id: item.id,
        bankAccountName: item.bankAccountName,
        bankAccountDescription: item.bankAccountDescription,
        bankAccountNo: item.bankAccountNo,
        isBlocked: item.isBlocked,
        bankBranchId: item.bankBranchId,
        branchName: branch ? branch.name : "",
        bank_id: branch ? branch.bankId : "",

        // roles: item.roles,
      };
    });
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => console.log("Notify clicked"),
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

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        "paging.pageSize": 1000,
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

      console.log("banksData", banksData);
      console.log("branchesData", branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log("Error fetching banks and branches:", error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const title = clickedItem
    ? `${clickedItem?.bankAccountName}`
    : "Create New Bank Account";

  const fields = [
    {
      name: "bankAccountName",
      label: "Bank Account Name",
      type: "text",
      required: true,
    },
    {
      name: "bankAccountDescription",
      label: "Bank Account Description",
      type: "text",
      required: true,
    },
    {
      name: "bankAccountNo",
      label: "Bank Account No",
      type: "text",
      required: true,
    },
    { name: "isBlocked", label: "Is Blocked", type: "switch", required: true },
    {
      name: "bank_id",
      label: "Bank",
      type: "autocomplete",
      options: banks,
    },

    {
      name: "bankBranchId",
      label: "Bank Branch Id",
      options: branches.filter((branch) =>
        selectedBank ? branch.bankId === selectedBank : true
      ),
      type: "autocomplete",
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
        deleteApiEndpoint={financeEndpoints.deleteBankAccount(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateBankAccount}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            banks={banks}
            setSelectedBank={setSelectedBank}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addBankAccount}
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
        fetchApiEndpoint={financeEndpoints.getBankAccounts}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Bank Account"
        currentTitle="Bank Account"
      />
    </div>
  );
};

export default BankAccount;
