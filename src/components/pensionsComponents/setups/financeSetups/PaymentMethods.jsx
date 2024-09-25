"use client";
import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

import { API_BASE_URL } from "@/components/services/setupsApi";

import axios from "axios";
import BaseAutoSaveInputCard from "@/components/baseComponents/BaseAutoSaveInputCard";
import { formatNumber } from "@/utils/numberFormatters";

const PaymentMethods = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      code: item.code,
      description: item.description,
      accountTypeId: item.accountTypeId,
      accountId: item.accountId,
      directDebitPaymentTerms: item.directDebitPaymentTerms,
      isDirectDebit: item.isDirectDebit,
      isForInvoicing: item.isForInvoicing,

      // roles: item.roles,
    }));
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

  const title = clickedItem ? clickedItem?.code : "Create New Payment Method";

  const [allOptions, setAllOptions] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(null);

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

  const columnDefs = [
    {
      field: "code",
      headerName: "Code",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
    },
    {
      field: "description",
      headerName: "Description",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
    },
    {
      field: "accountTypeId",
      headerName: "Account Type",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
      valueFormatter: (params) => {
        const options = [
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
        ];
        const accountType = options.find((acc) => acc.id === params.value);
        return accountType ? accountType.name : "";
      },
    },
    {
      field: "accountId",
      headerName: "Account Name",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
      valueFormatter: (params) => {
        const account =
          allOptions && allOptions.find((acc) => acc.id === params.value);
        return account ? account.name : "";
      },
    },

    {
      field: "isDirectDebit",
      headerName: "Is Direct Debit",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
    },
    {
      field: "isForInvoicing",
      headerName: "Is For Invoicing",
      headerClass: "prefix-header",
      flex: 1,
      filter: true,
    },
  ];
  const fields = [
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "accountTypeId",
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
      name: "accountId",
      label: "Account",
      type: "select",
      required: true,
      options:
        filteredOptions && filteredOptions.length > 0
          ? filteredOptions
          : allOptions,
    },

    {
      name: "directDebitPaymentTerms",
      label: "Direct Debit Payment Terms",
      type: "text",
      required: false,
    },
    {
      name: "isDirectDebit",
      label: "Is Direct Debit",
      type: "switch",
      required: true,
    },
    {
      name: "isForInvoicing",
      label: "Is For Invoicing",
      type: "switch",
      required: true,
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
        deleteApiEndpoint={financeEndpoints.deletePaymentMethod(
          clickedItem?.id
        )}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addPaymentMethod}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updatePaymentMethod}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getPaymentMethods}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
          />
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addPaymentMethod}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updatePaymentMethod}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getPaymentMethods}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
            fieldName="accountTypeId"
            options={allOptions}
            setResultFunction={setFilteredOptions}
            filterKey="accountType"
          />
        )}
      </BaseCard>

      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getPaymentMethods}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payment Methods"
        currentTitle="Payment Methods"
      />
    </div>
  );
};

export default PaymentMethods;
