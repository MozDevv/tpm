'use client';
import React, { Suspense, useEffect, useState } from 'react';

import PensionableSalary from './PensionableSalary';
import PeriodsOfAbsence from './PeriodsOfAbscence';
import Spinner from '@/components/spinner/Spinner';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Close } from '@mui/icons-material';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import MixedServicePost from './MixedServicePost';
import { useMda } from '@/context/MdaContext';
import PostAndNature from './PostAndNature copy';

function AddPensionersWorkHistory({
  id,
  name,
  moveToNextTab,
  status,
  moveToPreviousTab,
  clickedItem,
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleRedirect = () => {
    !name
      ? router.push(`/pensions/preclaims/listing/new/documents?id=${id}`)
      : router.push(`/pensions/preclaims/listing`);
  };

  const handlePrevious = () => {
    moveToPreviousTab();
  };

  const [retiree, setRetiree] = useState({});

  const [dateOfFirstAppointment, setDateOfFirstAppointment] = useState('');
  const [pensionAward, setPensionAward] = useState(false);

  const { activePensionCap, activeCapName } = useMda('');

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      const data = res?.data?.data[0]; // Get the retiree data
      setPensionAward(res.data.data[0]?.pensionAward?.name === 'MIXED SERVICE');

      console.log('pensionAward', pensionAward);
      setDateOfFirstAppointment(data.date_of_first_appointment);

      setRetiree(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRetiree();
  }, []);

  return (
    <div className="p-2 w-full  max-h-[100vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-6 sticky top-0 bg-white z-10">
        <div></div>
        {/* <div className="flex items-center gap-4">
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
        </div> */}
      </div>

      <div className="flex-1 overflow-y-auto pb-[200px] max-h-[90vh]">
        <Suspense fallback={<Spinner />}>
          {pensionAward ? (
            <MixedServicePost
              status={status}
              id={id}
              loading={loading}
              setLoading={setLoading}
              dateOfFirstAppointment={dateOfFirstAppointment}
              mixedService={true}
            />
          ) : (
            // ) : activeCapName === "APN/PK" ||
            //   activeCapName === "CAP196" ||
            //   activeCapName === "DSO/RK" ? (
            //   <MixedServicePost
            //     status={status}
            //     id={id}
            //     loading={loading}
            //     setLoading={setLoading}
            //     dateOfFirstAppointment={dateOfFirstAppointment}
            //     isParliamentarian={true}
            //   />
            <PostAndNature
              id={id}
              status={status}
              clickedItem={retiree}
              loading={loading}
              setLoading={setLoading}
              dateOfFirstAppointment={dateOfFirstAppointment}
              activeCapName={activeCapName}
            />
          )}
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <PensionableSalary id={id} status={status} clickedItem={retiree} />
        </Suspense>
        <div className="pb-15">
          <Suspense fallback={<Spinner />}>
            <PeriodsOfAbsence id={id} status={status} clickedItem={retiree} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AddPensionersWorkHistory;
