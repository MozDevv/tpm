import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import React from "react";
import endpoints, { apiService } from "@/components/services/setupsApi";

function Contributions({ id, clickedItem, setOpenBaseCard, fields }) {
  const [contributions, setContributions] = useState([]);
  const refreshData = async () => {
    try {
      const res = await apiService.get(
        endpoints.getParliamentaryContributions(id)
      );
      const data = res.data.data;
      setContributions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <BaseInputCard
        id={id}
        refreshData={refreshData}
        idLabel="prospective_pensioner_id"
        fields={fields}
        apiEndpoint={endpoints.createParliamentContributions}
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        setOpenBaseCard={setOpenBaseCard}
        useRequestBody={true}
        isBranch={false}
      />
    </div>
  );
}

export default Contributions;
