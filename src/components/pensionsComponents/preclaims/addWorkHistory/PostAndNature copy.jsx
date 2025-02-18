import { useAlert } from '@/context/AlertContext';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import { message } from 'antd';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import { useMda } from '@/context/MdaContext';
import endpoints from '@/components/services/setupsApi';
import EditableTable from '@/components/baseComponents/EditableTable';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { BASE_CORE_API } from '@/utils/constants';

function PostAndNature({ id, clickedItem }) {
  const [postAndNatureData, setPostAndNatureData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    was_seconded: false,
    post: '',
    was_pensionable: false,
    nature_of_salary_scale: '',
    nature_of_service: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();
  const [dateOfConfirmation, setDateOfConfirmation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPostandNature = async () => {
    try {
      const res = await apiService.get(endpoints.getPostAndNature(id));
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // console.log("Post and Nature Data:", sortedData);
        setPostAndNatureData(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostandNature();
    }
  }, [id]);

  const [dateOfFirstAppointment, setDateOfFirstAppointment] = useState('');

  const [mdaId, setMdaId] = useState('');
  const [cap, setCap] = useState('');

  const [pensionAward, setPensionAward] = useState(null);
  const [isSeconded, setIsSeconded] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const fetchProspectivePensioners = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );

      const response = await apiService.get(
        preClaimsEndpoints.getPostandNatureofSalaries(id)
      );
      console.log('The Prospective Pensioner data is: ', response.data.data);

      const isSeconded = response.data.data.some((item) => item.seconded);
      setIsSeconded(isSeconded);
      console.log('isSeconded', isSeconded);

      setDateOfConfirmation(res.data.data[0].date_of_confirmation);

      setDateOfFirstAppointment(res.data.data[0].date_of_first_appointment);

      setCap(res.data.data[0].mda.pensionCap.name);
      //setCap("CAP196");
      setMdaId(res.data.data[0].mda.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProspectivePensioners();
  }, []);

  const [designations, setDesignations] = useState([]);

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);
  const natureOfServiceOptions = {
    CAP189: [
      { id: 'Probation', name: 'Probation' },
      { id: 'Permanent', name: 'Permanent' },
      { id: 'Temporary', name: 'Temporary' },
      { id: 'Contract', name: 'Contract' },
    ],
    CAP199: [
      { id: 'ReckonableService', name: 'Reckonable Service' },
      { id: 'NonReckonableService', name: 'Non-Reckonable Service' },
    ],
    CAP196: [
      { id: 'ParliamentaryTerms', name: 'Parliamentary Terms' },
      { id: 'OneTerm', name: '1 Term' },
      { id: 'TwoTerms', name: '2 Term' },
      { id: 'ThreeTerms', name: '3 Term' },
      { id: 'FourTerms', name: '4 Term' },
      { id: 'FiveTerms', name: '5 Term' },
    ],
    'APN/PK': [
      { id: 'ParliamentaryTerms', name: 'Parliamentary Terms' },
      { id: 'OneTerm', name: '1 Term' },
      { id: 'TwoTerms', name: '2 Term' },
      { id: 'ThreeTerms', name: '3 Term' },
      { id: 'FourTerms', name: '4 Term' },
      { id: 'FiveTerms', name: '5 Term' },
    ],
    'DSO/RK': [
      { id: 'ParliamentaryTerms', name: 'Parliamentary Terms' },
      { id: 'OneTerm', name: '1 Term' },
      { id: 'TwoTerms', name: '2 Term' },
      { id: 'ThreeTerms', name: '3 Term' },
      { id: 'FourTerms', name: '4 Term' },
      { id: 'FiveTerms', name: '5 Term' },
    ],
  };

  const [parliamenterianTerms, setParliamentarianTerms] = useState([]);
  const fetchTerms = async () => {
    try {
      const res = await apiService.get(endpoints.getParliamentaryTermsSetups, {
        'paging.pageSize': 1000,
      });

      if (res.status === 200) {
        setParliamentarianTerms(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching Full Term:', error);
    }
  };
  const [seconded, setSeconded] = useState(false);
  useEffect(() => {
    fetchDesignations();
    fetchTerms();
  }, []);
  useEffect(() => {
    console.log('Current Row', currentRow?.seconded);
    //setSeconded(currentRow?.seconded);
  }, [currentRow]);

  const fields = [
    ...(cap === 'CAP196' || cap === 'DSO/RK' || cap === 'APN/PK'
      ? [
          {
            label: 'Parliamentary Term',
            value: 'parliamentary_term_setup_id',
            type: 'select',
            options: parliamenterianTerms.map((term) => ({
              id: term.id,
              name: term.name,
              start_year: term.start_year,

              // start_month: months.find(
              //   (month) => month.id === term.specific_start_month
              // ).name,
              start_month: term.specific_start_month,
            })),
          },
          {
            label: 'Was Full Term Served (Yes/No)',
            value: 'was_full_term',
            type: 'select',
            options: [
              { id: true, name: 'Yes' },
              { id: false, name: 'No' },
            ],
          },
        ]
      : []),
    {
      label: 'Start Date',
      value: 'date',
      type: 'date',
      disabled:
        cap === 'CAP196' || cap === 'DSO/RK' || cap === 'APN/PK' ? true : false,
    },
    ...(clickedItem?.was_in_mixed_service
      ? [
          {
            label: 'End Date',
            value: 'end_date',
            type: 'date',
          },
        ]
      : []),
    ...(cap === 'CAP189' && !clickedItem?.was_in_mixed_service
      ? [
          {
            label: 'Seconded(Yes/No)',
            value: 'seconded',
            type: 'select',
            options: [
              { id: false, name: 'No' },
              { id: true, name: 'Yes' },
            ],
          },
        ]
      : []),

    {
      label: 'Post',
      value: 'post',
      type: seconded ? 'text' : 'select', // Dynamically change type
      options: !seconded
        ? designations
            .filter((designation) => designation?.mda?.id === mdaId)
            .map((designation) => ({
              id: designation.name,
              name: designation.name,
            }))
        : [], // No options needed for text input
    },

    ...(clickedItem?.was_in_mixed_service
      ? [
          {
            label: 'Salary',
            value: 'salary',
            type: 'amount',
            notRequired: true,
          },
        ]
      : []),
    ...((seconded || isSeconded) && !clickedItem?.was_in_mixed_service
      ? [
          {
            label: 'Salary',
            value: 'salary',
            type: 'amount',
          },
        ]
      : []),
    {
      label: 'Whether Pensionable(Yes/No)',
      value: 'was_pensionable',
      type: 'select',
      options: [
        { id: true, name: 'Yes' },
        { id: false, name: 'No' },
      ],
    },
    ...(clickedItem?.was_in_mixed_service
      ? [
          {
            label: 'Is Central Government(Yes/No)',
            value: 'is_central_government',
            type: 'select',
            options: [
              { id: true, name: 'Yes' },
              { id: false, name: 'No' },
            ],
          },
        ]
      : []),
    {
      label: 'Nature of Salary Scale',
      value: 'nature_of_salary_scale',
      type: 'select',
      options: [
        { id: 'P', name: 'Pensionable' },
        { id: 'Prob', name: 'Probation' },
        { id: 'T', name: 'Temporary' },
        { id: 'C', name: 'Contract' },
      ],
    },
    {
      label: 'Nature of Service',
      value: 'nature_of_service',
      type: 'select',
      options: natureOfServiceOptions[cap] || [],
    },
  ];

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();

  return (
    <div className="pb-5">
      <BaseInputTable
        dateOfFirstAppointment={dateOfFirstAppointment}
        title="Post and Nature of Service"
        fields={fields}
        id={id}
        disableAll={
          clickedItem?.notification_status !== 2 &&
          clickedItem?.notification_status !== null &&
          clickedItem?.notification_status !== 0 &&
          clickedItem?.notification_status !== 3 &&
          clickedItem?.notification_status !== 7
        }
        cap={cap}
        setSeconded={setSeconded}
        idLabel="prospective_pensioner_id"
        setCurrentRow={setCurrentRow}
        apiService={apiService}
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.post}
        deleteApiService={apiService.post}
        getEndpoint={preClaimsEndpoints.getPostandNatureofSalaries(id)}
        postEndpoint={preClaimsEndpoints.createPostAndNatureOfService}
        putEndpoint={preClaimsEndpoints.updatePostAndNature}
        deleteEndpoint={preClaimsEndpoints.deletePostAndNature}
        passProspectivePensionerId={true}
      />{' '}
    </div>
  );
}

export default PostAndNature;
