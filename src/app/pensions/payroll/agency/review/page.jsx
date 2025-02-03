import MainPayroll from '@/components/payrollComponents/payrollRun/MainPayroll';
import React from 'react';

function page() {
  /**{
    Main,
    Injury,
    Dependent,
    Agency
} */
  /**
 * {
    OPEN,
    PENDING_APPROVAL,
    REVIEW,
    CLOSED
}
 */
  return (
    <div>
      <MainPayroll stage={3} status={2} />
    </div>
  );
}

export default page;
