import DocumentTypes from "@/components/pensionsComponents/setups/documentTypes/DocumentTypes";
import React from "react";
import Spinner from "@/components/spinner/Spinner";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <DocumentTypes />
      </div>
    </React.Suspense>
  );
}

export default page;
