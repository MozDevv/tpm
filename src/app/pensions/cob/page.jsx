'use client';
import React from 'react';
import AssessmentTable from '@/components/assessment/assessmentDataCapture/AssessmentTable';

function page() {
  return (
    <div>
      <div className="ml-4">
        <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
          Controller of Budget
        </div>
        {/* <CustomBreadcrumbsList currentTitle="Controller of Budget" /> */}
      </div>
      <AssessmentTable status={6} />
    </div>
  );
}

export default page;
