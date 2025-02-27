import React, { useState } from 'react';
import PensionerDetails from './PensionerDetails';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import QualyfyingService from './QualyfyingService';
import PensionableService from './PensionableService';
import DeductionsDetails from './DeductionsDetails';
import PensionComputation from './PensionComputation';
import PensionerBenefitsTable from './PensionerBenefitsTable';
import BudgetBalance from './BudgetBalance';
import { Dialog, IconButton, Tooltip } from '@mui/material';
import BaseExpandCard from '@/components/baseComponents/BaseExpandCard';
import { Launch } from '@mui/icons-material';

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
  const [expanded, setExpanded] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');

  const handleExpand = (content, title) => {
    setDialogContent(content);
    setDialogTitle(title);
    setExpanded(true);
  };

  return (
    <div className="flex-col h-[900px]">
      <BaseExpandCard
        open={expanded}
        onClose={() => setExpanded(false)}
        title={dialogTitle}
      >
        {dialogContent}
      </BaseExpandCard>
      <div className="max-h-[500px] overflow-y-auto ">
        <BaseCollapse
          name="Pensioner Benefits"
          expandHandler={() =>
            handleExpand(
              <PensionerBenefitsTable
                clickedItem={clickedItem}
                setViewBreakDown={setViewBreakDown}
                isExpanded={true}
              />,
              'Pensioner Benefits'
            )
          }
        >
          <PensionerBenefitsTable
            clickedItem={clickedItem}
            setViewBreakDown={setViewBreakDown}
          />
        </BaseCollapse>
        {clickedItem?.stage === 6 && (
          <BaseCollapse
            name="Budget Balance"
            expandHandler={() =>
              handleExpand(
                <BudgetBalance
                  clickedItem={clickedItem}
                  setViewBreakDown={setViewBreakDown}
                  isExpanded={true}
                />,
                'Budget Balance'
              )
            }
          >
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
        <BaseCollapse
          name="Qualifying Service"
          expandHandler={() =>
            handleExpand(
              <QualyfyingService
                computed={computed}
                qualifyingService={qualifyingService}
                clickedItem={clickedItem}
                isExpanded={true}
              />,
              'Qualifying Service'
            )
          }
        >
          <QualyfyingService
            computed={computed}
            qualifyingService={qualifyingService}
            clickedItem={clickedItem}
          />
        </BaseCollapse>
        <BaseCollapse
          name="Pensionable Service"
          expandHandler={() =>
            handleExpand(
              <PensionableService
                computed={computed}
                pensionableService={pensionableService}
                clickedItem={clickedItem}
                isExpanded={true}
              />,
              'Pensionable Service'
            )
          }
        >
          <PensionableService
            computed={computed}
            pensionableService={pensionableService}
            clickedItem={clickedItem}
          />
        </BaseCollapse>
        <BaseCollapse
          name="Deductions Details"
          expandHandler={() =>
            handleExpand(
              <DeductionsDetails clickedItem={clickedItem} isExpanded={true} />,
              'Deductions Details'
            )
          }
        >
          <DeductionsDetails clickedItem={clickedItem} />
        </BaseCollapse>
      </div>
      <div className="h-[200px]">
        <div className="absolute right-0">
          <Tooltip title="Click to Expand" arrow placement="top">
            <IconButton
              sx={{
                mr: 4,
              }}
              onClick={() =>
                handleExpand(
                  <PensionComputation
                    computed={computed}
                    clickedItem={clickedItem}
                    setViewBreakDown={setViewBreakDown}
                    viewBreakDown={viewBreakDown}
                    setViewCompleteSummary={setViewCompleteSummary}
                    viewCompleteSummary={viewCompleteSummary}
                    isExpanded={true}
                  />,
                  'Pension Computation'
                )
              }
            >
              <Launch
                sx={{
                  color: 'primary.main',
                  fontSize: '22px',
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className="">
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
    </div>
  );
}

export default AssessmentDetails;
