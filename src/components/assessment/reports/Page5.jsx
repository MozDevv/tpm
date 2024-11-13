'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const Page5Report = dynamic(() => import('./Page5Report'), {
  ssr: false,
});

function Page5({ setOpenGratuity, clickedItem }) {
  return (
    <div>
      <Page5Report
        setOpenGratuity={setOpenGratuity}
        clickedItem={clickedItem}
      />
    </div>
  );
}

export default Page5;
