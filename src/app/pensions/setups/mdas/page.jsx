"use client";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
import MDAs from "@/components/pensionsComponents/setups/mdas/Mdas";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <MDAs />
      </div>
    </React.Suspense>
  );
}

export default page;
