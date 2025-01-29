import React, { useState } from 'react';
import { Tabs } from 'antd';

import NewPreclaim from '../NewPreclaim';
import AddPensionersWorkHistory from '../addWorkHistory/AddPensionersWorkHistory';
import AddBankDetails from '../AddBankDetails';
import AddDocuments from '../documents/AddDocuments';
import ViewBeneficiaries from '../ViewBeneficiaries';
import MaintenanceCase from '../maintenanceCase/MaintenanceCase';
import Deductions from '../deductions/Deductions';
import ParliamentContributions from '../Contributions/ParliamentContributions';
import WomenAndChildren from '../wcps/WomenAndChildren';
import WcpsCard from '../wcps/WcpsCard';
import { useMda } from '@/context/MdaContext';
import Liabilities from '../liabilities/Liabilities';
import GovernmentSalary from '../governmentSalary/GovernmentSalary';
import NextOfKin from '../NextOfKin';

const { TabPane } = Tabs;

function CreateProspectivePensioner({ clickedItem, setOpenBaseCard }) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState('1');

  const activeRetireeId =
    retireeId !== null ? retireeId : clickedItem ? clickedItem.id : undefined;

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    //setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
  };

  const { activeCapName } = useMda();

  /** {
            "surname": "Kui",
            "first_name": "Maijui",
            "other_name": "Huyion",
            "identifier": "9873883",
            "identifier_type": 1,
            "national_id": null,
            "relationship_id": "28314bdf-4f81-411d-9da4-a36504aa8435",
            "mobile_number": "+254799893883",
            "address": "67",
            "email_address": "jui@mail.com",
            "city": "Nairobi",
            "status": 0,
            "percentage": null,
            "relationship": {
                "name": "Husband",
                "description": "Husband",
                "is_spouse": true,
                "gender": 0,
                "id": "28314bdf-4f81-411d-9da4-a36504aa8435",
                "created_by": null,
                "created_date": "2024-09-30T12:07:59.157627Z",
                "updated_by": null,
                "updated_date": null
            },
            "id": "e01f8d5b-68fd-4e7d-bd6d-7bb3fb1eef8e",
            "created_by": null,
            "created_date": "2025-01-29T12:35:21.55743Z",
            "updated_by": null,
            "updated_date": null
        } */
  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-auto   ">
      <div>
        <div>
          <div className="px-5 mt-[-10px]">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="!bg-transparent z-50"
              style={{ zIndex: 999999999 }}
              tabBarExtraContent={<div className="bg-primary h-1" />} // Custom ink bar style
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
                    setOpenBaseCard={setOpenBaseCard}
                    setRetireeId={setRetireeId}
                    retireeId={activeRetireeId}
                    moveToNextTab={moveToNextTab}
                    moveToPreviousTab={moveToPreviousTab}
                    clickedItem={clickedItem}
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
                        status={clickedItem?.notification_status}
                        clickedItem={clickedItem}
                        id={activeRetireeId}
                        name={clickedItem ? clickedItem.first_name : undefined}
                        moveToNextTab={moveToNextTab}
                        moveToPreviousTab={moveToPreviousTab}
                      />
                    </TabPane>
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Government Salary
                        </span>
                      }
                      key="9"
                    >
                      <GovernmentSalary
                        id={clickedItem?.id}
                        clickedItem={clickedItem}
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
                        clickedItem2={clickedItem}
                        status={clickedItem.notification_status}
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
                          Next Of Kin Details
                        </span>
                      }
                      key="6"
                    >
                      <NextOfKin clickedItem={clickedItem} />
                    </TabPane>
                    {clickedItem?.maintenance_case === 0 && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Maintenance Case
                          </span>
                        }
                        key="7"
                      >
                        <div className="z-10">
                          <MaintenanceCase
                            id={clickedItem.id}
                            clickedItem2={clickedItem}
                          />
                        </div>
                      </TabPane>
                    )}
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Deductions
                        </span>
                      }
                      key="8"
                    >
                      <Deductions
                        id={clickedItem?.id}
                        clickedItem2={clickedItem}
                      />
                    </TabPane>

                    {clickedItem?.is_wcps === 0 && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Women & Children Contributions Scheme
                          </span>
                        }
                        key="9"
                      >
                        <WcpsCard
                          id={clickedItem?.id}
                          clickedItem2={clickedItem}
                        />
                      </TabPane>
                    )}

                    {(activeCapName === 'CAP196' ||
                      clickedItem?.mda_pensionCap_name === 'CAP196') && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Parliament Contributions
                          </span>
                        }
                        key="10"
                      >
                        <ParliamentContributions
                          id={clickedItem?.id}
                          clickedItem2={clickedItem}
                        />
                      </TabPane>
                    )}
                    {activeCapName === 'CAP199' && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Liabilities
                          </span>
                        }
                        key="11"
                      >
                        <Liabilities id={clickedItem?.id} />
                      </TabPane>
                    )}
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
