"use client";
import Approvals from "@/components/pensionsComponents/approvals/Approvals";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import Spinner from "@/components/spinner/Spinner";
import React from "react";

function page() {
  return (
    <div>
      <React.Suspense fallback={<Spinner />}>
        <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
          List of all Prospective pensioners awaiting approval
        </div>
        <Preclaims status={5} />
      </React.Suspense>
    </div>
  );
}

export default page;
