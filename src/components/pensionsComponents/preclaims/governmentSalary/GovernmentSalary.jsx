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

  useEffect(() => {
    const filteredGrades = designations
      .filter((designation) => designation.id === selectedDesignation)
      .flatMap((designation) => designation.grades || [])
      .map((grade) => ({ id: grade.id, name: grade.grade }));

    setGrades(filteredGrades);
  }, [selectedDesignation, designations]);

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
        apiService={apiService}
        getEndpoint={endpoints.getGovernmentSalary}
        postEndpoint={endpoints.createGovernmentSalary}
        putEndpoint={endpoints.updateGovernmentSalary}
        setSelectedValue={setSelectedDesignation}
      />
    </div>
  );
}

export default GovernmentSalary;
