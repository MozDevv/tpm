"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import { apiService } from "@/components/services/financeApi";

import financeEndpoints from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";

import PaymentsCard from "./PaymentsCard";
import BaseAutoSaveInputCard from "@/components/baseComponents/BaseAutoSaveInputCard";

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [bankAccounts, setBankAccounts] = React.useState([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await apiService.get(financeEndpoints.getPaymentMethods, {
          "paging.pageSize": 2000,
        });
        if (res.status === 200) {
          setPaymentMethods(
            res.data.data.map((meth) => {
              return {
                id: meth.id,
                name: meth.code,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBankAccounts = async () => {
      try {
        const res = await apiService.get(financeEndpoints.getBankAccounts, {
          "paging.pageSize": 2000,
        });
        if (res.status === 200) {
          setBankAccounts(
            res.data.data.map((acc) => {
              return {
                id: acc.id,
                name: acc.bankAccountName,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPaymentMethods();
    fetchBankAccounts();
  }, []);

  const columnDefs = [
    {
      headerName: "Payment Voucher No",
      field: "documentNo",
      flex: 1,
      pinned: "left",
    },
    {
      headerName: "Payee",
      field: "payee",
      flex: 1,
    },
    {
      headerName: "On Behalf Of",
      field: "onBehalfOf",
      flex: 1,
    },

    {
      headerName: "Payment Method",
      field: "paymentMethodId",
      flex: 1,
      valueFormatter: (params) => {
        const paymentMethod = paymentMethods.find(
          (method) => method.id === params.value
        );
        return paymentMethod ? paymentMethod.name : "";
      },
    },
    {
      headerName: "Bank Account",
      field: "bankAccountId",
      flex: 1,
      valueFormatter: (params) => {
        const bankAccount = bankAccounts.find(
          (account) => account.id === params.value
        );
        return bankAccount ? bankAccount.name : "";
      },
    },
    {
      headerName: "Narration",
      field: "narration",
      flex: 1,
    },
    {
      headerName: "Is Posted",
      field: "isPosted",
      flex: 1,
    },
    {
      headerName: "Posting Date",
      field: "postingDate",
      flex: 1,
      valueFormatter: (params) => {
        return formatDate(params.value);
      },
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      payee: item.payee,
      postingDate: item.postingDate,
      onBehalfOf: item.onBehalfOf,
      bankAccountId: item.bankAccountId,
      paymentMethodId: item.paymentMethodId,
      narration: item.narration,
      isPosted: item.isPosted,
      documentNo: item.documentNo,
    }));
  };

  const [openPostToGL, setOpenPostToGL] = React.useState(false);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const handlers = {
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
  const [clickedItem, setClickedItem] = React.useState(null);

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

  const title = clickedItem
    ? `${clickedItem.documentNo} `
    : "Create New Payment";

  const fields = [
    {
      name: "documentNo",
      label: "Payment Voucher No",
      type: "text",
      required: false,
      disabled: true,
    },
    {
      name: "payee",
      label: "Payee",
      type: "text",
      required: true,
    },

    {
      name: "onBehalfOf",
      label: "On Behalf Of",
      type: "text",
      required: true,
    },
    {
      name: "paymentMethodId",
      label: "Payment Method",
      type: "select",
      options: paymentMethods,
      required: true,
    },
    {
      name: "bankAccountId",
      label: "Bank Account",
      type: "select",
      required: true,
      options: bankAccounts,
    },

    {
      name: "postingDate",
      label: "Posting Date",
      type: "date",
      required: true,
    },
    {
      name: "narration",
      label: "Narration",
      type: "text",
      required: false,
    },
    {
      name: "isPosted",
      label: "Is Posted",
      type: "switch",
      required: false,
    },
  ];

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionChange = (selectedRows) => {
    console.log("Selected rows in ParentComponent:", selectedRows);
    setSelectedRows(selectedRows);
  };

  return (
    <div className="">
      {/* {JSON.stringify(selectedRows)} */}

      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        isUserComponent={false}
        setOpenAction={setOpenAction}
        openAction={openAction}
        useRequestBody={true}
        dialogType={dialogType}
      >
        {clickedItem ? (
          <PaymentsCard
            fields={fields}
            apiEndpoint={financeEndpoints.updatePayment}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            setClickedItem={setClickedItem}
            transformData={transformData}
          />
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addPayment}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updatePayment}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getPaymentById}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
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
        fetchApiEndpoint={financeEndpoints.getPayments}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payments"
        currentTitle="Payments"
      />
    </div>
  );
};

export default Payments;
