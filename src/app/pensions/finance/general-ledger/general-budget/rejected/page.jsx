import GeneralBudget from '@/components/financeComponents/generalLedger/generalBudget/GeneralBudget';
import React from 'react';

function page() {
  return (
    <div>
      <GeneralBudget status={4} />
    </div>
  );
}

export default page;
