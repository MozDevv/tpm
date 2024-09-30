import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import GeneralSettings from "@/components/pensionsComponents/setups/GeneralSetups/GeneralSettings";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Unnotified Retirees
      </div>
      <CustomBreadcrumbsList currentTitle="General Settings" />
      <GeneralSettings status={0} />
    </div>
  );
}

export default page;
