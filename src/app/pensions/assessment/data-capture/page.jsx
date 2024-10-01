import AssessmentTable from "@/components/assessment/assessmentDataCapture/AssessmentTable";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import ClaimsTable from "@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable";
import React from "react";

function page() {
  return (
    <div>
      <div className="ml-4">
        <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
          Assessment Data Capture
        </div>
        <CustomBreadcrumbsList currentTitle="Assessment Data Capture" />
      </div>
      <ClaimsTable status={3} />
    </div>
  );
}

export default page;
