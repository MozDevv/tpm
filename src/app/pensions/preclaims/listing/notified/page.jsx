"use client";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Notified Retirees
      </div>
      <CustomBreadcrumbsList currentTitle="Notified Retirees" />
      <Preclaims status={2} />
    </div>
  );
}

export default page;
