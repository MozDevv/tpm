import BatchContributions from '@/components/contributions/BatchContributions';
import MemberContributions from '@/components/contributions/MemberContributions';
import React from 'react';

function page() {
  return (
    <div>
      <BatchContributions status={1} />
    </div>
  );
}

export default page;
