import Complaints from '@/components/CRM/Complaints';
import Tickets from '@/components/CRM/Tickets';
import React from 'react';

function page() {
  return (
    <div>
      <Tickets status={0} />
    </div>
  );
}

export default page;
