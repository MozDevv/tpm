"use client";
import Spinner from "@/components/financeComponents/spinner/Spinner";
import Preclaims from "@/components/pensionsComponents/preclaims/Preclaims";
import React, { useState } from "react";

function page() {
  // const [loading, setLoading] = useState(false);
  return (
    <div>
      <Preclaims />
    </div>
  );
}

export default page;
