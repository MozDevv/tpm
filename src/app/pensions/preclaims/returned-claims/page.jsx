"use client";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import ReturnedClaims from "@/components/pensionsComponents/preclaims/returnedClaims/ReturnedClaims";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        List of all Returned Claims
      </div>
      <Preclaims status={7} />
    </div>
  );
}

export default page;
