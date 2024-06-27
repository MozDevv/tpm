import PensionCaps from "@/components/pensionsComponents/setups/pensionCaps/PensionCaps";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <PensionCaps />
      </div>
    </React.Suspense>
  );
}

export default page;
