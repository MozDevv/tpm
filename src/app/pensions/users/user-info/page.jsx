"use client";
import RecordCard from "@/components/pensionsComponents/recordCard/RecordCard";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function UserInfo() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div>
      <RecordCard id={id} />
    </div>
  );
}

export default UserInfo;
