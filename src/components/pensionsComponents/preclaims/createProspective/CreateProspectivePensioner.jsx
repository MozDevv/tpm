import React, { useState } from "react";
import { Tabs } from "antd";

import NewPreclaim from "../NewPreclaim";
import AddPensionersWorkHistory from "../addWorkHistory/AddPensionersWorkHistory";
import AddBankDetails from "../AddBankDetails";
import AddDocuments from "../documents/AddDocuments";

const { TabPane } = Tabs;

function CreateProspectivePensioner({ clickedItem }) {
  console.log("clickedItem", clickedItem);

  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState("1");

  const activeRetireeId =
    retireeId !== null ? retireeId : clickedItem ? clickedItem.id : undefined;

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    setActiveKey(nextTab);
  };

  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-auto">
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
                    General Information
                  </span>
                }
                key="1"
              >
                <div className="">
                  <NewPreclaim
                    setRetireeId={setRetireeId}
                    retireeId={activeRetireeId}
                    moveToNextTab={moveToNextTab}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Bank Details
                  </span>
                }
                key="2"
              >
                <AddBankDetails
                  id={activeRetireeId}
                  moveToNextTab={moveToNextTab}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat overflow-hidden">
                    Work History
                  </span>
                }
                key="3"
              >
                <AddPensionersWorkHistory
                  id={activeRetireeId}
                  name={clickedItem ? clickedItem.first_name : undefined}
                  moveToNextTab={moveToNextTab}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Documents
                  </span>
                }
                key="4"
              >
                <AddDocuments
                  id={activeRetireeId}
                  moveToNextTab={moveToNextTab}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProspectivePensioner;
