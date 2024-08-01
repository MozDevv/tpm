import React, { useEffect, useState } from "react";

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
  },

  {
    field: "name",
    headerName: "Name",
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
    field: "created_date",
    headerName: "Created Date",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "roles",
    headerName: "Roles",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
    hide: true,
  },
];

const Roles = () => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1 + (pageNumber - 1) * pageSize,
      name: item.name,
      description: transformString(item.description),
      created_date: item.created_date,
      roles: item.roles,
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

  const title = clickedItem ? "Role" : "Create a New Role";

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "departmentId",
      label: "Select Department",
      type: "select",
      required: true,
      options: departments.map((d) => ({
        id: d.departmentId,
        name: d.name,
      })),
    },
  ];

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

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
            apiEndpoint={endpoints.createRole}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createRole}
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
        fetchApiEndpoint={endpoints.getRoles}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Roles Setups"
        currentTitle="Roles Setups"
      />
    </div>
  );
};

export default Roles;
