import assessEndpoints, {
  assessApiService,
} from "@/components/services/assessmentApi";
import { formatNumber } from "@/utils/numberFormatters";
import React, { useEffect, useState } from "react";

function PensionComputation({ clickedItem, computed }) {
  const [summary, setSummary] = useState(null); // Initialize as null to handle empty state

  const getSummary = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getCalculationSummary(clickedItem.id_claim)
      );
      setSummary(res.data.data || {}); // Set to an empty object if no data is returned
    } catch (error) {
      console.log("Error getting claim pensionable service:", error);
      setSummary({}); // Set to an empty object on error
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  useEffect(() => {
    getSummary();
  }, [computed]);

  const fields = [
    { label: "Current Salary", key: "current_salary" },
    { label: "Pensionable Emolument", key: "pensionable_emolument" },
    { label: "Unreduced Pension", key: "unreduced_pension" },
    { label: "Reduced Pension", key: "reduced_pension" },
    { label: "Lumpsum Amount", key: "lumpsum_amount" },
    { label: "Monthly Pension", key: "monthly_pension" },
    { label: "Last 3-Year Total", key: "last_3year_total" },
    { label: "Average Salary", key: "average_salary" },
    { label: "Max Government Salary", key: "max_government_salary" },
  ];

  return (
    <div className="flex flex-col">
      <hr />
      <div className="grid grid-cols-3 gap-2 pl-5 pt-4">
        {fields.map(({ label, key }) => (
          <div key={key} className="flex flex-row w-[90%] justify-between ">
            <span className="font-semibold text-gray-700 capitalize font-montserrat">
              {label}
            </span>
            <span className="text-gray-500 font-semibold text-[17px] ">
              {summary?.[key] !== undefined ? formatNumber(summary[key]) : 0}{" "}
              {/* Default to 0 if value is undefined */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PensionComputation;
