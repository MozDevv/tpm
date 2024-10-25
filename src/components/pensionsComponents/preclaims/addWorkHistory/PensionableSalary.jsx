'use client';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
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
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAlert } from '@/context/AlertContext';
import { message } from 'antd';
import EditableTable from '@/components/baseComponents/EditableTable';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import endpoints from '@/components/services/setupsApi';
import BaseInputForPensionableSalary from '@/components/baseComponents/BaseInputForPensionableSalary';

function PensionableSalary({ id, status, clickedItem }) {
  const [pensionableSalary, setPensionableSalary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();
  const [designations, setDesignations] = useState([]);

  const [addAditionalCols, setAddAditionalCols] = useState(false);
  const [postNames, setPostNames] = useState([]);

  const extractPosts = (data) => {
    return data.map((item) => item.post);
  };

  const fetchMixedServicePosts = async () => {
    try {
      const res = await apiService.get(
        endpoints.getMixedServiceWorkHistory(id)
      );
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPostNames((prevNames) => [
          ...prevNames,
          ...extractPosts(sortedData),
        ]);
        console.log('Post and Nature Posts:', extractPosts(sortedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPostandNature = async () => {
    try {
      const res = await apiService.get(
        endpoints.getRetireesDesignationGvtSalary(id)
      );
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPostNames((prevNames) => [
          ...prevNames,
          ...extractPosts(sortedData),
        ]);
        console.log('Post and Nature Posts:', extractPosts(sortedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPensionableSalary = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPensionableSalary(id)
      );
      setPensionableSalary(res.data.data);
      setLoading(false);
      console.log('Pensionable Salary', res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchDesignations = async (postNames) => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      const filteredDesignations =
        postNames.length > 0
          ? res.data.data.filter((designation) =>
              postNames.includes(designation.name)
            )
          : res.data.data;

      console.log('Post Names:', postNames);
      console.log('Filtered Designations:', filteredDesignations);
      setDesignations(filteredDesignations);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMixedServicePosts(), fetchPostandNature()]);
      if (postNames.length > 0) fetchDesignations(postNames);
    };
    fetchData();
    fetchPensionableSalary();
  }, [id, postNames]);

  const fields = [
    { label: 'Start Date', value: 'start_date', type: 'date' },
    { label: 'End Date', value: 'end_date', type: 'date' },
    { label: 'Salary in ksh', value: 'salary' },
    { label: 'Pensionable Allowance', value: 'pensionable_allowance' },

    {
      label: 'Mode of Salary Increment',
      value: 'mode_of_salary_increment',
      type: 'select',
      options: [
        { id: 0, name: 'Increment' },
        { id: 1, name: 'Promotion' },
        { id: 2, name: 'Review' },
      ],
    },
    ...(addAditionalCols
      ? [
          { label: 'Review Period', value: 'review_period', type: 'date' },
          {
            label: 'New Designation',
            value: 'new_designation_id',
            type: 'select',
            options: designations.map((designation) => ({
              name: designation.name,
              id: designation.id,
            })),
          },
        ]
      : []),
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (data) => {
    const formattedFormData = { ...data, prospective_pensioner_id: id };

    // Format date fields
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes('date')) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          'YYYY-MM-DDTHH:mm:ss[Z]'
        );
      }
    });

    try {
      let res;

      if (data.id) {
        res = await apiService.post(
          preClaimsEndpoints.updatePensionableSalary,
          {
            ...formattedFormData,
            id: editId,
          }
        );
      } else {
        res = await apiService.post(
          preClaimsEndpoints.createPensionableSalary,
          formattedFormData
        );
      }

      // Check for successful response
      if (res.status === 200 && res.data.succeeded) {
        fetchPensionableSalary();
        setOpen(false);
        message.success(
          `Pensionable Salary ${isEditMode ? 'updated' : 'added'} successfully`
        );
      } else if (
        res.data.validationErrors &&
        res.data.validationErrors.length > 0
      ) {
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
        throw new Error('An error occurred while submitting the data.');
      }
    } catch (error) {
      throw error;
      console.error('Submission error:', error);
      message.error('An error occurred while submitting the data.');
    }
  };

  const handleEdit = (item) => {
    const formattedItem = {
      ...item,
      start_date: dayjs(item.start_date).format('YYYY-MM-DD'),
      end_date: dayjs(item.end_date).format('YYYY-MM-DD'),
    };

    setFormData(formattedItem);
    //setFormData(item);
    setEditId(item.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(
        preClaimsEndpoints.deletePensionableSalary(recordId)
      );
      fetchPensionableSalary();
      message.success('Pensionable Salary deleted successfully');
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();

  return (
    <div className="mt-5">
      <BaseInputForPensionableSalary
        title="Pensionable Salary"
        fields={fields}
        id={id}
        disableAll={
          clickedItem?.notification_status !== 2 &&
          clickedItem?.notification_status !== null &&
          clickedItem?.notification_status !== 0 &&
          clickedItem?.notification_status !== 3
        }
        idLabel="prospective_pensioner_id"
        apiService={apiService}
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.post}
        getEndpoint={preClaimsEndpoints.getPensionableSalary(id)}
        postEndpoint={preClaimsEndpoints.createPensionableSalary}
        putEndpoint={preClaimsEndpoints.updatePensionableSalary}
        deleteEndpoint={endpoints.deletePensionableSalary(id)}
        passProspectivePensionerId={true}
        addAditionalCols={addAditionalCols}
        setAddAditionalCols={setAddAditionalCols}
      />
    </div>
  );
}

export default PensionableSalary;
