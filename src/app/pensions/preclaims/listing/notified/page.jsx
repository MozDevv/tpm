"use client";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        List of all Notified Prospective pensioners
      </div>
      <Preclaims status={2} />
    </div>
  );
}

export default page;
