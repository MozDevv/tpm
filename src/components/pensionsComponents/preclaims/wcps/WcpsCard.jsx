import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

import { AgGridReact } from "ag-grid-react";
import endpoints, { apiService } from "@/components/services/setupsApi";

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
    { headerName: "Salary ", field: "salary Ammount" },
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
          salary_ammount: line.salary_ammount,
          total_emoluments: line.total_emoluments,
          contribution_amount: line.contribution_amount,
        }))
      );

      console.log("first branch", branches);
      console.log("res.data.data", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchContributionLines();
  }, [openAction]);

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
                    Contribution Lines
                  </span>
                }
                key="2"
              >
                <div className="ag-theme-quartz max-h-[90vh]">
                  {" "}
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={constributionLines}
                    pagination={false}
                    domLayout="autoHeight"
                    onGridReady={(params) => {
                      params.api.sizeColumnsToFit();
                      //  onGridReady(params);
                    }}
                    onRowClicked={(e) => {
                      //  setOpenBaseCard(true);
                      //    setClickedItem(e.data);
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
