'use client';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import Spinner from '@/components/spinner/Spinner';
import { Box, Button, Typography } from '@mui/material';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import Claims from '@/components/pensionsComponents/preclaims/Claims';
import ClaimsTable from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';
import AssessmentTable from '@/components/assessment/assessmentDataCapture/AssessmentTable';

function page() {
  return (
    <div>
      <div className="ml-4">
        <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
          Claim Records List
        </div>
        {/* <CustomBreadcrumbsList currentTitle="Controller of Budget" /> */}
      </div>
      <AssessmentTable status={7} />
    </div>
  );
}

export default page;
