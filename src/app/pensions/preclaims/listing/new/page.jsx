"use client";
import CustomBreadcrumbs from "@/components/CustomBreadcrumbs/CustomBreadcrumbs";
import NewPreclaim from "@/components/pensionsComponents/preclaims/NewPreclaim";
import { useSearchParams } from "next/navigation";
import React from "react";

function NewProspectivePensioner({ id }) {
  const searchParams = useSearchParams();
  const retireeId = searchParams.get("id");
  return (
    <div>
      <CustomBreadcrumbs currentStep={1} />
      <NewPreclaim retireeId={retireeId} />
    </div>
  );
}

export default NewProspectivePensioner;
