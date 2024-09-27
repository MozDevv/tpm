"use client";
import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";

const Approvers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiService.get(endpoints.getUsers);
        const data = res.data.data.map((item) => ({
          id: item.id,
          name: item.email,
        }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsers();
  }, []);

  const columnDefs = [
    {
      field: "primary_approver_id",
      headerName: "Primary Approver",
      headerClass: "prefix-header",
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || "N/A";
      },
    },
    {
      field: "secondary_approver_id",
      headerName: "Secondary Approver",
      headerClass: "prefix-header",
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || "N/A";
      },
    },
    {
      field: "direct_approver_id",
      headerName: "Direct Approver",
      headerClass: "prefix-header",
      filter: true,
      valueFormatter: (params) => {
        const user = users.find((user) => user.id === params.value);
        return user?.name || "N/A";
      },
    },
  ];
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
      id: item.id,
      primary_approver_id: item.primary_approver_id,
      secondary_approver_id: item.secondary_approver_id,
      direct_approver_id: item.direct_approver_id,
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

  const title = clickedItem ? "Approver" : "Create a New Approver";

  const fields = [
    {
      name: "primary_approver_id",
      label: "Primary Approver",
      type: "autocomplete",
      options: users,
    },

    {
      name: "secondary_approver_id",
      label: "Secondary Approver",
      type: "autocomplete",
      options: users,
    },

    {
      name: "direct_approver_id",
      label: "Direct Approver",
      type: "autocomplete",
      options: users,
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
        deleteApiEndpoint={endpoints.deleteApprovalUser(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateApprovalUser}
            postApiFunction={apiService.put}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createApprovalUser}
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
        fetchApiEndpoint={endpoints.getApprovalUsers}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Approvers"
        currentTitle="Approvers"
      />
    </div>
  );
};

export default Approvers;
