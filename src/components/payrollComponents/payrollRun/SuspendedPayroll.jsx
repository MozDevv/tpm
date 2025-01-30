'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { formatNumber } from '@/utils/numberFormatters';
import PayrollPensionerDetails from './PayrollPensionerDetails';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import PayrollDeductionDetails from './PayrollDeductionDetails';
import { Backdrop, Dialog, IconButton } from '@mui/material';
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';
import RunIncrement from './RunIncrement';
import { Launch } from '@mui/icons-material';
import ViewAllEarningsDialog from './ViewAllEarningsDialog';

const SuspendedPayroll = () => {
  const columnDefs = [
    {
      headerName: 'Pensioner No',
      field: 'pensionerNo',
      sortable: true,
      filter: true,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      valueGetter: (params) => {
        const awardPrefix = params.data.awardPrefix || '';
        const pensionerNo = params.data.pensionerNo || '';
        return `${awardPrefix}${pensionerNo}`;
      },
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      headerName: 'Period',
      field: 'period',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Pensioner Name',
      field: 'firstName',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Suspension Date',
      field: 'suspensionDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      headerName: 'Suspension Period',
      field: 'suspensionPeriod',
      sortable: true,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      headerName: 'Gross Amount',
      field: 'grossAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Last Pay Gross Amount',
      field: 'lastPayGrossAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: 'Last Pay Net Amount',
      field: 'lastPayNetAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: 'Reason',
      field: 'reason.description',
      sortable: true,
      filter: true,
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,

      suspensionId: item.suspensionId,
      payrollId: item.payrollId,
      reasonId: item.reasonId,
      suspensionDate: item.suspensionDate,
      suspensionPeriod: item.suspensionPeriod,
      suspensionApprovalDate: item.suspensionApprovalDate,
      resumptionDate: item.resumptionDate,
      resumedBy: item.resumedBy,
      firstName: item.pensionerDetail?.firstName || '',
      surname: item.pensionerDetail?.surname || '',
      otherName: item.pensionerDetail?.otherName || '',
      awardPrefix: item.pensionerDetail?.awardPrefix || '',
      pensionerNo: item.pensionerDetail?.pensionerNo || '',
      pensionerCode: item.pensionerDetail?.pensionerCode || '',
      grossAmount: item.pensionerDetail?.grossAmount || 0,
      status: item.pensionerDetail?.status || '',
      startDate: item.pensionerDetail?.startDate || '',
      endDate: item.pensionerDetail?.endDate || '',
      suspensionStartDate: item.pensionerDetail?.suspensionStartDate || '',
      resumptionDate: item.pensionerDetail?.resumptionDate || '',
      lastPayDate: item.pensionerDetail?.lastPayDate || '',
      retirementDate: item.pensionerDetail?.retirementDate || '',
      lastPayGrossAmount: item.pensionerDetail?.lastPayGrossAmount || 0,
      lastPayNetAmount: item.pensionerDetail?.lastPayNetAmount || 0,
      reasonDescription: item.reason?.description || '',
      reasonType: item.reason?.reasonType || '',

      ...item,
    }));
  };

  const [computing, setComputing] = React.useState(false);

  const handlers = {
    edit: () => {},

    resumePayroll: () => {},
    approvePayrollStop: () => {},
  };

  const baseCardHandlers = {
    edit: () => {},

    resumePayroll: () => {},
    approvePayrollStop: () => {},
  };

  const trialRun = async (id) => {
    setComputing(true);
    try {
      const res = await payrollApiService.post(payrollEndpoints.trialRun, {});
      if (res.status === 200) {
        setComputing(false);
      }
    } catch (error) {
      console.log('Error computing payroll >>>>>>>>>>>:', error);
    }
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Payroll - ' + clickedItem.period
    : 'Create New Main Payroll';

  const { data: incrementMaster } = useFetchAsyncV2(
    payrollEndpoints.getIncreamentMasters,
    payrollApiService
  );

  const fields = [
    {
      name: 'pensionerNo',
      label: 'Pensioner No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'firstName',
      label: 'Pensioner Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'awardPrefix',
      label: 'Award Prefix',
      type: 'text',
      disabled: true,
    },
    {
      name: 'grossAmount',
      label: 'Gross Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      disabled: true,
    },
    {
      name: 'lastPayDate',
      label: 'Last Pay Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastPayGrossAmount',
      label: 'Last Pay Gross Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'lastPayNetAmount',
      label: 'Last Pay Net Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'suspensionDate',
      label: 'Suspension Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'suspensionPeriod',
      label: 'Suspension Period',
      type: 'date',
      disabled: true,
    },
    {
      name: 'resumptionDate',
      label: 'Resumption Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'reason.description',
      label: 'Reason',
      type: 'select',
      disabled: true,
      options: [
        { value: 'Misbehaving in Public', label: 'Misbehaving in Public' },
        { value: 'Absenteeism', label: 'Absenteeism' },
        { value: 'Others', label: 'Others' },
      ],
    },
  ];
  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        isClaim={true}
      >
        {clickedItem ? (
          <div className="flex flex-col gap-2">
            <div className=" overflow-y-auto ">
              <BaseInputCard
                fields={fields}
                apiEndpoint={payrollEndpoints.updateVendorPostingGroup}
                postApiFunction={payrollApiService.post}
                clickedItem={clickedItem}
                useRequestBody={true}
                setOpenBaseCard={setOpenBaseCard}
                disableAll={true}
              />
            </div>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            disableAll={true}
            apiEndpoint={payrollEndpoints.addVendorPostingGroup}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
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
        fetchApiEndpoint={payrollEndpoints.getSuspensions}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Suspended Payroll"
        currentTitle="Suspended Payroll"
        isPayroll={true}
      />
    </div>
  );
};

export default SuspendedPayroll;
