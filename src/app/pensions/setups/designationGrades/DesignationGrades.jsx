"use client";
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
    hide: false,
  },

  {
    field: "name",
    headerName: "Designation Name",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "mda_name",
    headerName: "MDA Name",
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

const DesignationGrades = () => {
  const transformData = (data) => {
    return data.map((item, index) => ({
      mda_id: item?.mda_id,
      no: index + 1,
      id: item?.id,

      name: item?.name,
      employer_type: item?.mda?.employer_type === 0 ? "Ministry" : "Department",
      description: item?.mda?.description,
      mda_name: item?.mda?.name,
      short_name: item?.mda?.short_name,
      pension_cap_id: item?.pensionCap?.id,
      id: item?.id,
      pensionCap: item?.mda?.pensionCap?.name,
    }));
  };

  const [pensionCaps, setPensionCaps] = React.useState([]);

  const [mdas, setMdas] = React.useState([]);

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        "paging.pageSize": 1000,
      });
      if (res.status === 200) {
        setMdas(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []);

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

  const title = clickedItem ? "Designation" : "Create New Designation";

  const fields = [
    {
      name: "name",
      label: "Designation Name",
      type: "text",
      required: true,
    },
    {
      name: "mda_id",
      label: "MDA",
      type: "select",
      required: true,
      options: mdas.map((m) => ({
        id: m.id,
        name: m.name,
      })),
    },
    // {
    //   name: "mda_name",
    //   label: "MDA Name",
    //   type: "text",
    //   required: true,
    // },
    // {
    //   name: "description",
    //   label: "Description",
    //   type: "text",
    //   required: true,
    // },

    // {
    //   name: "employer_type",
    //   label: "Employee Type",
    //   type: "select",
    //   required: true,
    //   options: [
    //     { id: 0, name: "Ministry" },
    //     { id: 1, name: "Department" },
    //   ],
    // },

    // {
    //   name: "pensionCap",
    //   label: "Pension Cap",
    //   type: "select",
    //   options: pensionCaps.map((p) => ({
    //     id: p.id,
    //     name: p.name,
    //   })),
    // },
    // {
    //   name: "short_name",
    //   label: "Short Name",
    //   type: "text",
    //   required: true,
    // },
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
        deleteApiEndpoint={endpoints.deleteDesignation(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.editDesignation}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createDesignation}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getDesignations}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Designation & Grades"
        currentTitle="Designation & Grades"
      />
    </div>
  );
};

export default DesignationGrades;
