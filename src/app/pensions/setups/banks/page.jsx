import React from "react";
import Banks from "@/components/pensionsComponents/setups/banks/Banks";
import Spinner from "@/components/spinner/Spinner";
function page() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <Banks />
      </div>
    </React.Suspense>
  );
}

export default page;
