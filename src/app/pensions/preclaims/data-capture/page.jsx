import DataCapture from "@/components/pensionsComponents/dataCapture/DataCapture";
import RecordCard from "@/components/pensionsComponents/recordCard/RecordCard";
import React from "react";

function page() {
  return (
    <div className="mt-3 ">
      <div className="text-[23px] font-semibold text-primary ml-1 p-3">
        Pre-Claim Data Capture
      </div>
      <DataCapture />
    </div>
  );
}

export default page;
