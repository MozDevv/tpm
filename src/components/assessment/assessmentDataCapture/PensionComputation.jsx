import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import {
  checkIsDate,
  formatDate,
  isValidISODate,
  parseDate,
} from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import { ArrowBack, Close } from '@mui/icons-material';
import { Button, Dialog, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

function PensionComputation({
  clickedItem,
  computed,
  setViewBreakDown,
  viewBreakDown,
  setViewCompleteSummary,
  viewCompleteSummary,
}) {
  const [summary, setSummary] = useState(null); // Initialize as null to handle empty state

  const getSummary = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getCalculationSummary(clickedItem.id_claim)
      );
      setSummary(res.data.data || {}); // Set to an empty object if no data is returned
    } catch (error) {
      console.log('Error getting claim pensionable service:', error);
      setSummary({}); // Set to an empty object on error
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  useEffect(() => {
    getSummary();
  }, [computed]);

  // const fields = [
  //   { label: 'Current Salary', key: 'current_salary' },
  //   { label: 'Pensionable Emolument', key: 'pensionable_emolument' },
  //   { label: 'Unreduced Pension', key: 'unreduced_pension' },
  //   { label: 'Reduced Pension', key: 'reduced_pension' },
  //   { label: 'Lumpsum Amount', key: 'lumpsum_amount' },
  //   { label: 'Monthly Pension', key: 'monthly_pension' },
  //   { label: 'Last 3-Year Total', key: 'last_3year_total' },
  //   { label: 'Average Salary', key: 'average_salary' },
  //   { label: 'Max Government Salary', key: 'max_government_salary' },
  //   {
  //     label: 'Killed On Duty Monthly Pension',
  //     key: 'kod_widows_monthly_pension_amount',
  //   },
  //   {
  //     label: 'Killed On Duty Children Monthly Pension',
  //     key: 'kod_childrens_monthly_pension_amount',
  //   },
  //   { label: 'Death Gratuity Amount', key: 'death_gratuity_amount' },
  //   {
  //     label: 'Unreduced Dependent Pension',
  //     key: 'unreduced_dependent_pension',
  //   },
  //   {
  //     label: 'Monthly Primary Dependent Pension',
  //     key: 'monthly_primary_dependent_pension',
  //   },
  // ];

  const fields = summary
    ? Object.keys(summary).map((key) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // Convert snake_case to Title Case
        key: key,
      }))
    : [];

  const inputFields =
    summary &&
    Object.keys(summary)
      .filter((key) => summary[key] !== undefined && summary[key] !== null) // Filter out undefined or null values
      .filter(
        (key) => key !== 'breakdown' && key !== 'claim_id' && key !== 'id'
      ) // Filter out breakdown, claim_id and id
      .map((key) => {
        const value = summary[key];
        const containsDateKeyword =
          /(month|year|day)/i.test(key) &&
          key !== 'breakdown' &&
          key !== 'last_3year_total' &&
          key !== 'monthly_pension';
        return {
          label: key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()), // Convert snake_case to Title Case
          name: key,
          type: containsDateKeyword
            ? 'text' // If the key contains "month", "year", or "day", set type to 'text'
            : isValidISODate(value)
            ? 'date'
            : typeof value === 'number' || value === 0
            ? 'amount'
            : 'text',
          disabled: true,
        };
      });

  const renderSummary = () => {
    if (!summary || !summary.breakdown) return null;

    const lines = summary.breakdown
      .split('\n')
      .filter((line) => line.trim() !== '');

    return (
      <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        {lines.map((line, index) => {
          const [key, value] = line.split(':');
          if (!key || !value) return null;

          return (
            <div
              key={index}
              className="flex justify-between items-center px-5 py-3 hover:bg-gray-100 transition duration-200 ease-in-out rounded-md"
            >
              <span className="font-semibold text-gray-800">{key.trim()}:</span>
              <span className="text-gray-600 text-right">{value.trim()}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {JSON.stringify(viewCompleteSummary)}
      <hr />
      <div className="grid grid-cols-3 gap-2 pl-5 pt-4">
        {fields
          .filter((field) => {
            return (
              field.label !== 'Breakdown' &&
              field.label !== 'Claim Id' &&
              field.label !== 'Id'
            );
          })
          .filter(
            (field) =>
              summary[field.key] !== undefined && summary[field.key] !== null
          )
          .map(({ label, key }) => (
            <div key={key} className="flex flex-row w-[90%] justify-between">
              <span className="font-semibold text-gray-700 capitalize font-montserrat">
                {label}
              </span>
              <span className="text-gray-500 font-semibold text-[17px]">
                {
                  summary?.[key] !== undefined
                    ? isValidISODate(summary[key])
                      ? parseDate(summary[key])
                      : formatNumber(summary[key])
                    : '0.00' // Default to 0 if value is undefined
                }
              </span>
            </div>
          ))}
      </div>

      <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '350px',
            minWidth: '600px',
            p: 5,
          },
        }}
        open={
          viewBreakDown &&
          summary &&
          summary.breakdown &&
          summary.breakdown !== ''
        }
        onClose={() => setViewBreakDown(false)}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <IconButton
              sx={{
                border: '1px solid #006990',
                borderRadius: '50%',
                padding: '3px',
                marginRight: '10px',
                color: '#006990',
              }}
              onClick={() => setViewBreakDown(false)}
            >
              <ArrowBack sx={{ color: '#006990' }} />
            </IconButton>
            <h2 className="text-xl font-semibold text-primary">
              Computation Breakdown
            </h2>
          </div>
          <IconButton onClick={() => setViewBreakDown(false)}>
            <Close />
          </IconButton>
        </div>
        <div className="overflow-y-auto max-h-[400px]">{renderSummary()}</div>
      </Dialog>
      <BaseCard
        openBaseCard={viewCompleteSummary}
        setOpenBaseCard={setViewCompleteSummary}
        title={'Complete Summary Details'}
        handlers={{}}
        deleteApiEndpoint={''}
        deleteApiService={''}
        clickedItem={summary}
        isUserComponent={false}
        isSecondaryCard={true}
      >
        <BaseInputCard
          fields={inputFields}
          clickedItem={summary}
          useRequestBody={true}
          setOpenBaseCard={setViewBreakDown}
        />
      </BaseCard>
    </div>
  );
}

export default PensionComputation;
