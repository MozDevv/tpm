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
import { he } from '@faker-js/faker';
import Contributions from './Contributions';

const columnDefs = [
  { headerName: 'No', field: 'no', sortable: true, filter: true },
  { headerName: 'Year', field: 'year', sortable: true, filter: true },
  {
    headerName: 'Total Contributions',
    field: 'total_contributions',
    sortable: true,
    filter: true,
  },
  { headerName: 'Interest', field: 'intrest', sortable: true, filter: true },
  {
    headerName: 'Total Contributions With Interest',
    field: 'total_contributions_with_intrest',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Parliamentary Terms',
    field: 'parliamentary_term_setup_id',
    sortable: true,
    filter: true,
  },
];

const ParliamentContributions = (id) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,
      no: index + 1 + pageSize * (pageNumber - 1),
      year: item.year,
      total_contributions: item.total_contributions,
      intrest: item.intrest,
      total_contributions_with_intrest: item.total_contributions_with_intrest,
      intrest_amount: item.intrest_amount,
      parliamentary_term_setup_id: item.parliamentary_term_setup_id,
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
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setMdas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [parliamenterianTerms, setParliamentarianTerms] = useState([]);
  const fetchTerms = async () => {
    try {
      const res = await apiService.get(endpoints.getParliamentaryTermsSetups);

      if (res.status === 200) {
        setParliamentarianTerms(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching Full Term:', error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const title = clickedItem
    ? 'Parliamentary Contributions'
    : 'Add a New Parliamentary Contribution';

  const fields = [
    {
      id: 'year',
      label: 'Year',
      name: 'year',
      type: 'number',
    },
    {
      id: 'total_contributions',
      label: 'Total Contributions',
      name: 'total_contributions',
      type: 'amount',
    },
    {
      id: 'intrest',
      label: 'Interest',
      name: 'intrest',
      type: 'amount',
    },
    {
      id: 'total_contributions_with_intrest',
      label: 'Total Contributions With Interest',
      name: 'total_contributions_with_intrest',
      type: 'amount',
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
  ];

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(
        endpoints.getParliamentaryContributions(id.id)
      );
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

  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteContributions(clickedItem?.id)}
        deleteApiService={apiService.delete}
        isSecondaryCard={true}
      >
        <Contributions
          parliamenterianTerms={parliamenterianTerms}
          id={id.id}
          apiEndpoint={endpoints.createParliamentContributions}
          postApiFunction={apiService.post}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          setOpenBaseCard={setOpenBaseCard}
          useRequestBody={true}
          isBranch={false}
        />
      </BaseCard>

      <Button
        variant="contained"
        onClick={() => {
          setOpenBaseCard(true);
          setClickedItem(null);
        }}
        sx={{
          my: 2,
        }}
      >
        Add Parliamentary Contributions
      </Button>

      <div
        className="ag-theme-quartz"
        style={{
          height: '60vh',

          mt: '20px',

          overflowY: 'auto',
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredData}
          pagination={false}
          domLayout="autoHeight"
          alwaysShowHorizontalScroll={true}
          // paginationPageSize={pageSize}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            // onGridReady(params);
          }}
          // onPaginationChanged={(params) =>
          //   handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
          // }
          onRowClicked={(e) => {
            setOpenBaseCard(true);
            setClickedItem(e.data);
            // setUserClicked(e.data);
            //handleClickUser(e.data);
          }}
        />
      </div>
    </div>
  );
};

export default ParliamentContributions;
