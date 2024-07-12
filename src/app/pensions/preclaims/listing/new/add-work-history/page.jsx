"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

function AddWorkHistory() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  console.log("id", id);
  return <div></div>;
}

export default AddWorkHistory;
