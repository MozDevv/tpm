import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
    hide: true,
  },
  {
    field: "code",
    headerName: "Code",
    headerClass: "prefix-header",
    width: 200,
    filter: true,
  },
  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "employer_type",
    headerName: "Employer Type",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "short_name",
    headerName: "Short Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "pensionCap",
    headerName: "Pension Cap",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const MDASetups = () => {
  const transformData = (data) => {
    return data.map((item, index) => ({
      mda_id: item?.id,
      no: index + 1,
      code: item?.code,
      name: item?.name,
      employer_type: item?.employer_type === 0 ? "Ministry" : "Department",
      description: item?.description,
      short_name: item?.short_name,
      pension_cap_id: item?.pensionCap.id,
      id: item?.id,
      bank_account_name: item?.bank_account_name,
      bank_account_number: item?.bank_account_number,
      bank_branch_id: item?.bankBranch?.id,
      bank_id: item?.bankBranch?.bank_id,
      pensionCap: item?.pensionCap.name,
    }));
  };

  const [pensionCaps, setPensionCaps] = React.useState([]);

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps);
      if (res.status === 200) {
        setPensionCaps(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);

  const title = clickedItem ? "MDA" : "Create New MDA";

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks, {
        "paging.pageSize": 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log("Error fetching banks and branches:", error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  useEffect(() => {
    if (clickedItem) {
      setSelectedBank(clickedItem.bank_id);
    }
  }, [clickedItem]);

  const [selectedBank, setSelectedBank] = React.useState(null);

  const fields = [
    { name: "code", label: "Code", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },

    {
      name: "employer_type",
      label: "Employee Type",
      type: "select",
      required: true,
      options: [
        { id: 0, name: "Ministry" },
        { id: 1, name: "Department" },
      ],
    },

    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "pension_cap_id",
      label: "Pension Cap",
      type: "select",
      options: pensionCaps.map((p) => ({
        id: p.id,
        name: p.name,
      })),
    },
    {
      name: "short_name",
      label: "Short Name",
      type: "text",
      required: true,
    },
    {
      name: "bank_id",
      label: "Bank",
      type: "autocomplete",
      options: banks,
    },
    {
      name: "bank_branch_id",
      label: "Bank Branch",
      options: branches.filter((branch) => branch.bankId === selectedBank),
      type: "select",
    },
    {
      name: "bank_account_name",
      label: "Bank Account Name",
      type: "text",
    },
    {
      name: "bank_account_number",
      label: "Bank Account Number",
      type: "text",
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
        deleteApiEndpoint={endpoints.deleteMDA(clickedItem?.mda_id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateMDA}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            setSelectedBank={setSelectedBank}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createMDA}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
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
        fetchApiEndpoint={endpoints.mdas}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="MDAs"
        currentTitle="MDAs"
      />
    </div>
  );
};

export default MDASetups;
