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
import {
  Add,
  ArticleOutlined,
  BarChart,
  FileDownload,
  Launch,
} from '@mui/icons-material';
import { formatNumber } from '@/utils/numberFormatters';

const columnDefs = [
  {
    headerName: 'Year',
    field: 'year',
    sortable: true,
    filter: true,
    width: 150,
    pinned: 'left',
    checkBoxSelection: true,
  },
  // {
  //   headerName: 'Interest',
  //   field: 'intrest',
  //   sortable: true,
  //   filter: true,
  //   valueFormatter: (params) => formatNumber(params.value),
  //   pinned: 'left',
  //   width: 150,
  // },

  // {
  //   headerName: 'Parliamentary Terms',
  //   field: 'parliamentary_term_setup_id',
  //   sortable: true,
  //   filter: true,
  //   pinned: 'left',
  // },

  {
    headerName: 'January',
    field: 'january',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'February',
    field: 'february',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'March',
    field: 'march',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'April',
    field: 'april',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  { headerName: 'May', field: 'may', sortable: true, filter: true, width: 100 },
  {
    headerName: 'June',
    field: 'june',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'July',
    field: 'july',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'August',
    field: 'august',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'September',
    field: 'september',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'October',
    field: 'october',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'November',
    field: 'november',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'December',
    field: 'december',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) =>
      params.value ? formatNumber(params.value) : '-',
  },
  {
    headerName: 'Total Annual Salary',
    field: 'total_contributions_with_intrest',
    sortable: true,
    filter: true,
    pinned: 'right',
    width: 150,

    valueFormatter: (params) => formatNumber(params.value),
  },
];

const ParliamentContributions = ({ id, clickedItem2 }) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => {
      const monthMap = item.lines.reduce((acc, line) => {
        const monthName = new Date(0, line.month - 1)
          .toLocaleString('default', { month: 'long' })
          .toLowerCase();
        acc[monthName] = line.contribution;
        return acc;
      }, {});

      return {
        id: item.id,
        no: index + 1 + pageSize * (pageNumber - 1),
        year: item.year,
        total_contributions: item.total_contributions,
        intrest: item.intrest,
        total_contributions_with_intrest: item.total_contributions_with_intrest,
        intrest_amount: item.intrest_amount,
        parliamentary_term_setup_id: item.parliamentary_term_setup_id,
        ...monthMap,
      };
    });
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
        {clickedItem ? (
          <Contributions
            parliamenterianTerms={parliamenterianTerms}
            id={id}
            apiEndpoint={endpoints.createParliamentContributions}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setClickedItem={setClickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            isBranch={false}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            id={clickedItem2?.id}
            isBranch={true}
            idLabel={'prospective_pensioner_id'}
            apiEndpoint={endpoints.createParliamentContributions}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>

      <div className="flex justify-between w-full items-center">
        <div className="flex gap-6 items-center">
          <Button
            variant="text"
            startIcon={<Add />}
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
          <Button
            variant="text"
            startIcon={<Launch />}
            onClick={() => {}}
            sx={{
              my: 2,
            }}
          >
            Generate Upload Template
          </Button>
          <Button
            variant="text"
            startIcon={<FileDownload />}
            onClick={() => {}}
            sx={{
              my: 2,
            }}
          >
            Import Parliamentary Contributions (xlsx)
          </Button>
        </div>
        <div className="">
          <Button
            variant="text"
            startIcon={<ArticleOutlined />}
            onClick={() => {}}
            sx={{
              my: 2,
            }}
          >
            Reports
          </Button>
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{
          height: '60vh',

          mt: '20px',

          overflowY: 'auto',
        }}
      >
        <AgGridReact
          columnDefs={columnDefs.map((col) => ({
            ...col,
            headerTooltip: col.headerName,
          }))}
          rowData={filteredData}
          pagination={false}
          domLayout="autoHeight"
          className="custom-grid"
          alwaysShowHorizontalScroll={true}
          // paginationPageSize={pageSize}
          onGridReady={(params) => {}}
          onRowClicked={(e) => {
            setOpenBaseCard(true);
            setClickedItem(e.data);
          }}
        />
      </div>
    </div>
  );
};

export default ParliamentContributions;
