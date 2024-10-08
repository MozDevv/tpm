import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import OperationsSetups from "@/components/pensionsComponents/setups/financeSetups/OperationsSetups";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-bold text-xl">
        Operation Setups
      </div>
      <CustomBreadcrumbsList currentTitle="Operations Setups" />
      <OperationsSetups />
    </div>
  );
}

export default page;
