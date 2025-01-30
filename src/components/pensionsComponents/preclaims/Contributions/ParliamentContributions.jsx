import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
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
import axios from 'axios';
import { BASE_CORE_API } from '@/utils/constants';

const ParliamentContributions = ({ id, clickedItem2 }) => {
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
    {
      headerName: 'May',
      field: 'may',
      sortable: true,
      filter: true,
      width: 100,
    },
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
    // {
    //   headerName: 'Total Annual Salary',
    //   field: 'total_contributions_with_intrest',
    //   sortable: true,
    //   filter: true,
    //   pinned: 'right',
    //   width: 150,

    //   valueFormatter: (params) => formatNumber(params.value),
    // },
  ];
  const allTermsColDefs = [
    {
      headerName: 'Start Date',
      field: 'startDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
      flex: 1,
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
      flex: 1,
    },
    {
      headerName: 'Interest',
      field: 'intrest',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),

      flex: 1,
    },

    {
      headerName: 'Total Annual Salary',
      field: 'total_anual_salary',
      sortable: true,
      filter: true,
      pinned: 'right',
      flex: 1,

      valueFormatter: (params) => formatNumber(params.value),
    },
  ];
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

  const [parliamenterianTerms, setParliamentarianTerms] = useState([]);
  const fetchTerms = async () => {
    try {
      const res = await apiService.get(endpoints.getParliamentaryTermsSetups, {
        'paging.pageSize': 1000,
      });

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
      label: 'Parliamentary Terms',
      name: 'parliamentaryTermSetUpid',
      type: 'select',
      options: parliamenterianTerms.map((term) => ({
        id: term.id,
        name: term.name,
      })),
    },
    {
      name: 'contributioFile',
      label: 'Upload Parliamentary Term Excel',
      type: 'file',

      fileName: 'UploadParliamentary Term Excel',
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(
        endpoints.getParliamentaryContributions(id)
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

  const generateMembersTemplate = async () => {
    try {
      // Fetch the file as a blob
      const response = await axios.get(
        `${BASE_CORE_API}api/Contribution/DownloadParliamenterianTemplate
`,
        {
          responseType: 'blob', // Specify that the response is a binary Blob
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Parliamentary Term Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error('Error downloading te file:', error);
    }
  };

  const handlePreview = async (file) => {
    const formData = new FormData();
    formData.append('prospectivePensionerId', id);
    formData.append('contributioFile', file);

    try {
      const res = await apiService.post(
        endpoints.previewParliamentaryContributions,
        formData
      );

      if (res.data.succeeded) {
        setFilteredData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <>
            <BaseInputCard
              fields={fields}
              id={clickedItem2?.id}
              isBranch={true}
              handlePreview={handlePreview}
              idLabel={'prospectivePensionerId'}
              apiEndpoint={endpoints.uploadParliamentaryContributions}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={false}
              setOpenBaseCard={setOpenBaseCard}
            />
            {filteredData && filteredData.length > 0 && (
              <div className="px-6 bg-gray-100 min-h-[300px] max-h-[600px] h-[200px]">
                <AgGridReact
                  columnDefs={columnDefs.map((col) => ({
                    ...col,
                    headerTooltip: col.headerName,
                  }))}
                  rowData={filteredData}
                  pagination={false}
                  domLayout="autoHeight"
                  className="custom-grid ag-theme-quartz"
                  alwaysShowHorizontalScroll={true}
                  onGridReady={(params) => {}}
                  onRowClicked={(e) => {
                    setOpenBaseCard(true);
                    setClickedItem(e.data);
                  }}
                />
              </div>
            )}
          </>
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
            New Parliamentary Contributions
          </Button>
          <Button
            variant="text"
            startIcon={<Launch />}
            onClick={() => {
              generateMembersTemplate();
            }}
            sx={{
              my: 2,
            }}
          >
            Generate Upload Template
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
          columnDefs={allTermsColDefs.map((col) => ({
            ...col,
            headerTooltip: col.headerName,
          }))}
          rowData={filteredData}
          pagination={false}
          domLayout="autoHeight"
          className="custom-grid"
          alwaysShowHorizontalScroll={true}
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
