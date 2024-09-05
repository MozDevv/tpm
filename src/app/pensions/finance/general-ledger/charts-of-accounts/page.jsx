"use client";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import ChartsOfAccounts from "@/components/financeComponents/generalLedger/chartsOfAccounts/chartsOfAccountsList/ChartsOfAccounts";
import ChartsOfAccountsList from "@/components/financeComponents/generalLedger/chartsOfAccounts/chartsOfAccountsList/ChartsOfAccountsList";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-3 font-bold text-xl">
        Chart of Accounts
      </div>
      <CustomBreadcrumbsList currentTitle="Chart of Accounts" />
      <ChartsOfAccounts />
    </div>
  );
}

export default page;
