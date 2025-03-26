import React, { use, useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import { Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import EditableTable from '@/components/baseComponents/EditableTable';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const MaintenanceCase = ({ id, clickedItem2 }) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,
      no: index + 1,
      maintainee_name: item.maintainee_name,
      national_id: item.national_id,
      kra_pin: item.kra_pin,
      email_address: item.email_address,
      phone_number: item.phone_number,
      postal_address: item.postal_address,
      postal_code_id: item.postal_code_id,
      gratuity_rate: item.gratuity_rate,
      monthly_pension_rate: item.monthly_pension_rate,
      bank_branch_name: item.bankBranch.name,
      bank_branch_id: item.bank_branch_id,
      account_number: item.account_number,
      account_name: item.account_name,
      created_date: item.created_date,
      bank_id: item.bankBranch.bank_id,
      gratuity_amount: item.gratuity_amount,
      pension_amount: item.pension_amount,
    }));
  };

  //

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [selectedBank, setSelectedBank] = React.useState(null);
  const [postalAddress, setPostalAddress] = useState([]);

  const fetchPostalAddress = async () => {
    try {
      const res = await apiService.get(endpoints.getPostalCodes, {
        'paging.pageSize': 1000,
      });
      setPostalAddress(res.data.data);
    } catch (error) {
      console.error('Error fetching Postal Address:', error);
    }
  };

  useEffect(() => {
    fetchPostalAddress();
  }, []);

  const title = clickedItem ? 'Maintenance Case' : 'Create a  Maintenance Case';

  const { data: relationships } = useFetchAsync(
    endpoints.getBeneficiariesRelationShips,
    apiService
  );

  const fields2 = [
    {
      value: 'relationship',
      label: 'Relationship',
      type: 'select',
      options: relationships && relationships,
    },
    {
      value: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },

    {
      value: 'maintainee_name',
      label: 'Name',
      type: 'text',
      required: true,
      pinned: 'left',
    },
    {
      value: 'national_id',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    { value: 'kra_pin', label: 'KRA PIN', type: 'text' },
    {
      value: 'email_address',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      value: 'phone_number',
      label: 'Phone Number',
      type: 'string',
    },
    // {
    //   value: 'temporary_postal_address',
    //   label: 'Temporary Postal Address',
    //   type: 'number',
    // },
    // {
    //   value: 'temporaty_postal_code_id',
    //   label: 'Temporary Postal Code',
    //   type: 'select',
    //   options: postalAddress.map((address) => ({
    //     id: address.id,
    //     name: address.code,
    //   })),
    // },
    {
      value: 'permanent_postal_address',
      label: 'Permanent Postal Address',
      type: 'number',
    },
    {
      value: 'permanent_postal_code_id',
      label: 'Permanent Postal Code',
      type: 'select',
      options: postalAddress.map((address) => ({
        id: address.id,
        name: address.code,
      })),
    },
    { value: 'gratuity_rate', label: 'Gratuity Rate', type: 'number' },
    { value: 'gratuity_amount', label: 'Gratuity Amount', type: 'number' },
    {
      value: 'monthly_pension_rate',
      label: 'Monthly Pension Rate',
      type: 'number',
    },
    { value: 'pension_amount', label: 'Pension Amount', type: 'number' },
    { value: 'bank_id', label: 'Bank', type: 'select', options: banks },
    {
      value: 'bank_branch_id',
      label: 'Bank Branch',
      type: 'select',
      options: branches,
      // options: branches.filter((branch) => branch.bankId === selectedBank),
      type: 'select',
    },
    {
      value: 'account_name',
      label: 'Account Name',
      type: 'text',
      required: true,
    },
    {
      value: 'account_number',
      label: 'Account Number',
      type: 'text',
      required: true,
    },
  ];

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getMaintenance(id));
      const data = res.data.data;
      setFilteredData(transformData(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);
  useEffect(() => {
    fetchMaintenance();
  }, [openBaseCard]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fields = [
    { title: 'First Name', value: 'firstName', type: 'text' },
    { title: 'Last Name', value: 'lastName', type: 'text' },
    { title: 'ID', value: 'id', type: 'number' },
    { title: 'Date of Birth', value: 'dob', type: 'date' },
    {
      title: 'Role',
      value: 'role',
      type: 'select',
      options: ['Admin', 'User', 'Guest'],
    },
    { title: 'Email', value: 'email', type: 'text' },
  ];

  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteMaintenance(id?.id)}
        deleteApiService={apiService.post}
        isSecondaryCard={true}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateMaintenance}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            id={id}
            idLabel="prospective_pensioner_id"
            fields={fields}
            setSelectedBank={setSelectedBank}
            apiEndpoint={endpoints.createMaintenance}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            isBranch={false}
          />
        )}
      </BaseCard>

      {/* <Button
        variant="contained"
        onClick={() => {
          setOpenBaseCard(true);
          setClickedItem(null);
        }}
        sx={{
          my: 2,
        }}
      >
        Add New Maintenance Case
      </Button> */}

      <div
        className="ag-theme-quartz"
        style={{
          height: '60vh',

          mt: '20px',

          overflowY: 'auto',
        }}
      >
        <BaseInputTable
          title="Maintenance Case"
          fields={fields2}
          id={id}
          disableAll={
            clickedItem2?.notification_status !== 2 &&
            clickedItem2?.notification_status !== null &&
            clickedItem2?.notification_status !== 0 &&
            clickedItem2?.notification_status !== 3
          }
          idLabel="prospective_pensioner_id"
          principalDob={clickedItem2?.dob}
          getApiService={apiService.get}
          postApiService={apiService.post}
          putApiService={apiService.put}
          apiService={apiService}
          deleteEndpoint={endpoints.deleteMaintenance(id)}
          getEndpoint={endpoints.getMaintenance(id)}
          postEndpoint={endpoints.createMaintenance}
          putEndpoint={endpoints.updateMaintenance}
          passProspectivePensionerId={true}
        />
      </div>
    </div>
  );
};

export default MaintenanceCase;
