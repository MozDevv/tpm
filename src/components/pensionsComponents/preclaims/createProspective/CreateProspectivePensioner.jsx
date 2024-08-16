import React, { useState } from "react";
import { Tabs } from "antd";

import NewPreclaim from "../NewPreclaim";
import AddPensionersWorkHistory from "../addWorkHistory/AddPensionersWorkHistory";
import AddBankDetails from "../AddBankDetails";
import AddDocuments from "../documents/AddDocuments";
import ViewBeneficiaries from "../ViewBeneficiaries";
import MaintenanceCase from "../maintenanceCase/MaintenanceCase";

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
    console.log("Moving to next tab:", nextTab); // Debug line
    setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
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
                    moveToPreviousTab={moveToPreviousTab}
                  />
                </div>
              </TabPane>
              {clickedItem?.notification_status &&
                clickedItem.notification_status !== 2 && (
                  <>
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
                        moveToPreviousTab={moveToPreviousTab}
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
                        moveToPreviousTab={moveToPreviousTab}
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
                        moveToPreviousTab={moveToPreviousTab}
                      />
                    </TabPane>
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Beneficiaries & Guardian Details
                        </span>
                      }
                      key="5"
                    >
                      <ViewBeneficiaries clickedItem={clickedItem} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Maintenance Case
                        </span>
                      }
                      key="6"
                    >
                      <MaintenanceCase id={clickedItem.id} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Deductions
                        </span>
                      }
                      key="7"
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Exercitationem ipsam vitae nihil molestiae porro
                      necessitatibus velit quasi, similique voluptatibus sunt
                      fugit, eveniet repudiandae voluptas deleniti asperiores
                      amet dolor ratione fugiat.
                    </TabPane>
                  </>
                )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProspectivePensioner;
