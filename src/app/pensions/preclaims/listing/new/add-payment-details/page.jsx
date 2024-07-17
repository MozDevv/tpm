"use client";
import CustomBreadcrumbs from "@/components/CustomBreadcrumbs/CustomBreadcrumbs";
import AddBankDetails from "@/components/pensionsComponents/preclaims/AddBankDetails";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

function PaymentDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const currentStep = 2; // Example: current step is 2

  console.log("id", id);
  return (
    <div className="mt-5">
      <CustomBreadcrumbs currentStep={currentStep} />
      <AddBankDetails id={id} />
    </div>
  );
}

export default PaymentDetails;
