import React, { useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import endpoints, { apiService } from '@/components/services/setupsApi';

const { TabPane } = Tabs;

function CountyCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
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
    //{ headerName: "B", field: "branch_code" },
    { headerName: 'Constituency Name', field: 'constituency_name' },
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
                    County Information
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
                    setOpenBaseCard={setOpenBaseCard}
                    useRequestBody={true}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Constituencies
                  </span>
                }
                key="2"
              >
                <div className="ag-theme-quartz max-h-[90vh]">
                  <BaseInputTable
                    title="Constituencies"
                    fields={[
                      {
                        value: 'constituency_name',
                        label: 'Constituency Name',
                        type: 'text',
                        required: true,
                      },
                    ]}
                    scrollable={true}
                    id={clickedItem?.id}
                    idLabel="county_id"
                    getApiService={apiService.get}
                    postApiService={apiService.post}
                    putApiService={apiService.put}
                    getEndpoint={endpoints.getConstituenciesByCounty(
                      clickedItem?.id
                    )}
                    postEndpoint={endpoints.createConstituency}
                    putEndpoint={endpoints.updateGovernmentSalary}
                    passProspectivePensionerId={true}
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

export default CountyCard;
