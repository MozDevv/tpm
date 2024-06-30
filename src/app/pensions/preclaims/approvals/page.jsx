"use client";
import Approvals from "@/components/pensionsComponents/approvals/Approvals";
import Spinner from "@/components/spinner/Spinner";
import React from "react";

function page() {
  return (
    <div>
      <React.Suspense fallback={<Spinner />}>
        <Approvals />
      </React.Suspense>
    </div>
  );
}

export default page;
