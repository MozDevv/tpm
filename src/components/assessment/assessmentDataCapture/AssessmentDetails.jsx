import React, { useState } from "react";
import PensionerDetails from "./PensionerDetails";
import BaseCollapse from "@/components/baseComponents/BaseCollapse";
import QualyfyingService from "./QualyfyingService";

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
    <div>
      <PensionerDetails
        clickedItem={clickedItem}
        retireeId={clickedItem?.retiree}
      />
      <BaseCollapse name="Qualifying Service">
        <QualyfyingService />
      </BaseCollapse>
    </div>
  );
}

export default AssessmentDetails;
