import React, { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { AgGridReact } from "ag-grid-react";
import { formatDate } from "@/utils/dateFormatter";
import NumberingSections from "./NumberingSections";

const { TabPane } = Tabs;

function NoSeriesCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
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

  const noSeriesLineColDefs = [
    {
      field: "startingNumber",
      headerName: "Starting No",
      headerClass: "prefix-header",
      width: 180,
      filter: true,
    },
    {
      field: "endingNumber",
      headerName: "Ending No",
      headerClass: "prefix-header",
      width: 180,
      filter: true,
    },
    {
      field: "incrementByNumber",
      headerName: "Increment By",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "lastDateUsed",
      headerName: "Last Date Used",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "startingDate",
      headerName: "Starting Date",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "allowGapsInNumbers",
      headerName: "Allow Gaps In Numbers",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
  ];

  const numberSeriesLinefields = [
    {
      name: "startingDate",
      label: "Starting No",
      type: "number",
    },
    {
      name: "startingNumber",
      label: "Ending No",
      type: "text",
    },
    {
      name: "endingNumber",
      label: "Increment By",
      type: "text",
    },
    {
      name: "warningNumber",
      label: "Warning Number",
      type: "text",
    },
    {
      name: "lastDateUsed",
      label: "Start Date",
      type: "date",
    },
    {
      name: "incrementByNumber",
      label: "End Date",
      type: "number",
    },
    {
      name: "allowGapsInNumbers",
      label: "Allow Gaps In Numbers",
      type: "switch",
    },
  ];

  const [numberSeriesLine, setNumberSeriesLine] = useState([]);

  const getNumberSeriesLine = async () => {
    try {
      const response = await apiService.get(
        endpoints.getNumberSeriesLineByCode(clickedItem.code)
      );

      console.log("response", response.data.data[0].numberSeriesLines);

      setNumberSeriesLine(response.data.data[0].numberSeriesLines);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNumberSeriesLine();
  }, []);
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
                    No Series
                  </span>
                }
                key="1"
              >
                <div className="">
                  <BaseInputCard
                    fields={fields}
                    apiEndpoint={apiEndpoint}
                    postApiFunction={postApiFunction}
                    clickedItem={clickedItem}
                    useRequestBody={true}
                    setOpenBaseCard={setOpenBaseCard}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    No series Line
                  </span>
                }
                key="2"
              >
                {/* <BaseInputCard
                  fields={numberSeriesLinefields}
                  apiEndpoint={endpoints.createNumberSeries}
                  postApiFunction={apiService.post}
                  //clickedItem={clickedItem}
                  useRequestBody={true}
                  setOpenBaseCard={setOpenBaseCard}
                  id={clickedItem.id}
                  label="numberSeriesId"
                /> */}
                <div className="ag-theme-quartz w-full h-full">
                  <AgGridReact
                    columnDefs={noSeriesLineColDefs}
                    rowData={numberSeriesLine}
                    domLayout="autoHeight"
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Numbering Sections
                  </span>
                }
                key="3"
              >
                <NumberingSections />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoSeriesCard;
