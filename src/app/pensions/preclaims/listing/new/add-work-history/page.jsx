"use client";
import CustomBreadcrumbs from "@/components/CustomBreadcrumbs/CustomBreadcrumbs";
import AddPensionersWorkHistory from "@/components/pensionsComponents/preclaims/addWorkHistory/AddPensionersWorkHistory";
import { useSearchParams } from "next/navigation";
import React from "react";

function AddWorkHistory() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const name = searchParams.get("name");

  console.log("id", id);
  return (
    <div>
      <CustomBreadcrumbs currentStep={3} />
      <AddPensionersWorkHistory id={id} name={name} />
    </div>
  );
}

export default AddWorkHistory;
