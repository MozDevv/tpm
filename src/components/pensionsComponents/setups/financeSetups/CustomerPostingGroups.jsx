"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const CustomerPostingGroups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [glAccounts, setGlAccounts] = React.useState([]);

  const findAccountName = (accountId) => {
    const account = glAccounts?.find((acc) => acc.id === accountId);
    return account ? account.name : ""; // Return the account name or an empty string if not found
  };
  const columnDefs = [
    {
      field: "no",
      headerName: "No",
      headerClass: "prefix-header",
      width: 90,
      filter: true,
    },
    {
      field: "groupCode",
      headerName: "Group Code",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "description",
      headerName: "Description",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "viewAll",
      headerName: "View All",
      headerClass: "prefix-header",
      filter: true,
      width: 100,
    },

    {
      field: "recievableAccount",
      headerName: "Recievable Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => findAccountName(params.data.recievableAccount),
    },
    {
      field: "paymentDiscDrAccount",
      headerName: "Payment Discount Debit Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.paymentDiscDrAccount),
    },
    {
      field: "paymentDiscCrAccount",
      headerName: "Payment Discount Credit Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.paymentDiscCrAccount),
    },
    {
      field: "interestAccount",
      headerName: "Interest Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => findAccountName(params.data.interestAccount),
    },
    {
      field: "feePerLineAccount",
      headerName: "Fee Per Line Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => findAccountName(params.data.feePerLineAccount),
    },
    {
      field: "serviceChargeAccount",
      headerName: "Service Charge Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.serviceChargeAccount),
    },
    {
      field: "invoiceRoundingAccount",
      headerName: "Invoice Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.invoiceRoundingAccount),
    },
    {
      field: "drCurrencyRoundingAccount",
      headerName: "Dr Currency Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.drCurrencyRoundingAccount),
    },
    {
      field: "crCurrencyRoundingAccount",
      headerName: "Cr Currency Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) =>
        findAccountName(params.data.crCurrencyRoundingAccount),
    },
    {
      field: "drRoundingAccount",
      headerName: "Dr Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => findAccountName(params.data.drRoundingAccount),
    },
    {
      field: "crRoundingAccount",
      headerName: "Cr Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => findAccountName(params.data.crRoundingAccount),
    },
  ];

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        "paging.pageSize": 150,
      });

      const accounts = response.data.data.filter(
        (acc) => acc.accountTypeName === "POSTING"
      );
      const account2 = accounts.map((account) => ({
        id: account.id,
        name: account.accountName,
        accountNo: account.accountNo,
      }));

      setGlAccounts(account2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts();
  }, []);
  const getAccountName = (id) => {
    const account =
      Array.isArray(glAccounts) && glAccounts.find((acc) => acc.id === id);
    return account ? account.name : "";
  };

  const transformData = (data) => {
    return data.map((item, index) => {
      const findAccountName = (accountId) => {
        const account = glAccounts?.find((acc) => acc.id === accountId);
        return account ? account.name : ""; // Return the account name or an empty string if not found
      };

      return {
        no: index + 1,
        id: item.id,
        groupCode: item.groupCode,
        description: transformString(item.description),
        viewAll: item.viewAll,
        recievableAccount: item.recievableAccount,
        paymentDiscDrAccount: item.paymentDiscDrAccount,
        paymentDiscCrAccount: item.paymentDiscCrAccount,
        interestAccount: item.interestAccount,
        feePerLineAccount: item.feePerLineAccount,
        serviceChargeAccount: item.serviceChargeAccount,
        invoiceRoundingAccount: item.invoiceRoundingAccount,
        drCurrencyRoundingAccount: item.drCurrencyRoundingAccount,
        crCurrencyRoundingAccount: item.crCurrencyRoundingAccount,
        drRoundingAccount: item.drRoundingAccount,
        crRoundingAccount: item.crRoundingAccount,
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

  const title = clickedItem
    ? "Customer Posting Group"
    : "Create New Customer Posting Group";

  const fields = [
    { name: "groupCode", label: "Group Code", type: "text", required: true },

    { name: "description", label: "Description", type: "text", required: true },

    { name: "viewAll", label: "View All", type: "text", required: true },

    {
      name: "recievableAccount",
      label: "Recievable Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "paymentDiscDrAccount",
      label: "Payment Discount Debit Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "paymentDiscCrAccount",
      label: "Payment Discount Credit Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "interestAccount",
      label: "Interest Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "feePerLineAccount",
      label: "Fee Per Line Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "serviceChargeAccount",
      label: "Service Charge Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "invoiceRoundingAccount",
      label: "Invoice Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "drCurrencyRoundingAccount",
      label: "Dr Currency Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "crCurrencyRoundingAccount",
      label: "Cr Currency Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "drRoundingAccount",
      label: "Dr Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "crRoundingAccount",
      label: "Cr Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
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
        deleteApiEndpoint={financeEndpoints.deleteCustomerPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateCustomerPostingGroup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addCustomerPostingGroup}
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
        columnDefs={columnDefs}
        fetchGlAccounts={fetchGlAccounts}
        fetchApiEndpoint={financeEndpoints.getCustomerPostingGroup}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Customer Posting Groups"
        currentTitle="Customer Posting Groups"
      />
    </div>
  );
};

export default CustomerPostingGroups;
