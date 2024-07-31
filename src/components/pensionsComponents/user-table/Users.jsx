import React from "react";

import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import { Person } from "@mui/icons-material";
// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";
import UserDetails from "./UserDetails";
import NewUserCard from "../recordCard/NewUserCard";
import RecordCard from "../recordCard/RecordCard";

const columnDefs = [
  { field: "no", headerName: "No", width: 90, filter: true },
  { field: "userName", headerName: "Email", filter: true, width: 200 },
  {
    field: "employeeNumber",
    headerName: "Employee Number",
    filter: true,
    width: 150,
  },
  { field: "email", headerName: "Email", filter: true, width: 250, hide: true },
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
      userName: item.userName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      roleId: item.roleId,
      employeeNumber: item.employeeNumber,
      defaultPasswordChanged: item.defaultPasswordChanged ? "Yes" : "No",
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    openInExcel: () => console.log("Export to Excel clicked"),
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

  const title = clickedItem ? "User Details" : "Create New User";

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
          <RecordCard id={clickedItem.id} />
        ) : (
          <NewUserCard setOpenBaseCard={setOpenBaseCard} />
        )}
      </BaseCard>
      <BaseTable
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiService={AuthApiService.get}
        fetchApiEndpoint={authEndpoints.getUsers}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="User Management"
        currentTitle="Manage Users"
      />
    </div>
  );
};

export default Users;
