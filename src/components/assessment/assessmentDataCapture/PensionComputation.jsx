import React from "react";

function PensionComputation({
  pensionData = {
    pension_factor: 0,
    claim_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    current_salary: 0,
    pensionable_emolument: 0,
    unreduced_pension: 0,
    reduced_pension: 0,
    lumpsum_amount: 0,
    monthly_pension: 0,
    last_3year_total: 0,
    average_salary: 0,
    max_government_salary: 0,
  },
}) {
  return (
    <div className="grid grid-cols-3 gap-2 pl-5 pt-4">
      {Object.entries(pensionData).map(([label, value]) => (
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
