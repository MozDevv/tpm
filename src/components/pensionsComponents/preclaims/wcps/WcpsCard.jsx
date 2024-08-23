import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

import { AgGridReact } from "ag-grid-react";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button } from "@mui/material";
import BaseCard from "@/components/baseComponents/BaseCard";

const { TabPane } = Tabs;

function WcpsCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  openAction,
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
  const fetchContributionLines = async () => {
    console.log("bank Id", clickedItem?.id);
    try {
      const res = await apiService.get(endpoints.getWcpsLine(clickedItem?.id));
      const rawData = res.data.data;
      setContributionLines(
        res.data.data.map((line) => ({
          from_date: new Date(line.from_date).toISOString().split("T")[0],
          to_date: new Date(line.to_date).toISOString().split("T")[0],
          salary_amount: line.salary_amount,
          total_emoluments: line.total_emoluments,
          contribution_amount: line.contribution_amount,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [openInputCard, setOpenInputCard] = React.useState(false);
  const [clickedWcpsLine, setClickedWcpsLine] = React.useState(null);

  useEffect(() => {
    fetchContributionLines();
  }, [openAction, openInputCard]);
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

  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-auto mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px]">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="!bg-transparent" // Remove default background
              tabBarExtraContent={<div className="!bg-primary h-1" />} // Custom ink bar style
            >
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Contributions
                  </span>
                }
                key="1"
              >
                <div className="ag-theme-quartz max-h-[90vh]">
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

                  <BaseCard
                    openBaseCard={openInputCard}
                    setOpenBaseCard={setOpenInputCard}
                    title={"WCPS Contribution"}
                    // clickedItem={clickedItem}
                    isUserComponent={false}
                    deleteApiEndpoint={endpoints.deleteWcpsLine(
                      clickedItem?.id
                    )}
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
                        id={clickedItem?.id}
                        idLabel="wCPS_contribution_id"
                      />
                    ) : (
                      <BaseInputCard
                        id={clickedItem?.id}
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
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WcpsCard;
