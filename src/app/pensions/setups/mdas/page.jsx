"use client";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
import MDASetups from "@/components/pensionsComponents/setups/mdas/MDASetups";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <MDASetups />
      </div>
    </React.Suspense>
  );
}

export default page;
