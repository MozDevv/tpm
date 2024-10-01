import assessEndpoints, {
  assessApiService,
} from "@/components/services/assessmentApi";
import React, { useEffect, useState } from "react";

function PensionComputation({ clickedItem, computed }) {
  const [summary, setSummary] = useState(null); // Initialize as null to handle empty state

  const getSummary = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimPensionableService(clickedItem.id_claim)
      );
      setSummary(res.data.data[0] || null); // Set to null if no data is returned
    } catch (error) {
      console.log("Error getting claim pensionable service:", error);
      setSummary(null); // Ensure null is set on error
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  useEffect(() => {
    getSummary();
  }, [computed]);

  // Conditionally render content if summary is not null
  if (!summary) return null;

  return (
    <div className="grid grid-cols-3 gap-2 pl-5 pt-4">
      {Object.entries(summary)
        .filter(([label]) => label !== "claim_id" && label !== "id")
        .map(([label, value]) => (
          <div key={label} className="flex flex-row w-[90%] justify-between ">
            <span className="font-semibold text-gray-700 capitalize font-montserrat">
              {label.replace(/_/g, " ")}
            </span>
            <span className="text-gray-500 ">{value}</span>
          </div>
        ))}
    </div>
  );
}

export default PensionComputation;
