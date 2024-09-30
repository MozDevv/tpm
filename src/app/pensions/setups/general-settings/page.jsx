import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import GeneralSettings from "@/components/pensionsComponents/setups/GeneralSetups/GeneralSettings";
import React from "react";

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-bold text-xl">
        General Settings
      </div>
      <CustomBreadcrumbsList currentTitle="General Settings" />
      <GeneralSettings status={0} />
    </div>
  );
}

export default page;
