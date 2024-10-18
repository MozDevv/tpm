'use client';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import Preclaims from '@/components/pensionsComponents/preclaims/Preclaims';
import React from 'react';

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3 mb-5 font-semibold text-xl">
        Scheduled Preclaims
      </div>
      <CustomBreadcrumbsList currentTitle="Scheduled Preclaims" />
      <Preclaims status={1} />
    </div>
  );
}

export default page;
