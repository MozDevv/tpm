import Payments from '@/components/financeComponents/payments/Payments';
import ScheduledPayments from '@/components/financeComponents/payments/scheduledPayments/ScheduledPayments';
import React from 'react';

function page() {
  return (
    <div>
      <ScheduledPayments status={2} />
    </div>
  );
}

export default page;
