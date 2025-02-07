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
import { parseDate, parseDateSlash } from '@/utils/dateFormatter';

function PensionableSalary({ id, clickedItem }) {
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

  const [hasFetchedPosts, setHasFetchedPosts] = useState(false); // New state to prevent multiple fetches

  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [refreshColumns, setRefreshColumns] = useState(false);

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
        return extractPosts(sortedData);
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
        return extractPosts(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [hasReviewPeriods, setHasReviewPeriods] = useState(false);
  const [hasNewDesignation, setHasNewDesignation] = useState(false);

  const fetchPensionableSalary = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPensionableSalary(id)
      );

      const hasReviewPeriods = res.data.data.some((item) => item.review_period);

      const hasNewDesignation = res.data.data.some(
        (item) => item.new_designation_id
      );

      setHasNewDesignation(hasNewDesignation);
      setHasReviewPeriods(hasReviewPeriods);

      // console.log('Has Review Periods:', hasReviewPeriods);
      setAddAditionalCols(hasReviewPeriods);
      setPensionableSalary(res.data.data);
      // console.log('Pensionable Salary', res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
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

      // console.log('Filtered Designations:', filteredDesignations);
      setDesignations(filteredDesignations);
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };
  const fetchAllDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });

      // console.log('Clikec from Pensionable  cs', clickedItem);

      setDesignations(
        res.data.data.filter((designation) =>
          clickedItem?.mda_id
            ? designation?.mda?.id === clickedItem?.mda_id
            : true
        )
      );
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetchedPosts) {
        try {
          const [mixedPosts, naturePosts] = await Promise.all([
            fetchMixedServicePosts(),
            fetchPostandNature(),
          ]);

          const combinedPosts = [...mixedPosts, ...naturePosts];
          setPostNames(combinedPosts);
          setHasFetchedPosts(true); // Mark posts as fetched
          if (combinedPosts.length > 0) {
            fetchDesignations(combinedPosts);
          } else {
            fetchAllDesignations();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
    fetchPensionableSalary();
  }, [hasFetchedPosts]);

  const [reviewPeriods, setReviewPeriods] = useState([]);

  const getProspectivePensionerReviewPeriods = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensionerReviewPeriods(id)
      );
      setReviewPeriods(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProspectivePensionerReviewPeriods();
  }, [refreshColumns]);
  useEffect(() => {
    fetchPensionableSalary();
  }, [refreshColumns]);
  useEffect(() => {
    getProspectivePensionerReviewPeriods();
  }, []);
  const fields = [
    { label: 'Start Date', value: 'start_date', type: 'date' },
    { label: 'End Date', value: 'end_date', type: 'date' },
    {
      label: 'Mode of Salary Increment',
      value: 'mode_of_salary_increment',
      type: 'select',
      options: [
        { id: 0, name: 'Entry' },
        { id: 1, name: 'Increment' },
        { id: 2, name: 'Promotion' },
        { id: 3, name: 'Review' },
      ],
    },
    { label: 'Salary in ksh', value: 'salary', type: 'amount' },
    {
      label: 'Pensionable Allowance',
      value: 'pensionable_allowance',
      type: 'amount',
    },

    ...((hasNewDesignation && hasReviewPeriods) || addAditionalCols === 3
      ? [
          {
            label: 'Review Period',
            value: 'review_period',
            type: 'date',
            disabled: false,
            notRequired: true,
          },
          {
            label: 'New Designation',
            value: 'new_designation_id',
            type: 'select',
            options: designations.map((designation) => ({
              name: designation.name,
              id: designation.id,
            })),
            //notRequired: true,
          },
        ]
      : hasNewDesignation || addAditionalCols === 3
      ? [
          {
            label: 'New Designation',
            value: 'new_designation_id',
            type: 'select',
            options: designations.map((designation) => ({
              name: designation.name,
              id: designation.id,
            })),
            //notRequired: true,
          },
        ]
      : hasNewDesignation || addAditionalCols === 2
      ? [
          {
            label: 'New Designation',
            value: 'new_designation_id',
            type: 'select',
            options: designations.map((designation) => ({
              name: designation.name,
              id: designation.id,
            })),
            //notRequired: true,
          },
        ]
      : []),
  ];
  const dynamicReviewFields = reviewPeriods.map((period) => ({
    label: `${parseDateSlash(period.review_date)} Salary Revision`,
    value: `new_salary_${period.review_date
      .split('T')[0]
      .replaceAll('-', '_')}`,
    notRequired: true,
    type: 'amount',
    disabled: true,
  }));
  const finalFields = [...fields, ...dynamicReviewFields];
  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();

  return (
    <div className="mt-5">
      <BaseInputForPensionableSalary
        title="Pensionable Salary"
        fields={finalFields}
        id={id}
        disableAll={
          clickedItem?.notification_status !== 2 &&
          clickedItem?.notification_status !== null &&
          clickedItem?.notification_status !== 0 &&
          clickedItem?.notification_status !== 3 &&
          clickedItem?.notification_status !== 7
        }
        idLabel="prospective_pensioner_id"
        refreshColumns={refreshColumns}
        setRefreshColumns={setRefreshColumns}
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
