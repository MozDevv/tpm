'use client';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import React, { useEffect, useState } from 'react';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAlert } from '@/context/AlertContext';
import { message } from 'antd';
import { useMda } from '@/context/MdaContext';
import EditableTable from '@/components/baseComponents/EditableTable';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';

function PeriodsOfAbsence({ id, status, clickedItem, enabled }) {
  const [periodsOfAbsence, setPeriodsOfAbsence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { alert, setAlert } = useAlert();

  const fetchPeriodsOfAbsence = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPeriodsOfAbsence(id)
      );
      setPeriodsOfAbsence(res.data.data);
      setLoading(false);
      console.log('Period of Absence', res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodsOfAbsence();
  }, [id]);

  const fields = [
    { label: 'Start Date', value: 'start_date', type: 'date' },
    { label: 'End Date', value: 'end_date', type: 'date' },
    {
      label: 'Cause Of Absence',
      value: 'cause_of_absence',
      type: 'select',
      options: [
        { id: 'Absenteeism', name: 'Absenteeism' },
        { id: 'Suspension', name: 'Suspension' },
        { id: 'Interdiction', name: 'Interdiction' },
        { id: 'Unpaid Maternity Leave', name: 'Unpaid Maternity Leave' },
        { id: 'Study Leave', name: 'Study Leave' },
        { id: 'Sick Leave', name: 'Sick Leave' },
        { id: 'Condoned Leave', name: 'Condoned Leave' },
      ],
    },
    {
      label: 'Number of Days',
      value: 'number_of_days',
      type: 'number',
      disabled: true,
    },
  ];

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState();

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();
  const { activeCapName } = useMda();

  return (
    <div className="">
      <div className="mt-4">
        <BaseInputTable
          title="Periods of Absence"
          fields={fields}
          id={id}
          disableAll={
            !enabled &&
            clickedItem?.notification_status !== 2 &&
            clickedItem?.notification_status !== null &&
            clickedItem?.notification_status !== 0 &&
            clickedItem?.notification_status !== 3 &&
            clickedItem?.notification_status !== 7
          }
          idLabel="prospective_pensioner_id"
          deleteApiService={true}
          apiService={apiService}
          getApiService={apiService.get}
          postApiService={apiService.post}
          putApiService={apiService.put}
          getEndpoint={preClaimsEndpoints.getPeriodsOfAbsence(id)}
          postEndpoint={preClaimsEndpoints.createPeriodsOfAbsence}
          putEndpoint={preClaimsEndpoints.UpdatePeriodsOfAbsence}
          deleteEndpoint={preClaimsEndpoints.deletePeriodsOfAbsence}
          passProspectivePensionerId={true}
          enabled={enabled}
          sectionIndex={1}
        />
      </div>
    </div>
  );
}

export default PeriodsOfAbsence;
