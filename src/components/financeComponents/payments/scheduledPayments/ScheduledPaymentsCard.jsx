import React, { use, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import { apiService } from '@/components/services/financeApi';
import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import BaseFinanceInputCard from '@/components/baseComponents/BaseFinanceInputCard';
import BaseFinanceInputTable from '@/components/baseComponents/BaseFinanceInputTable';
import financeEndpoints from '@/components/services/financeApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatNumber } from '@/utils/numberFormatters';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';

const { TabPane } = Tabs;

function ScheduledPaymentsCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
  transformData,
  setClickedItem,
}) {
  const [scheduleLines, setScheduleLines] = useState([]);
  const [deductionsAndRefunds, setDeductionsAndRefunds] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchScheduleLines = async (id) => {
    try {
      const res = await apiService.get(
        financeEndpoints.getPaymentScheduleLines(id),
        {
          'paging.pageSize': 2000,
        }
      );
      if (res.status === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchDeductionsRefunds = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getRecoveryDeductions, {
        'paging.pageSize': 2000,
      });
      if (res.status === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    // fetchBanksAndBranches();
    fetchScheduleLines(clickedItem?.id).then((data) => {
      setScheduleLines(data);
    });
    fetchDeductionsRefunds().then((data) => {
      setDeductionsAndRefunds(data);
    });
  }, []);

  const tableFields = [
    {
      field: 'documentNo',
      headerName: 'Document No',
      filter: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      type: 'text',
      required: true,
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
    },
    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
    },
    {
      field: 'refundAmount',
      headerName: 'Refund Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
    },
    {
      field: 'pensionAmount',
      headerName: 'Pension Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
    },
    {
      field: 'deductionsAndRefundId',
      headerName: 'Deductions And Refund',
      type: 'text',
      required: true,
      valueFormatter: (params) => {
        const deduction = deductionsAndRefunds.find(
          (deduction) => deduction.id === params.value
        );
        return deduction?.description;
      },
    },

    {
      field: 'deductionAmount',
      headerName: 'Deduction Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
    },
    {
      field: 'refundDescription',
      headerName: 'Refund Description',
      type: 'text',
      required: true,
    },
  ];

  return (
    <div className="p-2   mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px] h-[95vh] max-h-[95vh] overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex-grow">
                {' '}
                {/* This allows the card to grow */}
                <BaseAutoSaveInputCard
                  setClickedItem={setClickedItem}
                  fields={fields}
                  apiEndpoint={financeEndpoints.addPayment}
                  putApiFunction={apiService.post}
                  updateApiEndpoint={financeEndpoints.updatePayment}
                  postApiFunction={apiService.post}
                  getApiEndpoint={financeEndpoints.getPaymentById(
                    clickedItem?.id
                  )}
                  getApiFunction={apiService.get}
                  transformData={transformData}
                  setOpenBaseCard={setOpenBaseCard}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                />
              </div>

              <BaseCollapse name="Schedule Lines" titleFontSize="24">
                <div className="flex-grow h-[350px] ag-theme-quartz mt-3 ">
                  {' '}
                  <AgGridReact
                    rowData={scheduleLines}
                    columnDefs={tableFields}
                    rowSelection="multiple"
                    defaultColDef={{ resizable: true, sortable: true }}
                    domLayout="autoHeight"
                  />
                </div>
              </BaseCollapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduledPaymentsCard;
