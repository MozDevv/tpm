'use client';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useMda } from '@/context/MdaContext';
import { BASE_CORE_API } from '@/utils/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';

function GovernmentSalary({ id, clickedItem }) {
  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const mdaId = localStorage.getItem('mdaId');
  const [postNames, setPostNames] = useState([]);

  const fetchDesignations = async (postNames) => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      if (postNames.length > 0) {
        const filteredDesignations = res.data.data.filter((designation) =>
          postNames.includes(designation.name)
        );

        console.log('Post Names:', postNames);
        console.log('Filtered Designations:', filteredDesignations);
        setDesignations(
          //  postNames.length > 0 ? filteredDesignations : res.data.data
          filteredDesignations
        );
      } else {
        setDesignations(res.data.data);
      }
      return res.data.data;
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };
  const fetchGrades = async () => {
    if (selectedDesignation) {
      try {
        const res = await apiService.get(
          endpoints.getGradesByDesignation(selectedDesignation)
        );
        const data = res.data.data;
        setGrades(
          res.data.data.map((grade) => ({ id: grade.id, name: grade.grade }))
        );
      } catch (error) {
        console.error('Error fetching Grades:', error);
      }
    } else {
      try {
        const res = await apiService.get(endpoints.getAllGrades, {
          'paging.pageSize': 1000,
        });
        setGrades(
          res.data.data.map((grade) => ({ id: grade.id, name: grade.grade }))
        );

        return res.data.data;
      } catch (error) {
        console.error('Error fetching Grades:', error);
      }
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedDesignation, designations, mdaId]);

  // useEffect(() => {
  //   const filteredGrades = designations
  //     .filter((designation) => designation.id === selectedDesignation)
  //     .flatMap((designation) => designation.grades || [])
  //     .map((grade) => ({ id: grade.id, name: grade.grade }));

  //   setGrades(filteredGrades);
  // }, [selectedDesignation, designations]);

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
        setPostNames(extractPosts(sortedData));
        console.log('Post and Nature Posts:', extractPosts(sortedData));
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
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

        //  console.log("Post and Nature Data:", sortedData);
        setPostNames(extractPosts(sortedData));
        console.log('Post and Nature Posts:', extractPosts(sortedData));

        //return res.data.data;
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (
      clickedItem?.pension_award === 'MIXED SERVICE' ||
      clickedItem?.mda_pensionCap_name === 'APN/PK' ||
      clickedItem?.mda_pensionCap_name === 'CAP196' ||
      clickedItem?.mda_pensionCap_name === 'DSO/RK'
    ) {
      fetchMixedServicePosts();
    } else {
      console.log('Pen', clickedItem?.pension_award);
      fetchPostandNature();
    }
  }, [clickedItem]);

  // useEffect(() => {
  //   fetchDesignations();
  // }, []);

  useEffect(() => {
    if (postNames.length > 0) {
      fetchDesignations(postNames);
    } else {
      fetchDesignations();
    }
  }, [postNames]);

  const [allGrades, setAllGrades] = useState([]);

  const fetchAllGrades = async () => {
    try {
      const res = await apiService.get(endpoints.getAllGrades, {
        'paging.pageSize': 1000,
      });
      setAllGrades(
        res.data.data.map((grade) => ({
          id: grade.id,
          name: grade.grade,
          designationId: grade.designation_id,
        }))
      );

      return res.data.data;
    } catch (error) {
      console.error('Error fetching Grades:', error);
    }
  };

  useEffect(() => {
    fetchAllGrades();
  }, []);

  const fields = [
    { label: 'From Date', value: 'fromDate', type: 'date' },
    { label: 'To Date', value: 'toDate', type: 'date' },
    {
      label: 'Designation',
      value: 'designationId',
      type: 'select',
      options: designations
        .filter((designation) =>
          mdaId ? designation?.mda?.id === mdaId : true
        )
        .map((designation) => ({
          id: designation.id,
          name: designation.name,
        })),
    },
    {
      label: 'Grade',
      value: 'gradeId',
      type: 'select',
      options: allGrades,
    },
    { label: 'Salary Amount', value: 'salaryAmount', type: 'amount' },
  ];

  return (
    <div>
      <BaseInputTable
        filterBy={'designationId'}
        filterCol={'gradeId'}
        title="Government Salary"
        fields={fields}
        id={id}
        disableAll={
          clickedItem?.notification_status !== 2 &&
          clickedItem?.notification_status !== null &&
          clickedItem?.notification_status !== 0 &&
          clickedItem?.notification_status !== 3 &&
          clickedItem?.notification_status !== 7
        }
        clickedItem={clickedItem}
        retirementDate={clickedItem?.retirement_date}
        idLabel="prospective_pensioner_id"
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.post}
        apiService={apiService}
        getEndpoint={endpoints.getGovernmentSalary(id)}
        postEndpoint={endpoints.createGovernmentSalary}
        putEndpoint={endpoints.updateGovernmentSalary}
        deleteEndpoint={endpoints.deleteGovernmentSalary}
        setSelectedValue={setSelectedDesignation}
      />
    </div>
  );
}

export default GovernmentSalary;
