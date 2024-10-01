import React, { useState } from "react";
import PensionerDetails from "./PensionerDetails";
import BaseCollapse from "@/components/baseComponents/BaseCollapse";
import QualyfyingService from "./QualyfyingService";
import PensionableService from "./PensionableService";
import DeductionsDetails from "./DeductionsDetails";
import PensionComputation from "./PensionComputation";

function AssessmentDetails({ clickedItem }) {
  const [openSections, setOpenSections] = useState({});

  const handleToggleSection = (key) => {
    setOpenSections((prevOpenSections) => {
      return {
        ...prevOpenSections,
        [key]: !prevOpenSections[key],
      };
    });
  };
  return (
    <div className="max-h-[600px] overflow-y-auto ">
      <PensionerDetails
        clickedItem={clickedItem}
        retireeId={clickedItem?.retiree}
      />
      <BaseCollapse name="Qualifying Service">
        <QualyfyingService />
      </BaseCollapse>
      <BaseCollapse name="Pensionable Service">
        <PensionableService />
      </BaseCollapse>
      <BaseCollapse name="Deductions Details">
        <DeductionsDetails />
      </BaseCollapse>
      <PensionComputation />
    </div>
  );
}

export default AssessmentDetails;
