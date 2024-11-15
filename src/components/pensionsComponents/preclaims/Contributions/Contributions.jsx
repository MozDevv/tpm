import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import React, { use, useEffect, useState } from 'react';
import endpoints, { apiService } from '@/components/services/setupsApi';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import axios from 'axios';

function Contributions({
  id,
  clickedItem,
  setOpenBaseCard,
  setClickedItem,
  parliamenterianTerms,
}) {
  const [contributions, setContributions] = useState([]);
  const [contributionId, setContributionId] = useState(
    clickedItem ? clickedItem.id : null
  );
  const refreshData = async (contributionId) => {
    setContributionId(contributionId);
    try {
      const res = await apiService.get(
        endpoints.getParliamentaryContributions(contributionId)
      );
      const data = res.data.data;
      setContributions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchClickedItem = async () => {
    try {
      const res = await apiService.get(
        endpoints.getParliamentaryContributions(id),
        {
          'filterCriterion.criterions[0].propertyName': 'id',
          'filterCriterion.criterions[0].propertyValue': clickedItem.id,
        }
      );
      const data = res.data.data;
      setClickedItem(data[0]);
      console.log('Clicked Item', clickedItem);
      console.log(
        'Data',
        data.filter((item) => item.id === id)
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    if (contributionId) {
      refreshData(contributionId);
    }
  }, [contributionId]);
  const lineFields = [
    {
      label: 'Month',
      value: 'month',
      type: 'select',
      options: [
        { id: 1, name: 'January' },
        { id: 2, name: 'February' },
        { id: 3, name: 'March' },
        { id: 4, name: 'April' },
        { id: 5, name: 'May' },
        { id: 6, name: 'June' },
        { id: 7, name: 'July' },
        { id: 8, name: 'August' },
        { id: 9, name: 'September' },
        { id: 10, name: 'October' },
        { id: 11, name: 'November' },
        { id: 12, name: 'December' },
      ],
    },
    {
      label: 'Contribution',
      value: 'contribution',
      type: 'number',
    },
  ];
  const fields = [
    {
      label: 'Year',
      name: 'year',
      type: 'number',
    },
    {
      label: 'Interest',
      name: 'intrest',
      type: 'number',
    },
    {
      label: 'Interest Amount',
      name: 'intrest_amount',
      type: 'number',
    },

    {
      id: 'parliamentary_term_setup_id',
      label: 'Parliamentary Terms',
      name: 'parliamentary_term_setup_id',
      type: 'select',
      options: parliamenterianTerms.map((term) => ({
        id: term.id,
        name: term.name,
      })),
    },
    ...(contributionId
      ? [
          {
            label: 'Total Contributions',
            name: 'total_contributions',
            type: 'number',
          },

          {
            label: 'Total Contributions With Interest',
            name: 'total_contributions_with_intrest',
            type: 'number',
          },
        ]
      : []),
  ];
  return (
    <div>
      <BaseInputCard
        id={id}
        refreshData={refreshData}
        idLabel="prospective_pensioner_id"
        fields={fields}
        apiEndpoint={
          clickedItem
            ? endpoints.updateContributions
            : endpoints.createParliamentContributions
        }
        postApiFunction={apiService.post}
        clickedItem={clickedItem ? clickedItem : null}
        setOpenBaseCard={setOpenBaseCard}
        useRequestBody={true}
        isBranch={true}
      />

      {contributionId && (
        <div className="">
          <BaseInputTable
            title="Monthly Contributions"
            fields={lineFields}
            id={contributionId}
            idLabel="paliamentary_contribution_id"
            getApiService={apiService.get}
            postApiService={apiService.post}
            putApiService={apiService.put}
            getEndpoint={endpoints.getParliamentaryContributionsLine(
              contributionId
            )}
            deleteApiService={apiService.delete}
            postEndpoint={endpoints.createParliamentContributionsLine}
            putEndpoint={endpoints.updateContributionsLine}
            passProspectivePensionerId={true}
            refetchDataFromAnotherComponent={fetchClickedItem}
            useExcel={true}
          />
        </div>
      )}
    </div>
  );
}

export default Contributions;
