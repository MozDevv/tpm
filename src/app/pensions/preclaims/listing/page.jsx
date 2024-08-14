"use client";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import Spinner from "@/components/financeComponents/spinner/Spinner";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React, { useState } from "react";

function page() {
  // const [loading, setLoading] = useState(false);
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Retiree Listi
      </div>
      <CustomBreadcrumbsList currentTitle="Retirees List" />
      <Preclaims />
    </div>
  );
}

export default page;
