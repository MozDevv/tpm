import React, { use, useEffect, useRef, useState } from 'react';
import { message, Tabs } from 'antd';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { apiService } from '@/components/services/financeApi';
import financeEndpoints from '@/components/services/financeApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatNumber } from '@/utils/numberFormatters';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { Button } from '@mui/material';
import { parseDate } from '@/utils/dateFormatter';
import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import ListNavigation from '@/components/baseComponents/ListNavigation';

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
  exportScheduleLines,
  gridApi,
  setGridApi,
  loading,
  setSelectedLines,
  baseCardHandlers,
  openDialog,
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
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  useEffect(() => {
    // fetchBanksAndBranches();
    fetchScheduleLines(clickedItem?.id).then((data) => {
      setScheduleLines(data);
    });
    fetchDeductionsRefunds().then((data) => {
      setDeductionsAndRefunds(data);
    });
  }, []);
  useEffect(() => {
    // fetchBanksAndBranches();
    fetchScheduleLines(clickedItem?.id).then((data) => {
      setScheduleLines(data);
    });
    fetchDeductionsRefunds().then((data) => {
      setDeductionsAndRefunds(data);
    });
  }, [openDialog]);
  useEffect(() => {
    // fetchBanksAndBranches();
    fetchScheduleLines(clickedItem?.id).then((data) => {
      setScheduleLines(data);
    });
    fetchDeductionsRefunds().then((data) => {
      setDeductionsAndRefunds(data);
    });
  }, [loading]);

  const tableFields = [
    {
      field: 'documentNo',
      headerName: 'Document No',
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      type: 'text',
      required: true,
      width: 200,
    },
    {
      field: 'nationalIdNo',
      headerName: 'National ID No',
      width: 200,
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
      width: 200,
    },
    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
      width: 200,
    },
    {
      field: 'refundAmount',
      headerName: 'Refund Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
      width: 200,
    },
    {
      field: 'pensionAmount',
      headerName: 'Pension Amount',
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      required: true,
      width: 200,
    },
    {
      field: 'deductionsAndRefundId',
      headerName: 'Deductions And Refund',
      type: 'text',
      required: true,
      width: 200,
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
      width: 200,
    },
    {
      field: 'refundDescription',
      headerName: 'Refund Description',
      type: 'text',
      required: true,
      width: 200,
    },
    /**{
	"0": {
		"id": "9033fb03-0ec6-4caa-b716-7a8b7deb3fd5",
		"documentNo": "WCPS Recovery",
		"description": "WCPS Recovery",
		"netAmount": 250000,
		"grossAmount": 0,
		"refundAmount": 0,
		"pensionAmount": 0,
		"deductionsAndRefundId": "42d82a2b-b3c9-441a-bf82-fe78f7272ce3",
		"paymentId": null,
		"paymentScheduleId": "6abfa218-cef3-422d-a012-14c710d9c2d3",
		"deductionAmount": 0,
		"refundDescription": "",
		"bankCode": null,
		"bankBranchCode": null,
		"bankAccountName": null,
		"bankAccountNo": null,
		"nationalIdNo": null
	}
} */

    {
      field: 'bankCode',
      headerName: 'Bank Branch Code',
      width: 200,
    },
    {
      field: 'bankBranchId',
      headerName: 'Bank Branch',
      valueFormatter: (params) => {
        const branch = branches.find((branch) => branch.id === params.value);
        return branch?.name || '';
      },
      width: 200,
    },
    {
      field: 'bankBranchCode',
      headerName: 'Bank Branch Code',
      width: 200,
    },
    {
      field: 'bankAccountName',
      headerName: 'Bank Account Name',
      width: 200,
    },
    {
      field: 'bankAccountNo',
      headerName: 'Bank Account No',
      width: 200,
    },
  ];
  const gridApiRef = useRef(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

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
                  {/* <div className="flex flex-row gap-2 my-2 ml-5">
                    <Button
                      startIcon={
                        <img src="/excel.png" height={28} width={28} alt="" />
                      }
                      //   className="text-[14px] font-semibold"
                      sx={{
                        fontSize: '13px',
                        maxHeight: '40px',
                        fontWeight: 'normal',
                      }}
                    >
                      {' '}
                      Export to Excel
                    </Button>
                  </div> */}
                  <div className="mb-5 mt-[-10px]">
                    <ListNavigation handlers={baseCardHandlers} />
                  </div>
                  <AgGridReact
                    rowData={scheduleLines}
                    columnDefs={tableFields}
                    rowSelection="multiple"
                    defaultColDef={{ resizable: true, sortable: true }}
                    domLayout="autoHeight"
                    className="custom-grid ag-theme-quartz"
                    onGridReady={(params) => {
                      //  params.api.sizeColumnsToFit();
                      onGridReady(params);
                    }}
                    onSelectionChanged={(params) => {
                      const selectedRows = params.api.getSelectedRows();
                      console.log(selectedRows);
                      setSelectedLines(selectedRows);
                    }}
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
