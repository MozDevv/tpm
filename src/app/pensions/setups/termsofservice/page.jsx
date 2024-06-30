import TermsOfService from "@/components/pensionsComponents/setups/termsOfService/TermsOfService";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <TermsOfService />
      </div>
    </React.Suspense>
  );
}

export default page;
