"use client";
import React, { Suspense, useState } from "react";
import PostAndNature from "./PostAndNature";
import PensionableSalary from "./PensionableSalary";
import PeriodsOfAbsence from "./PeriodsOfAbscence";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function AddPensionersWorkHistory({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulate loading state with setTimeout
  setTimeout(() => {
    setLoading(false);
  }, 2000); // Adjust timeout as per your actual async calls

  return (
    <div className="p-2 w-full">
      <div className="w-[100%]  flex justify-between items-center px-6">
        <p className="text-primary font-semibold text-xl "></p>
        <div className="">
          <Button
            variant="contained"
            sx={{
              mr: "auto",
              mb: 3,
              mt: 2,
            }}
            onClick={() => router.push("/pensions/preclaims/listing")}
          >
            Proceed
          </Button>
        </div>
      </div>
      <hr className="border-[1px] border-black-900 my-2" />
      <div className="container">
        <Suspense fallback={<Spinner />}>
          <PostAndNature id={id} />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <PensionableSalary id={id} />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <PeriodsOfAbsence id={id} />
        </Suspense>
      </div>
    </div>
  );
}

export default AddPensionersWorkHistory;
