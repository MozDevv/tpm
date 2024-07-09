"use client";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Submitted Prospective pensioners{" "}
      </div>
      <Preclaims status={3} />
    </div>
  );
}

export default page;
