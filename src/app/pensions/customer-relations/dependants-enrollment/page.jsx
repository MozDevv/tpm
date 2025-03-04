'use client';
import DependantsEnrollment from '@/components/CRM/DependantsEnrollment';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import React from 'react';

function page() {
  return (
    <div>
      <div className="text-primary mt-5 ml-3  font-bold text-xl">
        Dependants Enrollment
      </div>
      <CustomBreadcrumbsList />
      <div className="ml-3 mt-5">
        <DependantsEnrollment />
      </div>
    </div>
  );
}

export default page;
