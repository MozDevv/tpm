import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { Button, Tooltip } from '@mui/material';
import BaseCard from '@/components/baseComponents/BaseCard';
import { dateFormatter, formatDate } from '@/utils/dateFormatter';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';

const { TabPane } = Tabs;

function WcpsCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  openAction,
  id,
  clickedItem2,
}) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState('1');

  const activeRetireeId = [];
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    console.log('Moving to next tab:', nextTab); // Debug line
    setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
  };

  const columnDefs = [
    { headerName: 'From Date', field: 'from_date' },
    { headerName: 'To Date', field: 'to_date' },
    { headerName: 'Salary ', field: 'salary_amount' },
    { headerName: 'Total Emoluments', field: 'total_emoluments' },
    { headerName: 'Contribution Amount', field: 'contribution_amount' },
  ];

  const [contributionLines, setContributionLines] = useState([]);
  const [referenceId, setReferenceId] = useState(null);
  const [effective_date, setEffectiveDate] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState(null);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getWcps(id));
      const data = res.data.data;

      console.log('Data', res.data.data[0]);
      setReferenceId(data[0].id);
      setEffectiveDate(data[0].effective_date);
      setReferenceNumber(data[0].reference_number);
      if (res.data.data[0].id) {
        const contributionLinesData =
          res.data.data[0].wcpsContributionLines.map((line) => ({
            from_date: new Date(line.from_date).toISOString().split('T')[0],
            to_date: new Date(line.to_date).toISOString().split('T')[0],
            salary_amount: line.salary_amount,
            total_emoluments: line.total_emoluments,
            contribution_amount: line.contribution_amount,
          }));

        setContributionLines(contributionLinesData);
        // await fetchContributionLines(res.data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchContributionLines = async (id) => {
    try {
      const res = await apiService.get(endpoints.getWcpsLine(id));
      const rawData = res.data.data;

      // Check if rawData exists and has at least one item
      if (rawData && rawData.length > 0) {
        const contributionLinesData = rawData[0].wcpsContributionLines.map(
          (line) => ({
            // from_date: new Date(line.from_date).toISOString().split("T")[0],
            //to_date: new Date(line.to_date).toISOString().split("T")[0],
            from_date: line.from_date,
            salary_amount: line.salary_amount,
            total_emoluments: line.total_emoluments,
            contribution_amount: line.contribution_amount,
          })
        );

        setContributionLines(contributionLinesData);
      } else {
        console.warn('No contribution lines found for the provided ID.');
        setContributionLines([]); // Optionally, clear the contribution lines if no data is found
      }
    } catch (error) {
      console.error('Error fetching contribution lines:', error);
    }
  };

  const [openInputCard, setOpenInputCard] = React.useState(false);
  const [clickedWcpsLine, setClickedWcpsLine] = React.useState(null);

  const [openAddReference, setOpenAddReference] = React.useState(false);

  useEffect(() => {
    fetchMaintenance();
  }, [openInputCard, openAddReference]);

  const inputFields = [
    {
      value: 'from_date',
      label: 'From Date',
      type: 'date',
      required: true,
    },
    {
      value: 'to_date',
      label: 'To Date',
      type: 'date',
      required: true,
    },
    {
      value: 'salary_amount',
      label: 'Salary Amount',
      type: 'amount',
      required: true,
      disabled: false,
    },
    {
      value: 'total_emoluments',
      label: 'Total Emoluments',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      value: 'contribution_amount',
      label: 'Contribution Amount(2%)',
      disabled: true,
      type: 'amount',
      required: true,
      disabled: true,
    },
  ];

  const refFields = [
    {
      name: 'reference_number',
      label: 'Reference Number',
      type: 'text',
      required: true,
    },
    {
      name: 'effective_date',
      label: 'Effective Date',
      type: 'date',
      required: true,
    },
  ];

  return (
    <div className="p-2 mt-2">
      <div>
        <div>
          <div className="px-5 mt-[20px]">
            <div className="ag-theme-quartz min-h-[100vh] overflow-auto">
              <div className="">
                <div className="text-primary font-montserrat text-base font-semibold mb-2">
                  WCPS Contribution Reference
                </div>
                <div className="flex flex-row gap-2">
                  {!referenceId && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpenAddReference(true);
                      }}
                      sx={{
                        my: 2,
                      }}
                    >
                      Add a Reference
                    </Button>
                  )}
                </div>
              </div>
              {
                <div className="p-4 bg-white rounded-lg  border border-gray-200 mb-10 ">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-gray-600 text-sm ">
                        <i className="fas fa-hashtag text-gray-400"></i>{' '}
                        Reference Number:
                      </div>
                      <div className="text-lg font-montserrat font-semibold text-gray-800">
                        {referenceNumber && referenceNumber}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto flex flex-row items-center gap-3">
                      <div className="text-gray-600 text-sm ">
                        <i className="fas fa-calendar-alt text-gray-400"></i>{' '}
                        Effective Date:
                      </div>
                      <div className="text-base font-semibold text-gray-800 font-montserrat">
                        {effective_date ? dateFormatter(effective_date) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              }

              <BaseCard
                openBaseCard={openAddReference}
                setOpenBaseCard={setOpenAddReference}
                title={'Add A Reference'}
                clickedItem={clickedItem}
                isUserComponent={false}
                deleteApiEndpoint={endpoints.deleteWcps(id)}
                deleteApiService={apiService.post}
                isSecondaryCard={true}
              >
                <BaseInputCard
                  id={id}
                  idLabel="prospective_pensioner_id"
                  fields={refFields}
                  apiEndpoint={endpoints.createWcps}
                  postApiFunction={apiService.post}
                  clickedItem={clickedItem}
                  setOpenBaseCard={setOpenAddReference}
                  useRequestBody={true}
                  isBranch={true}
                />
              </BaseCard>

              {referenceId && (
                <div className="">
                  <BaseInputTable
                    disableAll={
                      clickedItem2?.notification_status !== 2 &&
                      clickedItem2?.notification_status !== null &&
                      clickedItem2?.notification_status !== 0 &&
                      clickedItem2?.notification_status !== 3
                    }
                    title="WCPS Contributions Lines"
                    fields={inputFields}
                    id={referenceId}
                    idLabel="wCPS_contribution_id"
                    getApiService={apiService.get}
                    postApiService={apiService.post}
                    putApiService={apiService.put}
                    apiService={apiService}
                    deleteEndpoint={endpoints.deleteWcpsLine}
                    getEndpoint={endpoints.getWcpsLine(id)}
                    postEndpoint={endpoints.createWcpsLine}
                    putEndpoint={endpoints.updateWcpsLine}
                    passProspectivePensionerId={true}
                    domLayout="normal"
                    scrollable={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WcpsCard;
