import PensionAwards from "@/components/pensionsComponents/setups/pensionAwards/PensionAwards";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
import PensionAwards2 from "@/components/pensionsComponents/setups/pensionAwards/PensionAwards copy";
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
