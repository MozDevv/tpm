import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

import { AgGridReact } from "ag-grid-react";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button, Tooltip } from "@mui/material";
import BaseCard from "@/components/baseComponents/BaseCard";
import { dateFormatter, formatDate } from "@/utils/dateFormatter";

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
}) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState("1");

  const activeRetireeId = [];
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    console.log("Moving to next tab:", nextTab); // Debug line
    setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
  };

  const columnDefs = [
    { headerName: "From Date", field: "from_date" },
    { headerName: "To Date", field: "to_date" },
    { headerName: "Salary ", field: "salary_amount" },
    { headerName: "Total Emoluments", field: "total_emoluments" },
    { headerName: "Contribution Amount", field: "contribution_amount" },
  ];

  const [contributionLines, setContributionLines] = useState([]);
  const [referenceId, setReferenceId] = useState(null);
  const [effective_date, setEffectiveDate] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState(null);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getWcps(id));
      const data = res.data.data;

      console.log("Data", res.data.data[0]);
      setReferenceId(data[0].id);
      setEffectiveDate(data[0].effective_date);
      setReferenceNumber(data[0].reference_number);
      if (res.data.data[0].id) {
        const contributionLinesData =
          res.data.data[0].wcpsContributionLines.map((line) => ({
            from_date: new Date(line.from_date).toISOString().split("T")[0],
            to_date: new Date(line.to_date).toISOString().split("T")[0],
            salary_amount: line.salary_amount,
            total_emoluments: line.total_emoluments,
            contribution_amount: line.contribution_amount,
          }));

        setContributionLines(contributionLinesData);
        // await fetchContributionLines(res.data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
            from_date: new Date(line.from_date).toISOString().split("T")[0],
            to_date: new Date(line.to_date).toISOString().split("T")[0],
            salary_amount: line.salary_amount,
            total_emoluments: line.total_emoluments,
            contribution_amount: line.contribution_amount,
          })
        );

        setContributionLines(contributionLinesData);
      } else {
        console.warn("No contribution lines found for the provided ID.");
        setContributionLines([]); // Optionally, clear the contribution lines if no data is found
      }
    } catch (error) {
      console.error("Error fetching contribution lines:", error);
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
      name: "from_date",
      label: "From Date",
      type: "date",
      required: true,
    },
    {
      name: "to_date",
      label: "To Date",
      type: "date",
      required: true,
    },
    {
      name: "salary_amount",
      label: "Salary Amount",
      type: "number",
      required: true,
    },
    {
      name: "total_emoluments",
      label: "Total Emoluments",
      type: "number",
      required: true,
    },
    {
      name: "contribution_amount",
      label: "Contribution Amount",
      type: "number",
      required: true,
    },
  ];

  const refFields = [
    {
      name: "reference_number",
      label: "Reference Number",
      type: "text",
      required: true,
    },
    {
      name: "effective_date",
      label: "Effective Date",
      type: "date",
      required: true,
    },
  ];

  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-auto mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px]">
            <div className="ag-theme-quartz max-h-[90vh]">
              <div className="flex flex-row gap-2">
                {!referenceId ? (
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
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenInputCard(true);
                      setClickedWcpsLine(null);
                    }}
                    sx={{
                      my: 2,
                    }}
                  >
                    Add WCPS Contribution
                  </Button>
                )}
              </div>
              {referenceId && (
                <div className="p-4 bg-white rounded-lg  border border-gray-200 mb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-gray-600 text-sm ">
                        <i className="fas fa-hashtag text-gray-400"></i>{" "}
                        Reference Number:
                      </div>
                      <div className="text-lg font-montserrat font-semibold text-gray-800">
                        {referenceNumber}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto flex flex-row items-center gap-3">
                      <div className="text-gray-600 text-sm ">
                        <i className="fas fa-calendar-alt text-gray-400"></i>{" "}
                        Effective Date:
                      </div>
                      <div className="text-base font-semibold text-gray-800 font-montserrat">
                        {dateFormatter(effective_date)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <BaseCard
                openBaseCard={openAddReference}
                setOpenBaseCard={setOpenAddReference}
                title={"Add A Reference"}
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
                  setOpenBaseCard={setOpenBaseCard}
                  useRequestBody={true}
                  isBranch={true}
                />
              </BaseCard>

              <BaseCard
                openBaseCard={openInputCard}
                setOpenBaseCard={setOpenInputCard}
                title={"WCPS Contribution"}
                // clickedItem={clickedItem}
                isUserComponent={false}
                deleteApiEndpoint={endpoints.deleteWcpsLine(clickedItem?.id)}
                deleteApiService={apiService.delete}
                isSecondaryCard2={true}
              >
                {clickedWcpsLine ? (
                  <BaseInputCard
                    fields={inputFields}
                    apiEndpoint={endpoints.updateWcpsLine}
                    postApiFunction={apiService.put}
                    clickedItem={clickedWcpsLine}
                    openBaseCard={openInputCard}
                    setOpenBaseCard={setOpenInputCard}
                    useRequestBody={true}
                    id={referenceId}
                    idLabel="wCPS_contribution_id"
                  />
                ) : (
                  <BaseInputCard
                    id={referenceId}
                    idLabel="wCPS_contribution_id"
                    fields={inputFields}
                    apiEndpoint={endpoints.createWcpsLine}
                    postApiFunction={apiService.post}
                    clickedItem={clickedItem}
                    setOpenBaseCard={setOpenBaseCard}
                    useRequestBody={true}
                    isBranch={true}
                  />
                )}
              </BaseCard>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={contributionLines}
                pagination={false}
                domLayout="autoHeight"
                onGridReady={(params) => {
                  params.api.sizeColumnsToFit();
                  //  onGridReady(params);
                }}
                onRowClicked={(e) => {
                  setOpenInputCard(true);
                  setClickedWcpsLine(e.data);
                  // setUserClicked(e.data);
                  //handleClickUser(e.data);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WcpsCard;
