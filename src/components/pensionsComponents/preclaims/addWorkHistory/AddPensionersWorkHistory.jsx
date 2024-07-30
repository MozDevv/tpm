"use client";
import React, { Suspense, useState } from "react";
import PostAndNature from "./PostAndNature";
import PensionableSalary from "./PensionableSalary";
import PeriodsOfAbsence from "./PeriodsOfAbscence";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Close } from "@mui/icons-material";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";

function AddPensionersWorkHistory({ id, name, moveToNextTab }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleRedirect = () => {
    !name
      ? router.push(`/pensions/preclaims/listing/new/documents?id=${id}`)
      : router.push(`/pensions/preclaims/listing`);
  };

  const handlePrevious = () => {
    !name
      ? router.push(
          `/pensions/preclaims/listing/new/add-payment-details?id=${id}`
        )
      : router.push(`/pensions/preclaims/listing`);
  };

  const [retiree, setRetiree] = useState({});

  const [dateOfFirstAppointment, setDateOfFirstAppointment] = useState("");

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      const data = res?.data?.data[0]; // Get the retiree data

      setDateOfFirstAppointment(data.date_of_first_appointment);
      setRetiree(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2 w-full  max-h-[100vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-6 sticky top-0 bg-white z-10">
        <div></div>
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            sx={{ mb: 3, mt: 2 }}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            sx={{ mb: 3, mt: 2 }}
            onClick={moveToNextTab}
          >
            Next
          </Button>
        </div>
      </div>
      <hr className="border-[1px] border-black-900 my-2 w-full" />
      <div className="flex-1 overflow-y-auto pb-[200px] max-h-full">
        <Suspense fallback={<Spinner />}>
          <PostAndNature
            id={id}
            loading={loading}
            setLoading={setLoading}
            dateOfFirstAppointment={dateOfFirstAppointment}
          />
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
