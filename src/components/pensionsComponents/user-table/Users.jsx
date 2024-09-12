import React, { useEffect } from "react";

import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import { Person } from "@mui/icons-material";
// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";
import UserDetails from "./UserDetails";
import NewUserCard from "../recordCard/NewUserCard";
import RecordCard from "../recordCard/RecordCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

const columnDefs = [
  { field: "no", headerName: "No", width: 90, filter: true },
  { field: "email", headerName: "Email", filter: true, width: 150, hide: true },
  { field: "firstName", headerName: "First Name", filter: true, width: 150 },
  { field: "lastName", headerName: "Last Name", filter: true, width: 150 },
  {
    field: "employeeNumber",
    headerName: "Employee Number",
    filter: true,
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    filter: true,
    width: 250,
    hide: false,
  },
  {
    field: "idNumber",
    headerName: "ID Number",
    filter: true,
    width: 150,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    filter: true,
    width: 150,
  },
  {
    field: "roleId",
    headerName: "Role ID",
    filter: true,
    width: 250,
    hide: true,
  },
  {
    field: "defaultPasswordChanged",
    headerName: "Default Password Changed",
    filter: true,
    width: 200,
  },
];

const Users = () => {
  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      idNumber: item.idNumber,
      roleId: item.roles,
      employeeNumber: item.employeeNumber,
      defaultPasswordChanged: item.defaultPasswordChanged,
      lockoutEnabled: item.lockoutEnabled,
      departmentId: item.departmentId,
      roleId: item.roleId,
      emailConfirmed: item.emailConfirmed,
      mdaId: item.mdaId,
      phoneNumberConfirmed: item.phoneNumberConfirmed,
      twoFactorEnabled: item.twoFactorEnabled,
      lockoutEnd: item.lockoutEnd,
      defaultPasswordGracePeriod: item.defaultPasswordGracePeriod,
    }));
  };

  const [editUser, setEditUser] = React.useState(false);

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("first edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => console.log("Notify clicked"),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => {
      setEditUser(true);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [departments, setDepartments] = React.useState([]);

  const [refreshData, setRefreshData] = React.useState(false);
  const [mdas, setMdas] = React.useState([]);

  const pageNumber = 1;
  const pageSize = 12;

  const [roles, setRoles] = React.useState([]);
  const title = clickedItem ? "User Details" : "Create New User";

  const fields = [
    {
      name: "employeeNumber",
      label: "Employee Number",
      type: "text",
      required: true,
    },

    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "idNumber",
      label: "ID Number",
      type: "text",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      required: true,
    },
    {
      name: "roleId",
      label: "Role",
      type: "select",
      required: true,
      options: roles.map((r) => ({ id: r.roleId, name: r.name })),
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
    {
      name: "mdaId",
      label: "MDA",
      type: "select",
      default: "N/A",
      disabled: false,
      options: mdas.map((m) => ({
        id: m.id,
        name: m.name,
      })),
    },

    {
      name: "lockoutEnabled",
      label: "Lockout Enabled",
      type: "switch",
      // required: true,
    },
    {
      name: "lockoutEnd",
      label: "Lockout End",
      type: "datetime-local",
      // required: true,
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

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles, {
        paging: { pageNumber, pageSize },
      });
      const { data, totalCount } = res.data;

      console.log("Roles", data);
      setRoles(data);
      //set setTotalRecords(totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
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
        isUserComponent={true}
      >
        {clickedItem ? (
          // <RecordCard id={clickedItem.id} editUser={editUser} />
          <>
            <BaseInputCard
              setRefreshData={setRefreshData}
              fields={fields}
              apiEndpoint={authEndpoints.updateUser(clickedItem.id)}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={false}
            />
          </>
        ) : (
          <NewUserCard setOpenBaseCard={setOpenBaseCard} />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        refreshData={refreshData}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiService={AuthApiService.get}
        fetchApiEndpoint={authEndpoints.getUsers}
        transformData={transformData}
        //pageSize={30}
        handlers={handlers}
        breadcrumbTitle="User Management"
        currentTitle="Manage Users"
      />
    </div>
  );
};

export default Users;
