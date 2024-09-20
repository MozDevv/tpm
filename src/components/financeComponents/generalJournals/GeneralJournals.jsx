"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";

import CountyCard from "@/components/pensionsComponents/setups/counties/CountyCard";
import GeneralJournalCard from "./GeneralJournalCard";
import financeEndpoints from "@/components/services/financeApi";
import { formatDate, parseDate } from "@/utils/dateFormatter";
import BaseAutoSaveInputCard from "../../baseComponents/BaseAutoSaveInputCard";

const columnDefs = [
  {
    headerName: "Document No",
    field: "documentNo",
    width: 90,
    pinned: "left", // Pinning to the left ensures it's the first column
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    headerName: "Document Type",
    field: "documentType",
    width: 100,
    valueFormatter: (params) => {
      const options = [
        { id: 0, name: "Payment Voucher" },
        { id: 1, name: "Purchase Invoice" },
        { id: 2, name: "Sales Invoice" },
        { id: 3, name: "Receipt" },
        { id: 4, name: "Purchase Credit Memo" },
        { id: 5, name: "Sales Credit Memo" },
        { id: 6, name: "Journal Voucher" },
      ];

      const selectedOption = options.find(
        (option) => params.value === option.id
      );
      return selectedOption ? selectedOption.name : "";
    },
  },

  {
    headerName: "External Document No",
    field: "externalDocumentNo",
    width: 150,
  },
  {
    headerName: "Posting Date",
    field: "postingDate",
    width: 150,
    valueFormatter: (params) => {
      return params.value ? parseDate(params.value) : "";
    },
  },
  {
    headerName: "VAT Date",
    field: "vatDate",
    width: 150,
    valueFormatter: (params) => {
      return params.value ? parseDate(params.value) : "";
    },
  },

  {
    headerName: "Amount",
    field: "amount",
    width: 150,
  },
];

const GeneralJournals = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      documentType: item.documentType,
      documentNo: item.documentNo,
      externalDocumentNo: item.externalDocumentNo,
      postingDate: item.postingDate,
      vatDate: item.vatDate,

      amount: item.amount,
      isPosted: item.isPosted,
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

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);

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
    createConstituency: () => {
      setDialogType("branch");
      setOpenAction(true);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? `${clickedItem.documentNo}`
    : "Create New General Journal";

  const fields = [
    {
      name: "documentType",
      label: "Document Type",
      type: "select",
      required: true,

      options: [
        { id: 0, name: "Payment Voucher" },
        { id: 1, name: "Purchase Invoice" },
        { id: 2, name: "Sales Invoice" },
        { id: 3, name: "Receipt" },
        { id: 4, name: "Purchase Credit Memo" },
        { id: 5, name: "Sales Credit Memo" },
        { id: 6, name: "Journal Voucher" },
      ],
    },
    {
      name: "documentNo",
      label: "Document No",
      type: "text",

      disabled: true,
    },
    {
      name: "externalDocumentNo",
      label: "External Document No",
      type: "text",
    },
    {
      name: "postingDate",
      label: "Posting Date",
      type: "date",
      required: true,
    },
    {
      name: "vatDate",
      label: "VAT Date",
      type: "date",
      required: true,
    },

    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [
        {
          id: "usd",
          name: "USD",
        },
        {
          id: "kes",
          name: "KES",
        },
        {
          id: "eur",
          name: "EUR",
        },
      ],
    },
    {
      name: "amount",
      label: "Amount",
      type: "amount",
    },
    {
      name: "isPosted",
      label: "Is Posted",
      type: "switch",
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
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
      >
        {clickedItem ? (
          <GeneralJournalCard
            fields={fields}
            apiEndpoint={financeEndpoints.editGeneralJournal}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            transformData={transformData}
          />
        ) : (
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
            useRequestBody={true}
            openBaseCard={openBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openAction={openAction}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getGeneralJournals}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Journals"
        currentTitle="General Journals"
      />
    </div>
  );
};

export default GeneralJournals;
