"use client";
import SimplifiedTable from "@/components/user-table/UserTable";
import React, { useState } from "react";
import { allClients } from "@/components/user-table/dummyData";
import AddUserDrawer from "@/components/user-table/AddUserFolder";

function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div>
      <SimplifiedTable
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        allClients={allClients}
      />
      <AddUserDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  );
}

export default Page;
