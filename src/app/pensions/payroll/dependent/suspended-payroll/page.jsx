import MainPayroll from '@/components/payrollComponents/payrollRun/MainPayroll';
import SuspendedPayroll from '@/components/payrollComponents/payrollRun/SuspendedPayroll';
import React from 'react';

function page() {
  return (
    <div>
      <SuspendedPayroll />
    </div>
  );
}

export default page;
