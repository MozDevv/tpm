import MDAs from "@/components/pensionsComponents/setups/mdas/MDAs";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
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
