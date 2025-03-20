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
import {
  useIgcIdStore,
  usePensionableSalaryStore,
  usePeriodsOfAbsenceStore,
  usePostAndNatureStore,
} from '@/zustand/store';
import endpoints from '@/components/services/setupsApi';
import { Alert, message } from 'antd';

function AddPensionersWorkHistory({
  id,
  name,
  moveToNextTab,
  status,
  moveToPreviousTab,
  clickedItem,
  enabled,
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

  const [retirementDate, setRetirementDate] = useState('');

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      const data = res?.data?.data[0]; // Get the retiree data
      setPensionAward(res.data.data[0]?.pensionAward?.name === 'MIXED SERVICE');

      console.log('pensionAward', pensionAward);
      setDateOfFirstAppointment(data.date_of_first_appointment);
      setRetirementDate(data.retirement_date);

      setRetiree(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRetiree();
  }, []);
  const { pensionableSalary, setPensionableSalary } =
    usePensionableSalaryStore();
  const { periodsOfAbsence, setPeriodsOfAbsence } = usePeriodsOfAbsenceStore();
  const { postAndNature, setPostAndNature } = usePostAndNatureStore();
  const { igcId, setIgcId } = useIgcIdStore();
  const [error, setError] = useState(null);

  const saveIgcChanges = async () => {
    try {
      const dataToSend = {
        id: igcId,
        section: 1,
        data: {
          basicDetails: null,
          workHistoryData: {
            PostAndNatures:
              Array.isArray(postAndNature) && postAndNature.length > 0
                ? postAndNature
                : null,
            PensionableSalaries:
              Array.isArray(pensionableSalary) && pensionableSalary.length > 0
                ? pensionableSalary
                : null,
            PeriodsOfAbsence:
              Array.isArray(periodsOfAbsence) && periodsOfAbsence.length > 0
                ? periodsOfAbsence
                : null,
          },
        },
      };
      const res = await apiService.post(
        endpoints.updateRevisedCase,
        dataToSend
      );
      if (res.status === 200 && res.data.succeeded) {
        message.success('Changes saved successfully');
      }
    } catch (error) {
      console.error('Error saving IGC changes:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        setError(errorMessages);
        message.error(`Error saving IGC changes: ${errorMessages}`);
      } else {
        message.error('An unexpected error occurred while saving IGC changes.');
      }
    }
  };

  return (
    <div className="p-2 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-6 sticky top-0 bg-white z-10">
        <div></div>
      </div>
      {enabled && (
        <div className="w-full flex items-center">
          {error && (
            <div className="w-full">
              <Alert message={error} type="error" showIcon closable />
            </div>
          )}
          <div className="flex justify-end w-full">
            <Button variant="contained" onClick={saveIgcChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className=" overflow-y-auto h-[70vh]">
        <PostAndNature
          id={id}
          status={status}
          clickedItem={clickedItem}
          loading={loading}
          setLoading={setLoading}
          dateOfFirstAppointment={dateOfFirstAppointment}
          activeCapName={activeCapName}
          enabled={enabled}
        />

        <Suspense fallback={<Spinner />}>
          <PensionableSalary
            id={id}
            status={status}
            clickedItem={clickedItem}
            retirementDate={retirementDate}
            enabled={enabled}
          />
        </Suspense>
        <div className="pb-15">
          <Suspense fallback={<Spinner />}>
            <PeriodsOfAbsence
              id={id}
              status={status}
              clickedItem={clickedItem}
              enabled={enabled}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AddPensionersWorkHistory;
