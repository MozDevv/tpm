"use client";
import React, { useStae, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";

import { parseDate } from "@/utils/dateFormatter";
import { name } from "dayjs/locale/en-au";
import BaseCollapse from "@/components/baseComponents/BaseCollapse";
import financeEndpoints, { apiService } from "@/components/services/financeApi";

const OperationsSetups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [awardPostingGroups, setAwardPostingGroups] = React.useState([]);
  const [bankPostingGroups, setBankPostingGroups] = React.useState([]);
  const [generalPostingGroups, setGeneralPostingGroups] = React.useState([]);
  const [vendorPostingGroups, setVendorPostingGroups] = React.useState([]);
  const [customerPostingGroups, setCustomerPostingGroups] = React.useState([]);
  const [vatPostingGroups, setVatPostingGroups] = React.useState([]);
  const [paymentMethods, setPaymentMethods] = React.useState([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await apiService.get(financeEndpoints.getBankAccounts);
        setBankAccounts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAwardPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getAwardPostingGroups
        );
        setAwardPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBankPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getBankPostingGroups
        );
        setBankPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchGeneralPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getGeneralPostingGroups
        );
        setGeneralPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchVendorPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getVendorPostingGroups
        );
        setVendorPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCustomerPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getCustomerPostingGroup
        );
        setCustomerPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchVatPostingGroups = async () => {
      try {
        const response = await apiService.get(financeEndpoints.getVatSetups);
        setVatPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPaymentMethods = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getPaymentMethods
        );
        setPaymentMethods(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBankAccounts();
    fetchAwardPostingGroups();
    fetchBankPostingGroups();
    fetchGeneralPostingGroups();
    fetchVendorPostingGroups();
    fetchCustomerPostingGroups();
    fetchVatPostingGroups();
    fetchPaymentMethods();
  }, []);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      defaultBankAccount: item.defaultBankAccount,
      defaultAwardPostingGroup: item.defaultAwardPostingGroup,
      defaultBankPostingGroup: item.defaultBankPostingGroup,
      defaultGeneralPostingGroup: item.defaultGeneralPostingGroup,
      defaultVendorPostingGroup: item.defaultVendorPostingGroup,
      defaultCustomerPostingGroup: item.defaultCustomerPostingGroup,
      defaultVatPostingGroup: item.defaultVatPostingGroup,
      defaultPaymentMethod: item.defaultPaymentMethod,
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

  const title = clickedItem ? "Department" : "Create New Department";

  const fields = [
    {
      name: "defaultBankAccount",
      label: "Default Bank Account",
      type: "select",
      options: bankAccounts.map((b) => {
        return {
          id: b.id,
          name: b.bankAccountName,
        };
      }),
      required: true,
    },
    {
      name: "defaultAwardPostingGroup",
      label: "Default Award Posting Group",
      type: "select",
      options: awardPostingGroups.map((a) => {
        return {
          id: a.id,
          name: a.code,
        };
      }),
      required: true,
    },
    {
      name: "defaultBankPostingGroup",
      label: "Default Bank Posting Group",
      type: "select",
      options: bankPostingGroups.map((b) => {
        return {
          id: b.id,
          name: b.groupName,
        };
      }),
      required: true,
    },
    {
      name: "defaultGeneralPostingGroup",
      label: "Default General Posting Group",
      type: "select",
      options: generalPostingGroups.map((g) => {
        return {
          id: g.id,
          name: g.description,
        };
      }),
      required: true,
    },
    {
      name: "defaultVendorPostingGroup",
      label: "Default Vendor Posting Group",
      type: "select",
      options: vendorPostingGroups.map((v) => {
        return {
          id: v.id,
          name: v.groupName,
        };
      }),
      required: true,
    },
    {
      name: "defaultCustomerPostingGroup",
      label: "Default Customer Posting Group",
      type: "select",
      options: customerPostingGroups.map((c) => {
        return {
          id: c.id,
          name: c.description,
        };
      }),
      required: true,
    },
    {
      name: "defaultVatPostingGroup",
      label: "Default VAT Posting Group",
      type: "select",
      options: vatPostingGroups.map((v) => {
        return {
          id: v.id,
          name: v.description,
        };
      }),
      required: true,
    },
    {
      name: "defaultPaymentMethod",
      label: "Default Payment Method",
      type: "select",
      options: paymentMethods.map((p) => {
        return {
          id: p.id,
          name: p.code,
        };
      }),
      required: true,
    },
  ];

  const fetchGeneralSettings = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getOperationSetups
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGeneralSettings().then((data) => {
      const data2 = transformData(data);
      setClickedItem(data2[0]);
    });
  }, []);

  return (
    <div className="bg-white mt-8 px-5">
      {/* <BaseCollapse
        name="General Settings"
        openSections={openSections}
        handleToggleSection={handleToggleSection}
      > */}
      <BaseInputCard
        fields={fields}
        apiEndpoint={
          clickedItem
            ? financeEndpoints.updateOperationSetup
            : financeEndpoints.addOperationSetup
        }
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        useRequestBody={true}
        setOpenBaseCard={setOpenBaseCard}
      />
      {/* </BaseCollapse> */}
    </div>
  );
};

export default OperationsSetups;
