import ClaimInquiry from '@/components/CRM/ClaimInquiry';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import React from 'react';

function page() {
  return (
    <div className="mt-4">
      <div className="text-primary mt-5 ml-3 mb-5 font-bold text-xl">
        Claim Inquiry
      </div>
      <CustomBreadcrumbsList currentTitle="Claim Inquiry" />
      <ClaimInquiry />
    </div>
  );
}

export default page;
