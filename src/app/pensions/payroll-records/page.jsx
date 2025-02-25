'use client';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import Spinner from '@/components/spinner/Spinner';
import { Box, Button, Typography } from '@mui/material';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import Claims from '@/components/pensionsComponents/preclaims/Claims';
import ClaimsTable from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';
import AssessmentTable from '@/components/assessment/assessmentDataCapture/AssessmentTable';
import PayrollRecords from '@/components/financeComponents/payrollRecords.jsx/PayrollRecords';

function page() {
  return (
    <div>
      <PayrollRecords />
    </div>
  );
}

export default page;
