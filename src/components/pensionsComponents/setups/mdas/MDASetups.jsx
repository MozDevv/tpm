import React, { useEffect } from "react";

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
    field: "employerType",
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
    field: "shortName",
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
      no: index + 1,
      code: item?.code,
      name: item?.name,
      employerType: item?.employer_type === 0 ? "Ministry" : "Department",
      description: item?.description,
      shortName: item?.short_name,
      pensionCapId: item?.pensionCap.id,
      id: item?.id,
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
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? "MDA" : "Create New MDA";

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
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createMDA}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createMDA}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
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
