import AssessmentTable from '@/components/assessment/assessmentDataCapture/AssessmentTable';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import React from 'react';

function page() {
  return (
    <div>
      <div className="ml-4">
        <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
          Assessment Approvals
        </div>
        <CustomBreadcrumbsList currentTitle="Assessment Approval" />
      </div>
      <AssessmentTable status={4} />
    </div>
  );
}

export default page;
