"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button } from "@mui/material";

import { name } from "dayjs/locale/en-au";
import ExitGroundsCard from "./ExitGroundsCard";
import TabPane from "antd/es/tabs/TabPane";
import { Tabs } from "antd";

const columnDefs = [
  {
    field: "code",
    headerName: "Code",
    headerClass: "prefix-header",
    filter: true,
  },

  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },

  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "has_commutation",
    headerName: "Commutable",
    headerClass: "prefix-header",
    filter: true,
  },
];

const ExitGrounds = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const pageSize = 100;
  const pageNumber = 1;

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      code: item.code,
      description: item.description,
      pensionAwards: item.pensionAwards,
      name: item.name,
      id: item.id,
      awardDocuments: item.awardDocuments,
      has_commutation: item.has_commutation ? true : false,
      pension_cap_id: item.pension_cap_id,
      is_death: item.is_death,
    }));
  };

  const handlers = {
    filter: () => console.log("Filter clicked"),
    openInExcel: () => console.log("Export to Excel clicked"),
    // create: () => {
    //   setOpenBaseCard(true);
    //   setClickedItem(null);
    // },
    // edit: () => console.log("Edit clicked"),
    // delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => console.log("Notify clicked"),
  };

  const baseCardHandlers = {
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? `${clickedItem.name} Pension Awards`
    : "Create New Pension Award";

  const [pensionCaps, setPensionCaps] = React.useState([]);

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps);
      if (res.status === 200) {
        setPensionCaps(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []);
  const fields = [
    { name: "code", label: "Code", type: "text", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "pension_cap_id",
      label: "Pension Cap",
      type: "select",
      required: true,
      options: pensionCaps.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    // {
    //   name: "start_date",
    //   label: "Start Date",
    //   type: "date",
    //   //  required: true,
    // },
    // {
    //   name: "end_date",
    //   label: "End Date",
    //   type: "date",
    //   // required: true,
    // },
    {
      name: "has_commutation",
      label: "Commutable",
      type: "switch",
      required: true,
    },
    {
      name: "is_death",
      label: "Is Death",
      type: "switch",
      required: true,
    },
  ];
  const [activeKey, setActiveKey] = React.useState("1");
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            className="!bg-transparent ml-4"
            tabBarExtraContent={<div className="!bg-primary h-1" />} // Custom ink bar style
          >
            <TabPane
              tab={
                <span className="text-primary font-montserrat">
                  Exit Ground Information
                </span>
              }
              key="1"
            >
              <BaseInputCard
                fields={fields}
                apiEndpoint={endpoints.editExitReason}
                postApiFunction={apiService.put}
                clickedItem={clickedItem}
                setOpenBaseCard={setOpenBaseCard}
                useRequestBody={true}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="text-primary font-montserrat">Documents</span>
              }
              key="2"
            >
              <ExitGroundsCard
                fields={fields}
                apiEndpoint={endpoints.editPensionAwards}
                postApiFunction={apiService.post}
                clickedItem={clickedItem}
                setOpenBaseCard={setOpenBaseCard}
                useRequestBody={true}
              />
            </TabPane>
            {/* <TabPane
              tab={
                <span className="text-primary font-montserrat">
                  Pension Caps
                </span>
              }
              disabled={true}
              key="3"
            >
              <ExitGroundsCard
                fields={fields}
                apiEndpoint={endpoints.editPensionAwards}
                postApiFunction={apiService.post}
                clickedItem={clickedItem}
                setOpenBaseCard={setOpenBaseCard}
                useRequestBody={true}
              />
            </TabPane> */}
          </Tabs>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.pensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getExitGrounds}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Exit Grounds"
        currentTitle="Exit Grounds"
      />
    </div>
  );
};

export default ExitGrounds;
