"use client";
import CustomBreadcrumbs from "@/components/CustomBreadcrumbs/CustomBreadcrumbs";
import NewPreclaim from "@/components/pensionsComponents/preclaims/NewPreclaim";
import React from "react";

function page() {
  return (
    <div>
      <CustomBreadcrumbs currentStep={1} />
      <NewPreclaim />
    </div>
  );
}

export default page;
