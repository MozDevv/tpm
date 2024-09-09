"use client";
import BaseInputTable from "@/components/baseComponents/BaseInputTable";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useEffect, useState } from "react";

function GovernmentSalary({ id }) {
  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const mdaId = localStorage.getItem("mdaId");

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        "paging.pageSize": 1000,
      });
      setDesignations(res.data.data);

      return res.data.data;
    } catch (error) {
      console.error("Error fetching Designations:", error);
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
        console.error("Error fetching Grades:", error);
      }
    } else {
      try {
        const res = await apiService.get(endpoints.getAllGrades, {
          "paging.pageSize": 1000,
        });
        setGrades(
          res.data.data.map((grade) => ({ id: grade.id, name: grade.grade }))
        );

        return res.data.data;
      } catch (error) {
        console.error("Error fetching Grades:", error);
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

  useEffect(() => {
    fetchDesignations();
  }, []);
  const fields = [
    { label: "From Date", value: "fromDate", type: "date" },
    { label: "To Date", value: "toDate", type: "date" },
    {
      label: "Designation",
      value: "designationId",
      type: "select",
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
      label: "Grade",
      value: "gradeId",
      type: "select",
      options: grades,
    },
    { label: "Salary Amount", value: "salaryAmount", type: "text" },
  ];

  return (
    <div>
      <BaseInputTable
        title="Government Salary"
        fields={fields}
        id={id}
        idLabel="prospective_pensioner_id"
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.put}
        apiService={apiService}
        getEndpoint={endpoints.getGovernmentSalary(id)}
        postEndpoint={endpoints.createGovernmentSalary}
        putEndpoint={endpoints.updateGovernmentSalary}
        setSelectedValue={setSelectedDesignation}
      />
    </div>
  );
}

export default GovernmentSalary;
