import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import endpoints, { apiService } from '@/components/services/setupsApi';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';

const { TabPane } = Tabs;

function BankCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  openAction,
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
    { headerName: 'Branch Code', field: 'branch_code' },
    { headerName: 'Branch Name', field: 'name' },
  ];

  const [branches, setBranches] = useState([]);

  const fetchBanksAndBranches = async () => {
    console.log('bank Id', clickedItem?.id);
    try {
      const res = await apiService.get(endpoints.getBankById(clickedItem?.id));
      const rawData = res.data.data;
      setBranches(
        res.data.data[0].branches.map((branch) => ({
          branch_code: branch.branch_code,
          name: branch.name,
          address: branch.address,
          branch_id: branch.id,
        }))
      );

      console.log('first branch', branches);
      console.log('res.data.data', res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, [openAction]);

  const branchFields = [
    {
      value: 'branch_code',
      label: 'Branch Code',
      type: 'text',
      required: true,
    },
    {
      value: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    { value: 'address', label: 'Address', type: 'text', required: true },
    { value: 'city', label: 'City', type: 'text', required: true },
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
                    Bank Information
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
                  <span className="text-primary font-montserrat">Branches</span>
                }
                key="2"
              >
                <div className="ag-theme-quartz max-h-[90vh]">
                  {' '}
                  <BaseInputTable
                    title="Branches"
                    fields={branchFields}
                    id={clickedItem.id}
                    idLabel="bank_id"
                    getApiService={apiService.get}
                    postApiService={apiService.post}
                    putApiService={apiService.put}
                    getEndpoint={endpoints.getAllBranchesByBankId(
                      clickedItem.id
                    )}
                    apiService={apiService}
                    deleteEndpoint={endpoints.deleteBankBranch}
                    postEndpoint={endpoints.createBankBranch}
                    //putEndpoint={endpoints.}
                    passProspectivePensionerId={true}
                    scrollable={true}
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

export default BankCard;
