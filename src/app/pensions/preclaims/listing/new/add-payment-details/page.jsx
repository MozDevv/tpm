"use client";
import AddBankDetails from "@/components/pensionsComponents/preclaims/AddBankDetails";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

function page() {
  const searchParams = useSearchParams();

  //const token = searchParams.get("token");
  const id = searchParams.get("id");

  console.log("id", id);
  return (
    <div>
      <AddBankDetails id={id} />
    </div>
  );
}

export default page;
