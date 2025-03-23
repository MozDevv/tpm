import React, { useEffect, useState } from 'react';

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
import { useMda } from '@/context/MdaContext';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { useClickedProspectiveIdStore } from '@/zustand/store';

const Deductions = ({ id, clickedItem2, enabled, sectionIndex }) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page

  const [recoveryDeductions, setRecoveryDeductions] = useState([]);

  const fetchRecoveryDeductions = async () => {
    try {
      const res = await apiService.get(endpoints.getRecoveryDeductions, {
        'paging.pageSize': 1000,
      });
      //filter not isPensioner
      const data = res.data.data.filter((item) => item.isPensioner);
      setRecoveryDeductions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchRecoveryDeductions();
  }, []);

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,
      no: index + 1,
      name: item.name,
      amount: item.amount,
      deduction_type: item.deduction_type,
      deduction_payee: item.deduction_payee,
      mda: item.name,
      deductions_and_refunds_id: item.deductions_and_refunds_id,
    }));
  };

  //

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [selectedBank, setSelectedBank] = React.useState(null);
  const [mdas, setMdas] = useState([]);
  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        'paging.pageSize': 1000,
      });
      const { data, totalCount } = res.data;
      setMdas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const title = clickedItem ? 'Deductions' : 'Add a New Deduction';

  const mdaId = localStorage.getItem('mdaId');

  const fields = [
    {
      label: 'Name',
      value: 'name',
      type: 'text',
      required: true,
    },
    {
      label: 'Amount',
      value: 'amount',
      type: 'amount',
      required: true,
    },

    {
      label: 'MDA',
      value: 'mda_id',
      type: 'select',
      options: mdas
        .filter((mda) => mda.id === clickedItem2?.mda_id)
        .map((mda) => ({
          id: mda.id,
          name: mda.name,
        })), // Add the correct options here
      disabled: false,
      hide: false,
    },
    {
      label: 'Deduction/Recovery',
      value: 'deductions_and_refunds_id',
      type: 'select',
      options: recoveryDeductions.map((recovery) => ({
        id: recovery.id,
        name: recovery.description,
      })),
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getDeductions(id));
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
    fetchMdas();
  }, []);

  const { clickedProspectiveId } = useClickedProspectiveIdStore();
  return (
    <div className="">
      <BaseInputTable
        title="Deductions"
        fields={fields}
        id={id}
        disableAll={
          !enabled &&
          clickedItem2?.notification_status !== 2 &&
          clickedItem2?.notification_status !== null &&
          clickedItem2?.notification_status !== 0 &&
          clickedItem2?.notification_status !== 3 &&
          clickedItem2?.notification_status !== 7
        }
        idLabel="prospective_pensioner_id"
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.put}
        getEndpoint={endpoints.getDeductions(id)}
        postEndpoint={endpoints.createDeductions}
        putEndpoint={endpoints.updateGovernmentSalary}
        passProspectivePensionerId={true}
        igcObject="deductionData"
        sectionIndex={sectionIndex}
        enabled={enabled}
      />{' '}
    </div>
  );
};

export default Deductions;
