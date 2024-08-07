import PensionAwards from "@/components/pensionsComponents/setups/pensionAwards/PensionAwards";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <PensionAwards />
      </div>
    </React.Suspense>
  );
}

export default page;
