import React, { useState } from 'react';
import PensionerDetails from './PensionerDetails';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import QualyfyingService from './QualyfyingService';
import PensionableService from './PensionableService';
import DeductionsDetails from './DeductionsDetails';
import PensionComputation from './PensionComputation';

import PensionerBenefitsTable from './PensionerBenefitsTable';
import BudgetBalance from './BudgetBalance';

function AssessmentDetails({
  clickedItem,
  qualifyingService,
  pensionableService,
  computed,
  setViewBreakDown,
  viewBreakDown,
  setViewCompleteSummary,
  viewCompleteSummary,
}) {
  const [openSections, setOpenSections] = useState({});

  return (
    <div className="flex-col h-[900px]">
      <div className="max-h-[500px] overflow-y-auto ">
        <BaseCollapse name="Pensioner Benefits">
          <PensionerBenefitsTable
            clickedItem={clickedItem}
            setViewBreakDown={setViewBreakDown}
          />
        </BaseCollapse>
        {clickedItem?.stage === 6 && (
          <BaseCollapse name="Budget Balance">
            <BudgetBalance
              clickedItem={clickedItem}
              setViewBreakDown={setViewBreakDown}
            />
          </BaseCollapse>
        )}
        <PensionerDetails
          clickedItem={clickedItem}
          retireeId={clickedItem?.retiree}
        />
        <BaseCollapse name="Qualifying Service">
          <QualyfyingService
            computed={computed}
            qualifyingService={qualifyingService}
            clickedItem={clickedItem}
          />
        </BaseCollapse>
        <BaseCollapse name="Pensionable Service">
          <PensionableService
            computed={computed}
            pensionableService={pensionableService}
            clickedItem={clickedItem}
          />
        </BaseCollapse>
        <BaseCollapse name="Deductions Details">
          <DeductionsDetails clickedItem={clickedItem} />
        </BaseCollapse>
      </div>
      <div className="h-[200px]">
        <PensionComputation
          computed={computed}
          clickedItem={clickedItem}
          setViewBreakDown={setViewBreakDown}
          viewBreakDown={viewBreakDown}
          setViewCompleteSummary={setViewCompleteSummary}
          viewCompleteSummary={viewCompleteSummary}
        />
      </div>
    </div>
  );
}

export default AssessmentDetails;
