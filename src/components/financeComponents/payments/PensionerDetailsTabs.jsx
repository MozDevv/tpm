import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import AddPensionersWorkHistory from '@/components/pensionsComponents/preclaims/addWorkHistory/AddPensionersWorkHistory';
import GovernmentSalary from '@/components/pensionsComponents/preclaims/governmentSalary/GovernmentSalary';
import AddDocuments from '@/components/pensionsComponents/preclaims/documents/AddDocuments';
import MaintenanceCase from '@/components/pensionsComponents/preclaims/maintenanceCase/MaintenanceCase';

import Liabilities from '@/components/pensionsComponents/preclaims/liabilities/Liabilities';
import AddBankDetails from '@/components/pensionsComponents/preclaims/AddBankDetails';
import Deductions from '@/components/pensionsComponents/preclaims/deductions/Deductions';
import WcpsCard from '@/components/pensionsComponents/preclaims/wcps/WcpsCard';
import ParliamentContributions from '@/components/pensionsComponents/preclaims/Contributions/ParliamentContributions';
import AssessmentDetails from '@/components/assessment/assessmentDataCapture/AssessmentDetails';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import PensionerDetails from '@/components/assessment/assessmentDataCapture/PensionerDetails';
import NewPreclaim from '@/components/pensionsComponents/preclaims/NewPreclaim';

const { TabPane } = Tabs;

function AssessmentCard({
  clickedItem,
  claimId,
  claim,
  isOldCase,
  children,
  childTitle,
  isIgc,
}) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState('1');
  const [qualifyingService, setQualifyingService] = useState([]);
  const [pensionableService, setPensionableService] = useState([]);
  const [viewBreakDown, setViewBreakDown] = useState(false);

  const activeRetireeId =
    retireeId !== null ? retireeId : clickedItem ? clickedItem.id : undefined;

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

  const getClaimQualifyingService = async (id) => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimQualyfyingService(id)
      );
      setQualifyingService(res.data.data);
    } catch (error) {
      console.log('Error getting claim qualifying service:', error);
    }
  };
  const getClaimPensionableService = async (id) => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimPensionableService(id)
      );
      setPensionableService(res.data.data);
    } catch (error) {
      console.log('Error getting claim pensionable service:', error);
    }
  };

  useEffect(() => {
    getClaimPensionableService(claimId);
    getClaimQualifyingService(claimId);
  }, [claimId]);

  // const { activeCapName } = useMda();
  return (
    <div className="p-2  overflow-auto">
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
                    {childTitle || 'Payment Details'}
                  </span>
                }
                key="1"
              >
                <div className="">{children}</div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Pensioner Information
                  </span>
                }
                key="12"
              >
                <div className="h-[550px] overflow-y-auto">
                  {(claim?.prospectivePensionerId && claim.source !== 0) ||
                  isOldCase ? (
                    <PensionerDetails
                      isPayment={true}
                      clickedItem={claim}
                      retireeId={claim?.prospectivePensionerId}
                    />
                  ) : isIgc ? (
                    <NewPreclaim
                      status={5}
                      retireeId={clickedItem?.id}
                      clickedItem={clickedItem}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Computation
                  </span>
                }
                key="2"
              >
                <div className="">
                  <AssessmentDetails
                    clickedItem={claim}
                    setRetireeId={setRetireeId}
                    retireeId={activeRetireeId}
                    pensionableService={pensionableService}
                    qualifyingService={qualifyingService}
                    isPayment={true}
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
                      key="10"
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
                        status={clickedItem.notification_status}
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

                    {clickedItem?.maintenance_case === 0 && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Maintenance Case
                          </span>
                        }
                        key="6"
                      >
                        <div className="z-10">
                          <MaintenanceCase id={clickedItem.id} />
                        </div>
                      </TabPane>
                    )}

                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Deductions
                        </span>
                      }
                      key="7"
                    >
                      <Deductions
                        id={clickedItem?.id}
                        clickedItem2={clickedItem}
                      />
                    </TabPane>
                    {/* <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Deductions
                        </span>
                      }
                      key="7"
                    >
                      <Deductions id={clickedItem?.id} />
                    </TabPane>

                    */}
                    {clickedItem?.is_wcps === 0 && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Women & Children Contributions Scheme
                          </span>
                        }
                        key="8"
                      >
                        <WcpsCard id={clickedItem?.id} />
                      </TabPane>
                    )}

                    {clickedItem?.mda_pensionCap_name === 'CAP196' && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Parliament Contributions
                          </span>
                        }
                        key="10"
                      >
                        <ParliamentContributions id={clickedItem?.id} />
                      </TabPane>
                    )}

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
                  </>
                )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentCard;
