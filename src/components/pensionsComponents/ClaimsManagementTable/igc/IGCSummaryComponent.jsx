import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseInputCard from '@/components/baseComponents/BaseInputCard copy';
import endpoints, { apiService } from '@/components/services/setupsApi';
import React, { useEffect } from 'react';

function IGCSummaryComponent({ clickedItem }) {
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  // const [selectedBank, setSelectedBank] = React.useState('');
  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);
  const getFieldsByIgcType = (type) => {
    switch (type) {
      case 7:
        return [
          {
            name: 'save',
            label: 'Save',
            type: 'select',
            disabled: true,
          },
          {
            name: 'account_name',
            label: 'Account Name',
            type: 'text',
            disabled: true,
          },
          {
            name: 'account_number',
            label: 'Account Number',
            type: 'text',
            disabled: true,
          },
          {
            name: 'bank_branch_id',
            label: 'Bank Branch ',
            type: 'select',
            options: branches && branches,
            disabled: true,
          },
        ];
      default:
        return []; // Return an empty array for unsupported types
    }
  };
  const transformDataByType = (data) => {
    if (
      !data ||
      typeof data !== 'object' ||
      !data.json_payload ||
      typeof data.json_payload !== 'object'
    ) {
      console.error('Invalid or undefined data or json_payload');
      return {};
    }

    const jsonPayload = data.json_payload;

    switch (data.igc_type) {
      case 7:
        return {
          ...jsonPayload,
          account_name: jsonPayload.bankDetails?.account_name || '',
          account_number: jsonPayload.bankDetails?.account_number || '',
          bank_branch_id: jsonPayload.bankDetails?.bank_branch_id || '',
        };
      default:
        return jsonPayload;
    }
  };

  useEffect(() => {
    //log clickedItem, fields and transformDataByType
    console.log('clickedItem', clickedItem);
    console.log('fields', getFieldsByIgcType(clickedItem.igc_type));
    console.log('transformedData', transformDataByType(clickedItem));
  }, [clickedItem]);

  const getTitlesByIgcType = (type) => {
    switch (type) {
      case 7:
        return 'Updated Bank Details';
      default:
        return ''; // Return an empty string for unsupported types
    }
  };

  return (
    <div>
      <div className="mt-5">
        <BaseCollapse name={getTitlesByIgcType(clickedItem.igc_type)}>
          <BaseInputCard
            fields={getFieldsByIgcType(clickedItem.igc_type)}
            apiEndpoint={endpoints.updateDepartment}
            postApiFunction={apiService.post}
            clickedItem={transformDataByType(clickedItem)}
            useRequestBody={true}
          />
        </BaseCollapse>
      </div>
    </div>
  );
}

export default IGCSummaryComponent;
