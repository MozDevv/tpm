"use client";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
import Mdas from "@/components/pensionsComponents/setups/mdas/Mdas";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <Mdas />
      </div>
    </React.Suspense>
  );
}

export default page;
