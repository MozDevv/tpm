"use client";
import RecordCard from "@/components/pensionsComponents/recordCard/RecordCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const { id } = params;

  return (
    <div>
      <RecordCard id={id} />
    </div>
  );
}

export default page;
