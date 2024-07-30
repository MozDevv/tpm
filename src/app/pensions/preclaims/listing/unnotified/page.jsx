"use client";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Unnotified Retirees
      </div>
      <CustomBreadcrumbsList currentTitle="Unnotified Retirees" />
      <Preclaims status={0} />
    </div>
  );
}

export default page;
