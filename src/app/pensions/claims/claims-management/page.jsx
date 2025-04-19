'use client';
import React from 'react';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import ClaimsTable from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';

function page() {
  return (
    <div>
      <div className="ml-4">
        <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
          Claims Management
        </div>
        {/* <CustomBreadcrumbsList currentTitle="Claims Management" /> */}
      </div>
      <ClaimsTable />
    </div>
  );
}

export default page;
