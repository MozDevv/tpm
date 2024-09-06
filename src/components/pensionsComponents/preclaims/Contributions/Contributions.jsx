import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import React from "react";
import endpoints, { apiService } from "@/components/services/setupsApi";

function Contributions({
  id,
  clickedItem,
  setOpenBaseCard,
  endpoints,
  apiService,
}) {
  return (
    <div>
      <BaseInputCard
        id={id}
        idLabel="prospective_pensioner_id"
        fields={inputFields}
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
