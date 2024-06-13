"use client";
import SimplifiedTable from "@/components/pensionsComponents/user-table/UserTable";
import React, { useState } from "react";
import { allClients } from "@/components/pensionsComponents/user-table/dummyData";

function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div>
      <SimplifiedTable
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        allClients={allClients}
      />
    </div>
  );
}

export default Page;
