import React, { useEffect, useState } from 'react';
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
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import { mapRowData } from '../Preclaims';
import { useLoadedRetireeDetailsStore } from '@/zustand/store';
import BeneficiaryInfoTab from '../../ClaimsManagementTable/BeneficiaryInfoTab';

const { TabPane } = Tabs;

function CreateProspectivePensioner({
  clickedItem,
  setOpenBaseCard,
  setOnCloseWarnings,
  status,
  isPreclaim,
}) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState('1');
  const [retiree, setRetiree] = useState({});
  const [loading, setLoading] = useState(true);

  const { setLoadedRetireeDetails } = useLoadedRetireeDetailsStore();
  const activeRetireeId =
    retireeId !== null ? retireeId : clickedItem ? clickedItem.id : undefined;

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const fetchRetiree = async () => {
    setLoading(true);
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(clickedItem?.id)
      );

      const mappedRetiree = mapRowData(res.data.data);

      setRetiree(mappedRetiree[0]);
      setLoadedRetireeDetails(mappedRetiree[0]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (activeRetireeId) {
      fetchRetiree();
    }
  }, []);
  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    //setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
  };

  const { activeCapName } = useMda();

  return (
    <div className="p-2 h-[90vh] max-h-[90vh] overflow-auto  z-10 ">
      <div>
        <div>
          <div className="px-5 mt-[-10px] z-40">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="!bg-transparent z-40"
              style={{ zIndex: 1 }}
              tabBarExtraContent={<div className="bg-primary h-1" />} // Custom ink bar style
            >
              {(clickedItem?.claim_type === 1 ||
                clickedItem?.claim_type === 2) && (
                <>
                  <TabPane
                    tab={
                      <span className="text-primary font-montserrat">
                        Dependant Information
                      </span>
                    }
                    key="1"
                    style={{ zIndex: 1 }}
                  >
                    <BeneficiaryInfoTab
                      clickedItem={
                        clickedItem?.igc_beneficiary_track?.beneficiary
                      }
                    />
                  </TabPane>
                </>
              )}

              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    General Information
                  </span>
                }
                key={
                  clickedItem?.claim_type === 1 || clickedItem?.claim_type === 2
                    ? '17'
                    : '1'
                }
                style={{ zIndex: 1 }}
              >
                <div className="">
                  <NewPreclaim
                    status={status}
                    isPreclaim={isPreclaim}
                    setOpenBaseCard={setOpenBaseCard}
                    setRetireeId={setRetireeId}
                    retireeId={activeRetireeId}
                    moveToNextTab={moveToNextTab}
                    moveToPreviousTab={moveToPreviousTab}
                    clickedItem={retiree}
                    setOnCloseWarnings={setOnCloseWarnings}
                  />
                </div>
              </TabPane>
              {clickedItem?.notification_status &&
                clickedItem.notification_status !== 1 &&
                clickedItem?.notification_status !== 2 && (
                  <>
                    <TabPane
                      tab={
                        <span className="text-primary font-montserrat">
                          Bank Details
                        </span>
                      }
                      key="2"
                      style={{ zIndex: 1 }}
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
                      style={{ zIndex: 1 }}
                    >
                      <AddPensionersWorkHistory
                        status={clickedItem?.notification_status}
                        clickedItem={clickedItem}
                        id={clickedItem?.id}
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
                      key="13"
                      style={{ zIndex: 1 }}
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
                      style={{ zIndex: 1 }}
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
                      style={{ zIndex: 1 }}
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
                      style={{ zIndex: 1 }}
                    >
                      <NextOfKin clickedItem={clickedItem} />
                    </TabPane>
                    {retiree?.maintenance_case === 0 && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Maintenance Case
                          </span>
                        }
                        key="7"
                        style={{ zIndex: 1 }}
                      >
                        <div style={{ zIndex: 1 }}>
                          <MaintenanceCase
                            id={clickedItem.id}
                            clickedItem2={retiree}
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
                      style={{ zIndex: 1 }}
                    >
                      <Deductions
                        id={clickedItem?.id}
                        clickedItem2={clickedItem}
                      />
                    </TabPane>
                    {retiree.is_wcps && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Women & Children Contributions Scheme
                          </span>
                        }
                        key=""
                        style={{ zIndex: 1 }}
                      >
                        <WcpsCard
                          // isWcpsProforma={retiree?.has_wcps_proforma_recovery}
                          id={clickedItem?.id}
                          clickedItem2={retiree}
                        />
                      </TabPane>
                    )}
                    {retiree.has_wcps_proforma_recovery && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Women & Children Contributions Scheme Proforma
                          </span>
                        }
                        key="15"
                        style={{ zIndex: 1 }}
                      >
                        <WcpsCard
                          isWcpsProforma={retiree?.has_wcps_proforma_recovery}
                          id={clickedItem?.id}
                          clickedItem2={retiree}
                        />
                      </TabPane>
                    )}
                    {(activeCapName === 'CAP196' ||
                      retiree?.mda_pensionCap_name === 'CAP196') && (
                      <TabPane
                        tab={
                          <span className="text-primary font-montserrat">
                            Parliament Contributions
                          </span>
                        }
                        key="10"
                        style={{ zIndex: 1 }}
                      >
                        <ParliamentContributions
                          id={clickedItem?.id}
                          clickedItem2={retiree}
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
                        style={{ zIndex: 1 }}
                      >
                        <Liabilities id={retiree?.id} />
                      </TabPane>
                    )}
                  </>
                )}
              {/* {clickedItem?.maintenance_case === 0 && (
                <TabPane
                  tab={
                    <span className="text-primary font-montserrat">
                      Maintenance Case
                    </span>
                  }
                  key="12"
                  style={{ zIndex: 1 }}
                >
                  <div style={{ zIndex: 1 }}>
                    <MaintenanceCase
                      id={clickedItem.id}
                      clickedItem2={clickedItem}
                    />
                  </div>
                </TabPane>
              )} */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProspectivePensioner;
