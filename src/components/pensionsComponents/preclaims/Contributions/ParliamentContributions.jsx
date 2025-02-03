import React, { use, useEffect, useState } from 'react';

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
import BaseInputTable from '@/components/baseComponents/BaseInputTable';

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

    {
      headerName: 'January',
      field: 'january',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'February',
      field: 'february',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'March',
      field: 'march',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'April',
      field: 'april',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'May',
      field: 'may',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: 'June',
      field: 'june',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'July',
      field: 'july',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'August',
      field: 'august',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'September',
      field: 'september',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'October',
      field: 'october',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'November',
      field: 'november',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) =>
        params.value ? formatNumber(params.value) : '-',
    },
    {
      headerName: 'December',
      field: 'december',
      sortable: true,
      filter: true,
      width: 150,
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
      return {
        ...item,
        no: index + 1,
      };
    });
  };

  //

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [tableInputData, setTableInputData] = useState([]);

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
    ? //add start and end date
      `${parseDate(clickedItem.startDate)} to ${parseDate(
        clickedItem.endDate
      )} Contributions`
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
      name: 'contributionFile',
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
    setTableInputData([]);
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

  const [previewData, setPreviewData] = useState([]);

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
        setPreviewData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fields2 = [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
    },
    {
      name: 'total_anual_salary',
      label: 'Total Annual Salary',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'intrest',
      label: 'Interest',
      type: 'amount',
      disabled: true,
    },

    // Add other fields as needed
  ];

  const tableFields = [
    {
      value: 'year',
      label: 'Year',
      type: 'select',
      required: true,
      options: Array.from(
        { length: new Date().getFullYear() - 1900 + 1 },
        (_, i) => {
          const year = 1900 + i;
          return {
            id: year,
            name: year.toString(),
          };
        }
      ),
    },
    {
      value: 'january',
      label: 'January',
      type: 'amount',
      required: true,
    },
    {
      value: 'february',
      label: 'February',
      type: 'amount',
      required: true,
    },
    {
      value: 'march',
      label: 'March',
      type: 'amount',
      required: true,
    },
    {
      value: 'april',
      label: 'April',
      type: 'amount',
      required: true,
    },
    {
      value: 'may',
      label: 'May',
      type: 'amount',
      required: true,
    },
    {
      value: 'june',
      label: 'June',
      type: 'amount',
      required: true,
    },
    {
      value: 'july',
      label: 'July',
      type: 'amount',
      required: true,
    },
    {
      value: 'august',
      label: 'August',
      type: 'amount',
      required: true,
    },
    {
      value: 'september',
      label: 'September',
      type: 'amount',
      required: true,
    },
    {
      value: 'october',
      label: 'October',
      type: 'amount',
      required: true,
    },
    {
      value: 'november',
      label: 'November',
      type: 'amount',
      required: true,
    },
    {
      value: 'december',
      label: 'December',
      type: 'amount',
      required: true,
    },
  ];

  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteParliamentContributions(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
        isSecondaryCard={true}
        setClickedItem={setClickedItem}
      >
        {clickedItem ? (
          <>
            <BaseInputCard
              //** add these 4 fields   "total_anual_salary": 1240529, "intrest": 186079.35, "startDate": "2013-01-31T00:00:00Z",   "endDate": "2013-12-31T00:00:00Z"   */
              fields={fields2}
              id={clickedItem2?.id}
              isBranch={true}
              idLabel={'prospective_pensioner_id'}
              apiEndpoint={endpoints.updateParliamentContributions}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
              setClickedItem={setClickedItem}
              tableInputData={tableInputData}
              isAddMoreFields={true}
            />

            <div className="px-2">
              <BaseInputTable
                title="Contibution Lines"
                fields={tableFields}
                getApiService={apiService.get}
                postApiService={apiService.post}
                putApiService={apiService.put}
                getEndpoint={endpoints.getParliamentContributionsById(
                  clickedItem2?.id,
                  clickedItem?.id
                )}
                disableAll={
                  clickedItem2?.notification_status !== 2 &&
                  clickedItem2?.notification_status !== null &&
                  clickedItem2?.notification_status !== 0 &&
                  clickedItem2?.notification_status !== 3
                }
                postEndpoint={endpoints.createDeductions}
                putEndpoint={endpoints.updateGovernmentSalary}
                passProspectivePensionerId={true}
                isAddMoreFields={true}
                setTableInputData={setTableInputData}
              />
            </div>
          </>
        ) : (
          <>
            <BaseInputCard
              fields={fields}
              id={clickedItem2?.id}
              isBranch={true}
              handlePreview={handlePreview}
              idLabel={'prospective_pensioner_id'}
              apiEndpoint={endpoints.uploadParliamentaryContributions}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={false}
              setOpenBaseCard={setOpenBaseCard}
              setClickedItem={setClickedItem}
            />
            {previewData && previewData.length > 0 && (
              <div className="px-6 bg-gray-100 min-h-[300px] max-h-[600px] h-[200px]">
                <AgGridReact
                  columnDefs={columnDefs.map((col) => ({
                    ...col,
                    headerTooltip: col.headerName,
                  }))}
                  rowData={previewData}
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
            disabled={
              clickedItem2?.notification_status !== 2 &&
              clickedItem2?.notification_status !== null &&
              clickedItem2?.notification_status !== 0 &&
              clickedItem2?.notification_status !== 3
            }
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
            disabled={
              clickedItem2?.notification_status !== 2 &&
              clickedItem2?.notification_status !== null &&
              clickedItem2?.notification_status !== 0 &&
              clickedItem2?.notification_status !== 3
            }
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
